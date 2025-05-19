
import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlgorithmResult, findBestAlgorithm } from "@/lib/cpuScheduling";
import { ScrollAreaHorizontal } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AlgorithmComparisonTableProps {
  results: AlgorithmResult[];
}

export function AlgorithmComparisonTable({ results }: AlgorithmComparisonTableProps) {
  const [activeTab, setActiveTab] = useState<string>("all");

  if (results.length === 0) {
    return (
      <Card className="w-full mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Algorithm Comparison</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-muted-foreground">No algorithms selected for comparison.</p>
        </CardContent>
      </Card>
    );
  }
  
  const bestWaitingTime = findBestAlgorithm(results, "averageWaitingTime");
  const bestTurnaround = findBestAlgorithm(results, "averageTurnaroundTime");
  const bestThroughput = findBestAlgorithm(results, "throughput");
  const bestCpuUtil = findBestAlgorithm(results, "cpuUtilization");
  
  // Filter results based on active tab
  const traditionalAlgorithms = ['First-Come-First-Served (FCFS)', 'Shortest Job First (SJF)', 'Round Robin (RR)', 'Priority Scheduling'];
  const metaheuristicAlgorithms = ['Genetic Algorithm (GA)', 'Particle Swarm Optimization (PSO)', 'Ant Colony Optimization (ACO)', 'Simulated Annealing (SA)'];
  
  const filteredResults = activeTab === "all" 
    ? results 
    : activeTab === "traditional" 
      ? results.filter(r => traditionalAlgorithms.includes(r.name))
      : results.filter(r => metaheuristicAlgorithms.includes(r.name));

  // Only show tabs if both traditional and metaheuristic algorithms are present
  const hasTraditional = results.some(r => traditionalAlgorithms.includes(r.name));
  const hasMetaheuristic = results.some(r => metaheuristicAlgorithms.includes(r.name));
  const showTabs = hasTraditional && hasMetaheuristic;
  
  return (
    <Card className="w-full mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Algorithm Comparison</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {showTabs && (
          <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All Algorithms</TabsTrigger>
              <TabsTrigger value="traditional">Traditional</TabsTrigger>
              <TabsTrigger value="metaheuristic">Metaheuristic</TabsTrigger>
            </TabsList>
          </Tabs>
        )}
        
        <ScrollAreaHorizontal className="w-full">
          <div className="rounded-md border min-w-[600px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Algorithm</TableHead>
                  <TableHead>Avg Waiting Time</TableHead>
                  <TableHead>Avg Turnaround Time</TableHead>
                  <TableHead>Throughput</TableHead>
                  <TableHead>CPU Utilization</TableHead>
                  <TableHead>Avg Response Time</TableHead>
                  <TableHead>Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResults.map((result) => (
                  <TableRow key={result.name} className={
                    metaheuristicAlgorithms.includes(result.name) ? "bg-slate-50 dark:bg-slate-900/20" : ""
                  }>
                    <TableCell className="font-medium">{result.name}</TableCell>
                    <TableCell className={
                      bestWaitingTime?.name === result.name ? "font-bold bg-green-100 dark:bg-green-900/20" : ""
                    }>
                      {result.averageWaitingTime.toFixed(2)}s
                    </TableCell>
                    <TableCell className={
                      bestTurnaround?.name === result.name ? "font-bold bg-green-100 dark:bg-green-900/20" : ""
                    }>
                      {result.averageTurnaroundTime.toFixed(2)}s
                    </TableCell>
                    <TableCell className={
                      bestThroughput?.name === result.name ? "font-bold bg-green-100 dark:bg-green-900/20" : ""
                    }>
                      {result.throughput.toFixed(3)} proc/s
                    </TableCell>
                    <TableCell className={
                      bestCpuUtil?.name === result.name ? "font-bold bg-green-100 dark:bg-green-900/20" : ""
                    }>
                      {result.cpuUtilization.toFixed(1)}%
                    </TableCell>
                    <TableCell>
                      {result.averageResponseTime ? 
                        `${result.averageResponseTime.toFixed(2)}s` : 
                        "N/A"}
                    </TableCell>
                    <TableCell>
                      {traditionalAlgorithms.includes(result.name) ? "Traditional" : "Metaheuristic"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </ScrollAreaHorizontal>
      </CardContent>
    </Card>
  );
}
