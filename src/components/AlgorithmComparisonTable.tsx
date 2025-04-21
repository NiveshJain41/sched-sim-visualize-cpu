
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlgorithmResult, findBestAlgorithm } from "@/lib/cpuScheduling";

interface AlgorithmComparisonTableProps {
  results: AlgorithmResult[];
}

export function AlgorithmComparisonTable({ results }: AlgorithmComparisonTableProps) {
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
  
  return (
    <Card className="w-full mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Algorithm Comparison</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Algorithm</TableHead>
                <TableHead>Avg Waiting Time</TableHead>
                <TableHead>Avg Turnaround Time</TableHead>
                <TableHead>Throughput</TableHead>
                <TableHead>CPU Utilization</TableHead>
                <TableHead>Avg Response Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((result) => (
                <TableRow key={result.name}>
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
