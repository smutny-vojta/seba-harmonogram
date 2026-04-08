"use client";

import { cs } from "date-fns/locale";
import {
  LucideCalendarRange,
  LucidePencil,
  LucidePlus,
  LucideTrash2,
} from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useEffect, useState } from "react";
import type { DateRange } from "react-day-picker";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingButton } from "@/components/ui/loading-button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  createTermAction,
  deleteTermAction,
  updateTermAction,
} from "@/features/terms/actions";
import type { TermItemType } from "@/features/terms/types";
import {
  dateToInputValue,
  extractActionErrorReason,
  formatRangeLabel,
  inputValueToDate,
  parseTermFormData,
  splitDateTimeValue,
} from "@/features/terms/utils";
import { parsePragueDateTimeInput } from "@/lib/date-time/prague";

function DateRangePicker({
  from,
  to,
  onFromChange,
  onToChange,
}: {
  from: string;
  to: string;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
}) {
  const selectedRange: DateRange | undefined = {
    from: inputValueToDate(from),
    to: inputValueToDate(to),
  };
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState<Date>(selectedRange?.from ?? new Date());
  const [firstPickAt, setFirstPickAt] = useState<Date | null>(null);

  useEffect(() => {
    if (selectedRange?.from) {
      setMonth(selectedRange.from);
    }
  }, [selectedRange?.from]);

  useEffect(() => {
    if (!open) {
      setFirstPickAt(null);
    }
  }, [open]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start text-left font-normal"
        >
          <LucideCalendarRange className="mr-2" size={16} />
          {formatRangeLabel(from, to)}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          mode="range"
          month={month}
          locale={cs}
          onMonthChange={setMonth}
          defaultMonth={selectedRange?.from}
          selected={selectedRange}
          onSelect={(range) => {
            onFromChange(range?.from ? dateToInputValue(range.from) : "");
            onToChange(range?.to ? dateToInputValue(range.to) : "");

            if (!range?.from) {
              setFirstPickAt(null);
              return;
            }

            if (!firstPickAt) {
              setFirstPickAt(range.from);
              return;
            }

            if (range.to) {
              setOpen(false);
              setFirstPickAt(null);
            }
          }}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  );
}

function TermFormFields({
  defaultValues,
  showRequiredMarkers = false,
}: {
  defaultValues?: Partial<TermItemType>;
  showRequiredMarkers?: boolean;
}) {
  const startDefault = splitDateTimeValue(defaultValues?.startsAt, "14:00");
  const endDefault = splitDateTimeValue(defaultValues?.endsAt, "10:30");

  const [startDate, setStartDate] = useState(startDefault.date);
  const [endDate, setEndDate] = useState(endDefault.date);

  useEffect(() => {
    setStartDate(startDefault.date);
    setEndDate(endDefault.date);
  }, [startDefault.date, endDefault.date]);

  return (
    <FieldGroup className="gap-y-4">
      <Field>
        <Label>
          Rozsah turnusu
          {showRequiredMarkers ? (
            <span className="ml-1 text-red-500">*</span>
          ) : null}
        </Label>
        <DateRangePicker
          from={startDate}
          to={endDate}
          onFromChange={setStartDate}
          onToChange={setEndDate}
        />
        <input type="hidden" name="startsAtDate" value={startDate} />
        <input type="hidden" name="endsAtDate" value={endDate} />
      </Field>

      <Field>
        <Label htmlFor="startsAtTime">
          Čas začátku
          {showRequiredMarkers ? (
            <span className="ml-1 text-red-500">*</span>
          ) : null}
        </Label>
        <Input
          id="startsAtTime"
          name="startsAtTime"
          type="time"
          lang="cs-CZ"
          step={60}
          defaultValue={startDefault.time}
          required
          className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
        />
      </Field>

      <Field>
        <Label htmlFor="endsAtTime">
          Čas konce
          {showRequiredMarkers ? (
            <span className="ml-1 text-red-500">*</span>
          ) : null}
        </Label>
        <Input
          id="endsAtTime"
          name="endsAtTime"
          type="time"
          lang="cs-CZ"
          step={60}
          defaultValue={endDefault.time}
          required
          className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
        />
      </Field>
    </FieldGroup>
  );
}

export function TermsAddDialog({ nextOrder }: { nextOrder: number }) {
  const [open, setOpen] = useState(false);

  const { execute, isExecuting } = useAction(createTermAction, {
    onSuccess: () => {
      toast.success("Turnus byl úspěšně přidán.");
      setOpen(false);
    },
    onError: (e) => {
      toast.error(extractActionErrorReason(e));
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <LucidePlus size={16} />
          Přidat turnus
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form
          className="flex flex-col gap-y-4"
          onSubmit={(event) => {
            event.preventDefault();

            try {
              execute(
                parseTermFormData(
                  new FormData(event.currentTarget),
                  parsePragueDateTimeInput,
                ),
              );
            } catch (error) {
              toast.error(
                error instanceof Error
                  ? error.message
                  : "Formulář obsahuje chybná data.",
              );
            }
          }}
        >
          <DialogHeader>
            <DialogTitle className="text-lg">{`${nextOrder}. turnus`}</DialogTitle>
            <DialogDescription>
              Vyplňte základní údaje pro vytvoření nového turnusu.
            </DialogDescription>
          </DialogHeader>

          <TermFormFields showRequiredMarkers />

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Zrušit</Button>
            </DialogClose>
            <LoadingButton
              type="submit"
              isLoading={isExecuting}
              loadingText="Vytvářím..."
            >
              Vytvořit
            </LoadingButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function TermsEditDialog({ term }: { term: TermItemType }) {
  const [open, setOpen] = useState(false);

  const { execute, isExecuting } = useAction(updateTermAction, {
    onSuccess: () => {
      toast.success(`Turnus "${term.name}" byl úspěšně upraven.`);
      setOpen(false);
    },
    onError: () => {
      toast.error(`Chyba při úpravě turnusu "${term.name}".`);
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          size="icon-sm"
          aria-label={`Upravit turnus "${term.name}"`}
        >
          <LucidePencil size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form
          className="flex flex-col gap-y-4"
          onSubmit={(event) => {
            event.preventDefault();

            try {
              execute({
                id: term.id,
                ...parseTermFormData(
                  new FormData(event.currentTarget),
                  parsePragueDateTimeInput,
                ),
              });
            } catch (error) {
              toast.error(
                error instanceof Error
                  ? error.message
                  : "Formulář obsahuje chybná data.",
              );
            }
          }}
        >
          <DialogHeader>
            <DialogTitle>{`Úprava turnusu "${term.name}"`}</DialogTitle>
          </DialogHeader>

          <TermFormFields defaultValues={term} />

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Zrušit</Button>
            </DialogClose>
            <LoadingButton
              type="submit"
              isLoading={isExecuting}
              loadingText="Ukládám..."
            >
              Uložit změny
            </LoadingButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function TermsDeleteDialog({ id, name }: { id: string; name: string }) {
  const [open, setOpen] = useState(false);

  const { execute, isExecuting } = useAction(deleteTermAction, {
    onSuccess: () => {
      toast.success(`Turnus "${name}" byl úspěšně smazán.`);
      setOpen(false);
    },
    onError: () => {
      toast.error(`Chyba při mazání turnusu "${name}".`);
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="destructive"
          size="icon-sm"
          aria-label={`Smazat turnus "${name}"`}
        >
          <LucideTrash2 size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{`Smazat turnus "${name}"?`}</DialogTitle>
          <DialogDescription>
            Opravdu chcete smazat tento turnus?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Zrušit</Button>
          </DialogClose>
          <LoadingButton
            variant="destructive"
            isLoading={isExecuting}
            loadingText="Mažu..."
            onClick={() => execute({ id })}
          >
            Smazat
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
