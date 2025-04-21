
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export interface Process {
  id: string;
  name: string;
  burstTime: number;
  arrivalTime: number;
  priority?: number;
}

interface AddProcessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddProcess: (process: Process) => void;
  editingProcess?: Process | null;
}

export function AddProcessModal({ 
  open, 
  onOpenChange, 
  onAddProcess,
  editingProcess 
}: AddProcessModalProps) {
  const [name, setName] = useState(editingProcess?.name || "");
  const [burstTime, setBurstTime] = useState<string>(editingProcess?.burstTime?.toString() || "");
  const [arrivalTime, setArrivalTime] = useState<string>(editingProcess?.arrivalTime?.toString() || "");
  const [priority, setPriority] = useState<string>(editingProcess?.priority?.toString() || "");
  
  const isEditing = !!editingProcess;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error("Please enter a process name");
      return;
    }

    const parsedBurstTime = parseFloat(burstTime);
    if (isNaN(parsedBurstTime) || parsedBurstTime <= 0) {
      toast.error("Please enter a valid burst time (greater than 0)");
      return;
    }

    const parsedArrivalTime = parseFloat(arrivalTime);
    if (isNaN(parsedArrivalTime) || parsedArrivalTime < 0) {
      toast.error("Please enter a valid arrival time (0 or greater)");
      return;
    }

    const parsedPriority = priority ? parseInt(priority) : undefined;
    if (priority && (isNaN(parsedPriority) || parsedPriority < 0)) {
      toast.error("Please enter a valid priority (0 or greater)");
      return;
    }

    const newProcess: Process = {
      id: editingProcess?.id || crypto.randomUUID(),
      name: name.trim(),
      burstTime: parsedBurstTime,
      arrivalTime: parsedArrivalTime,
      priority: parsedPriority
    };

    onAddProcess(newProcess);
    onOpenChange(false);
    
    // Reset form after submission
    setName("");
    setBurstTime("");
    setArrivalTime("");
    setPriority("");
    
    toast.success(`Process ${isEditing ? "updated" : "added"} successfully!`);
  };

  // Reset the form when the modal opens
  React.useEffect(() => {
    if (open) {
      setName(editingProcess?.name || "");
      setBurstTime(editingProcess?.burstTime?.toString() || "");
      setArrivalTime(editingProcess?.arrivalTime?.toString() || "");
      setPriority(editingProcess?.priority?.toString() || "");
    }
  }, [open, editingProcess]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Process" : "Add New Process"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Process Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Process 1"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="arrivalTime">
              Arrival Time (seconds)
              <span className="text-destructive ml-1">*</span>
            </Label>
            <Input
              id="arrivalTime"
              value={arrivalTime}
              onChange={(e) => setArrivalTime(e.target.value)}
              placeholder="e.g., 0"
              type="number"
              min="0"
              step="0.1"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="burstTime">
              Burst Time (seconds)
              <span className="text-destructive ml-1">*</span>
            </Label>
            <Input
              id="burstTime"
              value={burstTime}
              onChange={(e) => setBurstTime(e.target.value)}
              placeholder="e.g., 5"
              type="number"
              min="0.1"
              step="0.1"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="priority">
              Priority (Optional)
              <span className="text-muted-foreground ml-1 text-xs">Lower value = higher priority</span>
            </Label>
            <Input
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              placeholder="e.g., 1"
              type="number"
              min="0"
            />
          </div>
          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {isEditing ? "Update" : "Add"} Process
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
