"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { ActivityForm } from "./ActivityForm";

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
        <ActivityForm initialData={activity} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
