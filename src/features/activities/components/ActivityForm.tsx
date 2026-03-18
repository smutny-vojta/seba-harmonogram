"use client";

import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";

import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Label } from "@/shared/components/ui/label";

import { createActivityAction, updateActivityAction } from "../actions";

const ACTIVITY_TYPES = [
  { value: "game", label: "Hra" },
  { value: "sport", label: "Sport" },
  { value: "organizational", label: "Organizační" },
  { value: "other", label: "Ostatní" },
] as const;

type ActivityType = (typeof ACTIVITY_TYPES)[number]["value"];

interface ActivityData {
  id: string;
  name: string;
  type: string;
  durationMinutes?: number | null;
  location?: string | null;
  materials?: string | null;
  description?: string | null;
}

interface ActivityFormProps {
  initialData?: ActivityData;
  onSuccess: () => void;
}

export function ActivityForm({ initialData, onSuccess }: ActivityFormProps) {
  const isUpdate = !!initialData;

  const { Field, handleSubmit, state } = useForm({
    defaultValues: {
      name: initialData?.name ?? "",
      type: (initialData?.type ?? "game") as ActivityType,
      durationMinutes: initialData?.durationMinutes ?? (null as number | null),
      location: initialData?.location ?? "",
      materials: initialData?.materials ?? "",
      description: initialData?.description ?? "",
    },
    onSubmit: async ({ value }) => {
      const result = isUpdate
        ? await updateActivityAction({ id: initialData.id, ...value })
        : await createActivityAction(value);

      if (result?.serverError) {
        toast.error(result.serverError);
        return;
      }
      toast.success(result?.data?.message ?? "Uloženo");
      onSuccess();
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      className="space-y-4"
    >
      {/* Název */}
      <Field
        name="name"
        validators={{
          onChange: ({ value }: { value: string }) =>
            !value.trim() ? "Název aktivity je povinný" : undefined,
        }}
      >
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Název aktivity *</Label>
            <Input
              id={field.name}
              name={field.name}
              placeholder="Např. Boj o vlajku"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              disabled={state.isSubmitting}
              aria-invalid={
                field.state.meta.isTouched && field.state.meta.errors.length > 0
              }
            />
            {field.state.meta.isTouched &&
              field.state.meta.errors.length > 0 && (
                <p className="text-destructive text-sm font-medium">
                  {String(field.state.meta.errors[0])}
                </p>
              )}
          </div>
        )}
      </Field>

      {/* Typ */}
      <Field name="type">
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Typ *</Label>
            <Select
              value={field.state.value}
              onValueChange={(v) => field.handleChange(v as ActivityType)}
            >
              <SelectTrigger id={field.name}>
                <SelectValue placeholder="Vyberte typ aktivity" />
              </SelectTrigger>
              <SelectContent>
                {ACTIVITY_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </Field>

      {/* Délka */}
      <Field
        name="durationMinutes"
        validators={{
          onChange: ({ value }: { value: number | null }) =>
            value !== null && value <= 0 ? "Délka musí být kladná" : undefined,
        }}
      >
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Doba trvání (minuty)</Label>
            <Input
              id={field.name}
              name={field.name}
              type="number"
              placeholder="Např. 60"
              value={field.state.value ?? ""}
              onChange={(e) =>
                field.handleChange(
                  e.target.value === "" ? null : Number(e.target.value),
                )
              }
              onBlur={field.handleBlur}
              disabled={state.isSubmitting}
            />
            {field.state.meta.isTouched &&
              field.state.meta.errors.length > 0 && (
                <p className="text-destructive text-sm font-medium">
                  {String(field.state.meta.errors[0])}
                </p>
              )}
          </div>
        )}
      </Field>

      {/* Místo */}
      <Field name="location">
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Místo konání</Label>
            <Input
              id={field.name}
              name={field.name}
              placeholder="Např. Les u tábora"
              value={field.state.value ?? ""}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              disabled={state.isSubmitting}
            />
          </div>
        )}
      </Field>

      {/* Materiál */}
      <Field name="materials">
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Potřebný materiál</Label>
            <Input
              id={field.name}
              name={field.name}
              placeholder="Např. 3 míče, fáborky..."
              value={field.state.value ?? ""}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              disabled={state.isSubmitting}
            />
          </div>
        )}
      </Field>

      {/* Popis */}
      <Field name="description">
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Popis a pravidla</Label>
            <Textarea
              id={field.name}
              name={field.name}
              placeholder="Stručný popis pravidel..."
              className="resize-none"
              value={field.state.value ?? ""}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              disabled={state.isSubmitting}
            />
          </div>
        )}
      </Field>

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={state.isSubmitting}>
          {state.isSubmitting
            ? "Ukládám..."
            : isUpdate
              ? "Uložit změny"
              : "Uložit aktivitu"}
        </Button>
      </div>
    </form>
  );
}
