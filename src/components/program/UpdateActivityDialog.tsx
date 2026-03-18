"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Pencil } from "lucide-react";
import { useAction } from "next-safe-action/hooks";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { ActivityForm } from "./ActivityForm";
import { updateActivityAction } from "@/actions/activity";

interface UpdateActivityDialogProps {
  activity: {
    id: string;
    name: string;
    type: string;
    durationMinutes: number | null;
    location: string | null;
    materials: string | null;
    description: string | null;
  };
}

export function UpdateActivityDialog({ activity }: UpdateActivityDialogProps) {
  const [open, setOpen] = useState(false);
  const { execute, isExecuting, result } = useAction(updateActivityAction, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        toast.success(data.message);
        setOpen(false);
      }
    },
    onError: ({ error }) => {
      toast.error(error.serverError || "Nastala chyba při ukládání.");
    }
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" title="Upravit aktivitu">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Upravit aktivitu</DialogTitle>
        </DialogHeader>
        <ActivityForm
          action={(formData) => execute(Object.fromEntries(formData.entries()) as any)}
          isPending={isExecuting}
          validationErrors={result.validationErrors as any}
          initialData={activity}
        />
      </DialogContent>
    </Dialog>
  );
}
