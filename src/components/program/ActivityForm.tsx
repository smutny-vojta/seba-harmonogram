"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

function SubmitButton({ isUpdate, pending }: { isUpdate?: boolean, pending: boolean }) {
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Ukládám..." : isUpdate ? "Uložit změny" : "Uložit aktivitu"}
    </Button>
  );
}

interface ActivityFormProps {
  action: (formData: FormData) => void;
  isPending: boolean;
  validationErrors?: Record<string, { _errors?: string[] } | undefined>;
  initialData?: {
    id: string;
    name: string;
    type: string;
    durationMinutes?: number | null;
    location?: string | null;
    materials?: string | null;
    description?: string | null;
  };
}

export function ActivityForm({ action, isPending, validationErrors, initialData }: ActivityFormProps) {
  const isUpdate = !!initialData;

  return (
    <form action={action} className="space-y-4">
      {isUpdate && <input type="hidden" name="id" value={initialData.id} />}

      <div className="space-y-2">
        <Label htmlFor="name">Název aktivity *</Label>
        <Input 
          id="name" 
          name="name" 
          placeholder="Např. Boj o vlajku" 
          defaultValue={initialData?.name}
        />
        {validationErrors?.name?._errors && (
          <p className="text-destructive text-sm font-medium">
            {validationErrors.name._errors[0]}
          </p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="type">Typ *</Label>
        <Select name="type" defaultValue={initialData?.type ?? "game"}>
          <SelectTrigger>
            <SelectValue placeholder="Vyberte typ aktivity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="game">Hra</SelectItem>
            <SelectItem value="sport">Sport</SelectItem>
            <SelectItem value="organizational">Organizační</SelectItem>
            <SelectItem value="other">Ostatní</SelectItem>
          </SelectContent>
        </Select>
        {validationErrors?.type?._errors && (
          <p className="text-destructive text-sm font-medium">
            {validationErrors.type._errors[0]}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="durationMinutes">Doba trvání (minuty)</Label>
        <Input 
          id="durationMinutes" 
          name="durationMinutes" 
          type="number" 
          placeholder="Např. 60" 
          defaultValue={initialData?.durationMinutes ?? ""}
        />
        {validationErrors?.durationMinutes?._errors && (
          <p className="text-destructive text-sm font-medium">
            {validationErrors.durationMinutes._errors[0]}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Místo konání</Label>
        <Input 
          id="location" 
          name="location" 
          placeholder="Např. Les u tábora" 
          defaultValue={initialData?.location ?? ""}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="materials">Potřebný materiál</Label>
        <Input 
          id="materials" 
          name="materials" 
          placeholder="Např. 3 míče, fáborky..." 
          defaultValue={initialData?.materials ?? ""}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Popis a pravidla</Label>
        <Textarea 
          id="description"
          name="description"
          placeholder="Stručný popis pravidel..." 
          className="resize-none"
          defaultValue={initialData?.description ?? ""}
        />
      </div>

      <div className="flex justify-end pt-4">
        <SubmitButton isUpdate={isUpdate} pending={isPending} />
      </div>
    </form>
  );
}
