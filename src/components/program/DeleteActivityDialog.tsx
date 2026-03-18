"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { useFormStatus } from "react-dom";
import { useAction } from "next-safe-action/hooks";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { deleteActivityAction } from "@/actions/activity";

function DeleteButton({ pending }: { pending: boolean }) {
  return (
    <Button variant="destructive" type="submit" disabled={pending}>
      {pending ? "Mažu..." : "Smazat"}
    </Button>
  );
}

interface DeleteActivityDialogProps {
  activity: {
    id: string;
    name: string;
  };
}

export function DeleteActivityDialog({ activity }: DeleteActivityDialogProps) {
  const [open, setOpen] = useState(false);
  const { execute, isExecuting } = useAction(deleteActivityAction, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        toast.success(data.message);
        setOpen(false);
      }
    },
    onError: ({ error }) => {
      toast.error(error.serverError || "Nepodařilo se smazat aktivitu.");
    }
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" title="Smazat aktivitu">
          <Trash2 className="w-4 h-4 text-destructive" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Naprosto určitě?</DialogTitle>
          <DialogDescription>
            Tato akce je nevratná. Opravdu si přejete smazat aktivitu{" "}
            <strong>{activity.name}</strong>?
          </DialogDescription>
        </DialogHeader>
        <form action={(formData) => execute(Object.fromEntries(formData.entries()) as any)}>
          <input type="hidden" name="id" value={activity.id} />
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Zrušit
            </Button>
            <DeleteButton pending={isExecuting} />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
