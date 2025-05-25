
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Hash, Cpu } from "lucide-react";
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
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-2xl blur-xl"></div>
        <Alert className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-slate-600 to-slate-700 rounded-lg">
              <Hash className="h-4 w-4 text-slate-300" />
            </div>
            <AlertDescription className="text-slate-300 text-lg">
              No processes configured yet. Create your first process to begin the simulation setup.
            </AlertDescription>
          </div>
        </Alert>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-2xl blur-xl"></div>
      <Card className="relative w-full border-0 bg-white/5 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden">
        <CardHeader className="pb-4 bg-gradient-to-r from-slate-800/30 to-slate-900/30">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                <Cpu className="h-5 w-5 text-white" />
              </div>
              <CardTitle className="text-xl text-white font-bold">Process Configuration</CardTitle>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onClearAll}
              className="border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500/20 hover:text-red-200 hover:border-red-400/50 rounded-xl backdrop-blur-sm"
            >
              Clear All
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700/30 hover:bg-slate-700/20 bg-slate-800/20">
                  <TableHead className="text-slate-300 font-semibold">Process ID</TableHead>
                  <TableHead className="text-slate-300 font-semibold">Process Name</TableHead>
                  <TableHead className="text-slate-300 font-semibold">Arrival Time (s)</TableHead>
                  <TableHead className="text-slate-300 font-semibold">Burst Time (s)</TableHead>
                  <TableHead className="text-slate-300 font-semibold">Priority</TableHead>
                  <TableHead className="w-[120px] text-right text-slate-300 font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {processes.map((process, index) => (
                  <TableRow 
                    key={process.id} 
                    className="animate-slide-in border-slate-700/20 hover:bg-white/5 transition-all duration-200"
                    style={{animationDelay: `${index * 0.1}s`}}
                  >
                    <TableCell className="font-mono text-xs text-slate-400 bg-slate-700/20 border-r border-slate-700/30">
                      <div className="px-2 py-1 bg-slate-600/30 rounded-md border border-slate-600/50">
                        {process.id}
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold text-white">{process.name}</TableCell>
                    <TableCell className="text-slate-300">{process.arrivalTime}</TableCell>
                    <TableCell className="text-slate-300">{process.burstTime}</TableCell>
                    <TableCell className="text-slate-300">{process.priority ?? "N/A"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(process)}
                          className="h-8 w-8 text-blue-400 hover:bg-blue-500/20 hover:text-blue-300 rounded-lg"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDelete(process.id)}
                          className="h-8 w-8 text-red-400 hover:bg-red-500/20 hover:text-red-300 rounded-lg"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
