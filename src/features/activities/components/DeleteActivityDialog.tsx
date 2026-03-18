"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { deleteActivityAction } from "../actions";

interface DeleteActivityDialogProps {
  activity: {
    id: string;
    name: string;
  };
}

export function DeleteActivityDialog({ activity }: DeleteActivityDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteActivityAction({ id: activity.id });
      if (result?.serverError) {
        toast.error(result.serverError);
        return;
      }
      toast.success(result?.data?.message ?? "Aktivita smazána");
      setOpen(false);
    });
  };

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
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            Zrušit
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? "Mažu..." : "Smazat"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
