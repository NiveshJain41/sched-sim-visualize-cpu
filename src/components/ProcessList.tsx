
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Hash } from "lucide-react";
import { Process } from "./AddProcessModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ProcessListProps {
  processes: Process[];
  onEdit: (process: Process) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

export function ProcessList({ processes, onEdit, onDelete, onClearAll }: ProcessListProps) {
  if (processes.length === 0) {
    return (
      <Alert className="bg-slate-800/30 border-slate-700/50 backdrop-blur-sm">
        <Hash className="h-4 w-4 text-slate-400" />
        <AlertDescription className="text-slate-300">
          No processes have been added yet. Add processes using the button above to get started.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="w-full border-slate-700/50 bg-slate-800/30 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg text-white">Process List</CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onClearAll}
            className="border-red-600/50 text-red-400 hover:bg-red-600/10 hover:text-red-300"
          >
            Clear All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-slate-700/50 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700/50 hover:bg-slate-700/30">
                <TableHead className="text-slate-300">Process ID</TableHead>
                <TableHead className="text-slate-300">Process Name</TableHead>
                <TableHead className="text-slate-300">Arrival Time (s)</TableHead>
                <TableHead className="text-slate-300">Burst Time (s)</TableHead>
                <TableHead className="text-slate-300">Priority</TableHead>
                <TableHead className="w-[100px] text-right text-slate-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {processes.map((process, index) => (
                <TableRow 
                  key={process.id} 
                  className="animate-slide-in border-slate-700/50 hover:bg-slate-700/20"
                >
                  <TableCell className="font-mono text-xs text-slate-400 bg-slate-700/30">
                    {process.id}
                  </TableCell>
                  <TableCell className="font-medium text-white">{process.name}</TableCell>
                  <TableCell className="text-slate-300">{process.arrivalTime}</TableCell>
                  <TableCell className="text-slate-300">{process.burstTime}</TableCell>
                  <TableCell className="text-slate-300">{process.priority ?? "N/A"}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(process)}
                      className="h-8 w-8 text-blue-400 hover:bg-blue-600/20 hover:text-blue-300"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(process.id)}
                      className="h-8 w-8 text-red-400 hover:bg-red-600/20 hover:text-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
