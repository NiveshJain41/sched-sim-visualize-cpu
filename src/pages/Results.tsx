
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Process } from "@/components/AddProcessModal";
import { GanttChart } from "@/components/GanttChart";
import { AlgorithmComparisonTable } from "@/components/AlgorithmComparisonTable";
import { BestAlgorithmAnalysis } from "@/components/BestAlgorithmAnalysis";
import { runAlgorithms, AlgorithmResult } from "@/lib/cpuScheduling";
import { toast } from "sonner";

interface SimulationData {
  processes: Process[];
  selectedAlgorithms: string[];
  file: File | null;
}

const Results = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const simulationData = location.state?.simulationData as SimulationData | undefined;
  const [results, setResults] = useState<AlgorithmResult[]>([]);
  const [loading, setLoading] = useState(true);

  // If no data was passed, redirect back to the homepage
  useEffect(() => {
    if (!simulationData) {
      navigate("/");
      return;
    }

    // Run algorithms with the provided processes
    if (simulationData.processes.length > 0) {
      try {
        const algorithmResults = runAlgorithms(
          simulationData.processes,
          simulationData.selectedAlgorithms
        );
        setResults(algorithmResults);
      } catch (error) {
        console.error("Error calculating algorithm results:", error);
        toast.error("An error occurred while calculating the results");
      }
    }
    
    setLoading(false);
  }, [simulationData, navigate]);

  const handleDownloadResults = () => {
    if (results.length === 0) return;
    
    try {
      // Create CSV content
      let csvContent = "Algorithm,Avg Waiting Time,Avg Turnaround Time,Throughput,CPU Utilization,Avg Response Time\n";
      
      results.forEach(result => {
        csvContent += `"${result.name}",${result.averageWaitingTime.toFixed(2)},${result.averageTurnaroundTime.toFixed(2)},${result.throughput.toFixed(3)},${result.cpuUtilization.toFixed(1)},${result.averageResponseTime?.toFixed(2) || "N/A"}\n`;
      });
      
      // Create a blob and download link
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", "cpu_scheduling_results.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Results downloaded successfully");
    } catch (error) {
      console.error("Error downloading results:", error);
      toast.error("Failed to download results");
    }
  };

  if (!simulationData) {
    return (
      <div className="container mx-auto py-12 px-4 max-w-6xl">
        <div className="flex justify-center items-center min-h-[50vh] flex-col space-y-4">
          <p>No simulation data found. Please return to the homepage.</p>
          <Button onClick={() => navigate("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4 max-w-6xl">
      <div className="mb-8 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h1 className="text-4xl font-bold">Simulation Results</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleDownloadResults}>
              <Download className="mr-2 h-4 w-4" />
              Download Results
            </Button>
            <Button onClick={() => navigate("/")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </div>
        </div>
        <p className="text-muted-foreground">
          Visualization of CPU scheduling algorithms and performance comparison
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-pulse-slow text-center">
            <p>Calculating results...</p>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {results.length > 0 ? (
            <>
              {/* Gantt Charts Section */}
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold">Gantt Charts</h2>
                {results.map((result) => (
                  <GanttChart 
                    key={result.name} 
                    algorithmName={result.name} 
                    scheduledProcesses={result.scheduledProcesses} 
                  />
                ))}
              </div>

              {/* Comparison Table */}
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold">Performance Metrics</h2>
                <AlgorithmComparisonTable results={results} />
              </div>

              {/* Best Algorithm Analysis */}
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold">Best Algorithm Analysis</h2>
                <BestAlgorithmAnalysis results={results} />
              </div>
            </>
          ) : (
            <div className="py-12 text-center">
              <p>No results to display. Please check your process data and selected algorithms.</p>
            </div>
          )}

          {/* Input Data Summary */}
          <div className="space-y-6 mt-8 pt-8 border-t">
            <h2 className="text-2xl font-semibold">Simulation Input</h2>
            
            <div className="space-y-4">
              <h3 className="text-xl">Selected Algorithms</h3>
              <ul className="list-disc pl-5 space-y-1">
                {simulationData.selectedAlgorithms.map((algorithmId: string) => (
                  <li key={algorithmId}>{algorithmId}</li>
                ))}
              </ul>
            </div>

            {simulationData.file && (
              <div className="space-y-2">
                <h3 className="text-xl">Uploaded File</h3>
                <p>{simulationData.file.name}</p>
              </div>
            )}

            {simulationData.processes.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl">Added Processes</h3>
                <ul className="space-y-2">
                  {simulationData.processes.map((process: Process) => (
                    <li key={process.id} className="border p-4 rounded-md">
                      <strong>{process.name}</strong> - Arrival Time: {process.arrivalTime}s - Burst Time: {process.burstTime}s
                      {process.priority !== undefined && ` - Priority: ${process.priority}`}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Results;
