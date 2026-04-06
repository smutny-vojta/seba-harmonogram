"use client";

import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import {
  createActivityAction,
  deleteActivityAction,
  updateActivityAction,
} from "@/features/activities/actions";
import {
  ACTIVITY_CATEGORIES,
  ACTIVITY_CATEGORIES_ARRAY,
} from "@/features/activities/consts";
import type {
  ActivityItemType,
  NewActivityType,
} from "@/features/activities/types";
import { useAction } from "next-safe-action/hooks";
import { LucidePencil, LucidePlus, LucideTrash2 } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

type ActivityLocationOption = {
  id: string;
  name: string;
};

function parseMaterials(raw: string) {
  return raw
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

function parseActivityFormData(formData: FormData) {
  const description = String(formData.get("description") ?? "").trim();
  const category = String(
    formData.get("category") ?? "jine",
  ) as NewActivityType["category"];

  return {
    title: String(formData.get("title") ?? "").trim(),
    description: description.length > 0 ? description : undefined,
    locationId: String(formData.get("locationId") ?? ""),
    category,
    defaultMaterials: parseMaterials(
      String(formData.get("defaultMaterials") ?? ""),
    ),
  } satisfies NewActivityType;
}

function ActivityFormFields({
  locations,
  defaultValues,
  showRequiredMarkers = false,
}: {
  locations: ActivityLocationOption[];
  defaultValues?: Partial<ActivityItemType>;
  showRequiredMarkers?: boolean;
}) {
  return (
    <FieldGroup className="gap-y-4">
      <Field>
        <Label htmlFor="title">
          Název aktivity
          {showRequiredMarkers && <span className="ml-1 text-red-500">*</span>}
        </Label>
        <Input
          id="title"
          name="title"
          defaultValue={defaultValues?.title}
          required
        />
      </Field>
      <Field>
        <Label htmlFor="description">Popis</Label>
        <Textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={defaultValues?.description ?? ""}
        />
      </Field>
      <Field>
        <Label htmlFor="locationId">
          Lokace
          {showRequiredMarkers && <span className="ml-1 text-red-500">*</span>}
        </Label>
        <select
          id="locationId"
          name="locationId"
          defaultValue={defaultValues?.locationId ?? ""}
          required
          className="border-input focus-visible:border-ring focus-visible:ring-ring/50 flex h-9 w-full rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-3"
        >
          <option value="" disabled>
            Vyberte lokaci
          </option>
          {locations.map((location) => (
            <option key={location.id} value={location.id}>
              {location.name}
            </option>
          ))}
        </select>
      </Field>
      <Field>
        <Label htmlFor="category">Kategorie</Label>
        <select
          id="category"
          name="category"
          defaultValue={defaultValues?.category ?? "jine"}
          className="border-input focus-visible:border-ring focus-visible:ring-ring/50 flex h-9 w-full rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-3"
        >
          {ACTIVITY_CATEGORIES_ARRAY.map((category) => (
            <option key={category} value={category}>
              {ACTIVITY_CATEGORIES[category].name}
            </option>
          ))}
        </select>
      </Field>
      <Field>
        <Label htmlFor="defaultMaterials">
          Výchozí materiál (odděleno čárkou)
        </Label>
        <Textarea
          id="defaultMaterials"
          name="defaultMaterials"
          rows={2}
          defaultValue={defaultValues?.defaultMaterials?.join(", ") ?? ""}
        />
      </Field>
    </FieldGroup>
  );
}

export function ActivitiesAddDialog({
  locations,
}: {
  locations: ActivityLocationOption[];
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [open, setOpen] = useState(false);

  const { execute, isExecuting } = useAction(createActivityAction, {
    onSuccess: () => {
      toast.success("Aktivita byla úspěšně přidána.");
      setOpen(false);
      formRef.current?.reset();
    },
    onError: () => {
      toast.error("Chyba při přidávání aktivity.");
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm">
          <LucidePlus size={16} />
          Přidat novou aktivitu
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form
          ref={formRef}
          onSubmit={(e) => {
            e.preventDefault();
            execute(parseActivityFormData(new FormData(e.currentTarget)));
          }}
          className="flex flex-col gap-y-4"
        >
          <DialogHeader>
            <DialogTitle>Přidání nové aktivity</DialogTitle>
            <DialogDescription>
              Vyplňte prosím následující údaje pro přidání nové aktivity.
            </DialogDescription>
          </DialogHeader>
          <ActivityFormFields locations={locations} showRequiredMarkers />
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

export function ActivitiesEditDialog({
  activity,
  locations,
}: {
  activity: ActivityItemType;
  locations: ActivityLocationOption[];
}) {
  const [open, setOpen] = useState(false);

  const { execute, isExecuting } = useAction(updateActivityAction, {
    onSuccess: () => {
      toast.success(`Aktivita "${activity.title}" byla úspěšně upravena.`);
      setOpen(false);
    },
    onError: () => {
      toast.error(`Chyba při úpravě aktivity "${activity.title}".`);
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          size="icon-sm"
          aria-label={`Upravit aktivitu "${activity.title}"`}
        >
          <LucidePencil size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            execute({
              id: activity.id,
              ...parseActivityFormData(new FormData(e.currentTarget)),
            });
          }}
          className="flex flex-col gap-y-4"
        >
          <DialogHeader>
            <DialogTitle>{`Úprava aktivity "${activity.title}"`}</DialogTitle>
          </DialogHeader>
          <ActivityFormFields locations={locations} defaultValues={activity} />
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

export function ActivitiesDeleteDialog({
  id,
  title,
}: {
  id: string;
  title: string;
}) {
  const [open, setOpen] = useState(false);

  const { execute, isExecuting } = useAction(deleteActivityAction, {
    onSuccess: () => {
      toast.success(`Aktivita "${title}" byla úspěšně smazána.`);
      setOpen(false);
    },
    onError: () => {
      toast.error(`Chyba při mazání aktivity "${title}".`);
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="destructive"
          size="icon-sm"
          aria-label={`Smazat aktivitu "${title}"`}
        >
          <LucideTrash2 size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{`Smazat aktivitu "${title}"?`}</DialogTitle>
          <DialogDescription>
            Opravdu chcete smazat tuto aktivitu?
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
