
import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ScheduledProcess } from "@/lib/cpuScheduling";

interface GanttChartProps {
  algorithmName: string;
  scheduledProcesses: ScheduledProcess[];
}

interface ProcessTooltip {
  process: ScheduledProcess;
  position: { x: number; y: number };
}

export function GanttChart({ algorithmName, scheduledProcesses }: GanttChartProps) {
  const [tooltip, setTooltip] = useState<ProcessTooltip | null>(null);
  
  // Calculate total time span for the Gantt chart
  const endTime = Math.max(...scheduledProcesses.map(p => p.endTime), 0);
  
  // Generate a color for each process
  const processColors = new Map<string, string>();
  const colors = [
    "bg-blue-500", "bg-green-500", "bg-purple-500", "bg-yellow-500",
    "bg-pink-500", "bg-indigo-500", "bg-red-500", "bg-orange-500"
  ];
  
  scheduledProcesses.forEach((process, index) => {
    processColors.set(process.id, colors[index % colors.length]);
  });
  
  // Sort processes by start time for display
  const sortedProcesses = [...scheduledProcesses].sort((a, b) => a.startTime - b.startTime);
  
  // Generate time markers
  const timeMarkers = [];
  const markerStep = Math.max(1, Math.ceil(endTime / 10)); // Show around 10 markers
  
  for (let i = 0; i <= endTime; i += markerStep) {
    timeMarkers.push(i);
  }
  
  // Ensure the last marker is the end time
  if (timeMarkers[timeMarkers.length - 1] !== endTime) {
    timeMarkers.push(endTime);
  }
  
  return (
    <Card className="w-full mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{algorithmName} Gantt Chart</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ScrollArea className="w-full" orientation="horizontal">
          <div className="relative min-w-[600px]">
            {/* Time markers */}
            <div className="flex mb-2 border-b">
              {timeMarkers.map((time) => (
                <div 
                  key={time} 
                  className="text-xs text-muted-foreground"
                  style={{ 
                    position: "absolute", 
                    left: `${(time / endTime) * 100}%`, 
                    transform: "translateX(-50%)" 
                  }}
                >
                  {time}s
                </div>
              ))}
            </div>
            
            {/* Process bars */}
            <div className="relative h-12 my-4">
              {scheduledProcesses.map((process) => {
                const startPercent = (process.startTime / endTime) * 100;
                const widthPercent = ((process.endTime - process.startTime) / endTime) * 100;
                
                return (
                  <div
                    key={`${process.id}-${process.startTime}`}
                    className={cn(
                      "absolute h-full rounded-md flex items-center justify-center text-white text-xs transition-opacity",
                      processColors.get(process.id)
                    )}
                    style={{
                      left: `${startPercent}%`,
                      width: `${widthPercent}%`,
                    }}
                    onMouseEnter={(e) => {
                      setTooltip({
                        process,
                        position: { x: e.clientX, y: e.clientY }
                      });
                    }}
                    onMouseLeave={() => setTooltip(null)}
                  >
                    {widthPercent > 3 && process.name}
                  </div>
                );
              })}
            </div>
            
            {/* Process labels */}
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {sortedProcesses.map((process) => (
                <div key={process.id} className="flex items-center text-xs">
                  <div 
                    className={cn("w-3 h-3 rounded-full mr-2", processColors.get(process.id))}
                  />
                  <span>{process.name} ({process.startTime}s - {process.endTime}s)</span>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
        
        {/* Tooltip */}
        {tooltip && (
          <div 
            className="absolute z-50 bg-popover text-popover-foreground p-3 rounded-md shadow-md text-xs"
            style={{
              top: `${tooltip.position.y + 10}px`,
              left: `${tooltip.position.x + 10}px`,
              transform: "translateX(-100%)"
            }}
          >
            <p className="font-semibold">{tooltip.process.name}</p>
            <p>Start: {tooltip.process.startTime}s</p>
            <p>End: {tooltip.process.endTime}s</p>
            <p>Burst Time: {tooltip.process.burstTime}s</p>
            <p>Waiting Time: {tooltip.process.waitingTime}s</p>
            <p>Turnaround Time: {tooltip.process.turnaroundTime}s</p>
            <p>Response Time: {tooltip.process.responseTime}s</p>
            {tooltip.process.priority !== undefined && (
              <p>Priority: {tooltip.process.priority}</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
