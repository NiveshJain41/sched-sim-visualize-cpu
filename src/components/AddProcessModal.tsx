
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
  onAddProcess: (process: Omit<Process, 'id'>) => void;
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

    const processData = {
      name: name.trim(),
      burstTime: parsedBurstTime,
      arrivalTime: parsedArrivalTime,
      priority: parsedPriority
    };

    onAddProcess(processData);
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
      <DialogContent className="sm:max-w-[425px] bg-slate-800 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-white">{isEditing ? "Edit Process" : "Add New Process"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-slate-200">Process Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Process 1"
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="arrivalTime" className="text-slate-200">
              Arrival Time (seconds)
              <span className="text-red-400 ml-1">*</span>
            </Label>
            <Input
              id="arrivalTime"
              value={arrivalTime}
              onChange={(e) => setArrivalTime(e.target.value)}
              placeholder="e.g., 0"
              type="number"
              min="0"
              step="0.1"
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="burstTime" className="text-slate-200">
              Burst Time (seconds)
              <span className="text-red-400 ml-1">*</span>
            </Label>
            <Input
              id="burstTime"
              value={burstTime}
              onChange={(e) => setBurstTime(e.target.value)}
              placeholder="e.g., 5"
              type="number"
              min="0.1"
              step="0.1"
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="priority" className="text-slate-200">
              Priority (Optional)
              <span className="text-slate-400 ml-1 text-xs">Lower value = higher priority</span>
            </Label>
            <Input
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              placeholder="e.g., 1"
              type="number"
              min="0"
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
            />
          </div>
          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-slate-600 text-slate-200 hover:bg-slate-700"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
            >
              {isEditing ? "Update" : "Add"} Process
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
