
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Process } from "@/components/AddProcessModal";

interface SimulationData {
  processes: Process[];
  selectedAlgorithms: string[];
  file: File | null;
}

const Results = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const simulationData = location.state?.simulationData as SimulationData | undefined;

  // If no data was passed, redirect back to the homepage
  React.useEffect(() => {
    if (!simulationData) {
      navigate("/");
    }
  }, [simulationData, navigate]);

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
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold">Simulation Results</h1>
          <Button onClick={() => navigate("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>
        <p className="text-muted-foreground">
          Visualization of CPU scheduling algorithms and performance comparison
        </p>
      </div>

      <div className="grid gap-8">
        {/* For now, just show what data we received */}
        <div className="space-y-6">
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
                    <strong>{process.name}</strong> - Burst Time: {process.burstTime}s
                    {process.priority !== undefined && ` - Priority: ${process.priority}`}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        <div className="border-t pt-8">
          <p className="text-center text-muted-foreground">
            Visualization and detailed results would be implemented here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Results;
