
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlgorithmResult } from "@/lib/cpuScheduling";
import { Badge } from "@/components/ui/badge";

interface BestAlgorithmAnalysisProps {
  results: AlgorithmResult[];
}

export function BestAlgorithmAnalysis({ results }: BestAlgorithmAnalysisProps) {
  if (results.length === 0) {
    return null;
  }

  // Find the best algorithm for each metric
  const bestWaitingTime = results.reduce((prev, curr) => 
    prev.averageWaitingTime < curr.averageWaitingTime ? prev : curr
  );
  
  const bestTurnaround = results.reduce((prev, curr) => 
    prev.averageTurnaroundTime < curr.averageTurnaroundTime ? prev : curr
  );
  
  const bestThroughput = results.reduce((prev, curr) => 
    prev.throughput > curr.throughput ? prev : curr
  );
  
  const bestCpuUtil = results.reduce((prev, curr) => 
    prev.cpuUtilization > curr.cpuUtilization ? prev : curr
  );
  
  // Calculate an overall score (lower is better)
  const normalizedScores = results.map(result => {
    // Normalize metrics between 0 and 1 (0 being best)
    const maxWaitingTime = Math.max(...results.map(r => r.averageWaitingTime));
    const maxTurnaround = Math.max(...results.map(r => r.averageTurnaroundTime));
    const maxThroughput = Math.max(...results.map(r => r.throughput));
    const maxCpuUtil = Math.max(...results.map(r => r.cpuUtilization));
    
    const waitingTimeScore = result.averageWaitingTime / maxWaitingTime;
    const turnaroundScore = result.averageTurnaroundTime / maxTurnaround;
    const throughputScore = 1 - (result.throughput / maxThroughput); // Invert so lower is better
    const cpuUtilScore = 1 - (result.cpuUtilization / maxCpuUtil); // Invert so lower is better
    
    // Weighted score (can adjust weights based on importance)
    const overallScore = (
      waitingTimeScore * 0.3 + 
      turnaroundScore * 0.3 + 
      throughputScore * 0.2 + 
      cpuUtilScore * 0.2
    );
    
    return {
      name: result.name,
      score: overallScore
    };
  });
  
  const bestOverall = normalizedScores.reduce((prev, curr) => 
    prev.score < curr.score ? prev : curr
  );

  // Determine if the best is a traditional or metaheuristic algorithm
  const isMetaheuristic = ['Genetic Algorithm (GA)', 'Particle Swarm Optimization (PSO)', 
                          'Ant Colony Optimization (ACO)', 'Simulated Annealing (SA)'].includes(bestOverall.name);
  
  return (
    <Card className="w-full mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Best Algorithm Analysis</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-md border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2 mb-2">
            <p className="font-semibold text-green-800 dark:text-green-300">
              For this set of processes, <span className="font-bold">{bestOverall.name}</span> is the most efficient algorithm overall.
            </p>
            <Badge variant={isMetaheuristic ? "secondary" : "outline"}>
              {isMetaheuristic ? "Metaheuristic" : "Traditional"}
            </Badge>
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="font-semibold">Performance Breakdown:</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li><span className="font-medium">{bestWaitingTime.name}</span> has the lowest average waiting time ({bestWaitingTime.averageWaitingTime.toFixed(2)}s).</li>
            <li><span className="font-medium">{bestTurnaround.name}</span> has the lowest average turnaround time ({bestTurnaround.averageTurnaroundTime.toFixed(2)}s).</li>
            <li><span className="font-medium">{bestThroughput.name}</span> has the highest throughput ({bestThroughput.throughput.toFixed(3)} processes/s).</li>
            <li><span className="font-medium">{bestCpuUtil.name}</span> has the best CPU utilization ({bestCpuUtil.cpuUtilization.toFixed(1)}%).</li>
          </ul>
        </div>
        
        <div>
          <h3 className="font-semibold mb-2">Analysis:</h3>
          <p className="text-muted-foreground">
            Traditional algorithms like FCFS, SJF, and Priority are deterministic but may not find optimal solutions for complex workloads. 
            Metaheuristic algorithms (GA, PSO, ACO, SA) can often find better solutions for complex scenarios by exploring the solution 
            space more thoroughly, at the cost of higher computational complexity and non-deterministic results.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
