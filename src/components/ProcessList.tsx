
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
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
      <Alert className="bg-secondary/30 text-foreground border-dashed">
        <AlertDescription>
          No processes have been added yet. Add processes using the button above.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Process List</CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onClearAll}
            className="text-destructive hover:text-destructive"
          >
            Clear All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Process Name</TableHead>
                <TableHead>Burst Time (s)</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead className="w-[100px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {processes.map((process) => (
                <TableRow key={process.id} className="animate-slide-in">
                  <TableCell className="font-medium">{process.name}</TableCell>
                  <TableCell>{process.burstTime}</TableCell>
                  <TableCell>{process.priority ?? "N/A"}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(process)}
                      className="h-8 w-8"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(process.id)}
                      className="h-8 w-8 text-destructive"
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
