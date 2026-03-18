"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
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
import { createActivityAction } from "@/actions/activity";

export function CreateActivityDialog() {
  const [open, setOpen] = useState(false);
  
  const { execute, isExecuting, result } = useAction(createActivityAction, {
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
        <Button>
          <Plus className="mr-2" />
          Přidat aktivitu
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Nová aktivita</DialogTitle>
        </DialogHeader>
        <ActivityForm 
          action={(formData) => execute(Object.fromEntries(formData.entries()) as any)} 
          isPending={isExecuting}
          validationErrors={result.validationErrors as any}
        />
      </DialogContent>
    </Dialog>
  );
}
