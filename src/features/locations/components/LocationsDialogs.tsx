/**
 * Soubor: src/features/locations/components/LocationsDialogs.tsx
 * Ucel: UI komponenta feature "locations".
 * Parametry/Vstupy: Props pro vykresleni dat a obsluhu uzivatelskych akci.
 * Pozadavky: Drzet komponentu zamerenou na prezentaci/UX a respektovat feature schema.
 */

"use client";

import { LucidePencil, LucidePlus, LucideTrash2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
  createLocationAction,
  deleteLocationAction,
  updateLocationAction,
} from "@/features/locations/actions";
import type { LocationItemType } from "@/features/locations/types";
import { parseLocationFormData } from "@/features/locations/utils";

function LocationFormFields({
  defaultValues,
  showRequiredMarkers = false,
}: {
  defaultValues?: Partial<LocationItemType>;
  showRequiredMarkers?: boolean;
}) {
  return (
    <FieldGroup className="gap-y-4">
      <Field>
        <Label htmlFor="name">
          Název lokace
          {showRequiredMarkers && <span className="ml-1 text-red-500">*</span>}
        </Label>
        <Input
          id="name"
          name="name"
          defaultValue={defaultValues?.name}
          required
        />
      </Field>
      <Field orientation="horizontal">
        <Checkbox
          id="restrictedAccess"
          name="restrictedAccess"
          defaultChecked={defaultValues?.restrictedAccess}
        />
        <Label htmlFor="restrictedAccess">Omezený přístup</Label>
      </Field>
      <Field orientation="horizontal">
        <Checkbox
          id="indoor"
          name="indoor"
          defaultChecked={defaultValues?.indoor}
        />
        <Label htmlFor="indoor">Vnitřní</Label>
      </Field>
      <Field orientation="horizontal">
        <Checkbox
          id="offsite"
          name="offsite"
          defaultChecked={defaultValues?.offsite}
        />
        <Label htmlFor="offsite">Mimo tábor</Label>
      </Field>
    </FieldGroup>
  );
}

export function LocationsAddDialog() {
  const formRef = useRef<HTMLFormElement>(null);
  const [open, setOpen] = useState(false);

  const { execute, isExecuting } = useAction(createLocationAction, {
    onSuccess: () => {
      toast.success(`Lokace byla úspěšně přidána.`);
      setOpen(false);
      formRef.current?.reset();
    },
    onError: () => {
      toast.error(`Chyba při přidávání lokace.`);
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm">
          <LucidePlus size={16} />
          Přidat novou lokaci
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form
          ref={formRef}
          onSubmit={(e) => {
            e.preventDefault();
            execute(parseLocationFormData(new FormData(e.currentTarget)));
          }}
          className="flex flex-col gap-y-4"
        >
          <DialogHeader>
            <DialogTitle>Přidání nové lokace</DialogTitle>
            <DialogDescription>
              Vyplňte prosím následující údaje pro přidání nové lokace.
            </DialogDescription>
          </DialogHeader>
          <LocationFormFields showRequiredMarkers />
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

export function LocationsEditDialog({
  location,
}: {
  location: LocationItemType;
}) {
  const [open, setOpen] = useState(false);

  const { execute, isExecuting } = useAction(updateLocationAction, {
    onSuccess: () => {
      toast.success(`Lokace "${location.name}" byla úspěšně upravena.`);
      setOpen(false);
    },
    onError: () => {
      toast.error(`Chyba při úpravě lokace "${location.name}".`);
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          size="icon-sm"
          aria-label={`Upravit lokaci "${location.name}"`}
        >
          <LucidePencil size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            execute({
              id: location.id,
              ...parseLocationFormData(new FormData(e.currentTarget)),
            });
          }}
          className="flex flex-col gap-y-4"
        >
          <DialogHeader>
            <DialogTitle>{`Úprava lokace "${location.name}"`}</DialogTitle>
          </DialogHeader>
          <LocationFormFields defaultValues={location} />
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

export function LocationsDeleteDialog({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  const [open, setOpen] = useState(false);

  const { execute, isExecuting } = useAction(deleteLocationAction, {
    onSuccess: () => {
      toast.success(`Lokalita "${name}" byla úspěšně smazána.`);
      setOpen(false);
    },
    onError: () => {
      toast.error(`Chyba při mazání lokality "${name}".`);
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="destructive"
          size="icon-sm"
          aria-label={`Smazat lokaci "${name}"`}
        >
          <LucideTrash2 size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{`Smazat lokalitu "${name}"?`}</DialogTitle>
          <DialogDescription>
            Opravdu chcete smazat tuto lokalitu?
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
