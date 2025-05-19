
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { AddProcessModal, Process } from "@/components/AddProcessModal";
import { ProcessList } from "@/components/ProcessList";
import { AlgorithmSelection, Algorithm } from "@/components/AlgorithmSelection";
import { FilePlus, Play } from "lucide-react";

const algorithms = [
  {
    id: "fcfs",
    name: "First-Come-First-Served (FCFS)",
    description: "A non-preemptive algorithm that executes processes in the order they arrive in the ready queue.",
    category: "basic" as const
  },
  {
    id: "sjf",
    name: "Shortest Job First (SJF)",
    description: "A non-preemptive algorithm that selects the waiting process with the smallest execution time to execute next.",
    category: "basic" as const
  },
  {
    id: "rr",
    name: "Round Robin (RR)",
    description: "A preemptive algorithm that assigns a fixed time unit per process, cycling through all processes in the ready queue.",
    category: "basic" as const
  },
  {
    id: "priority",
    name: "Priority Scheduling",
    description: "A non-preemptive algorithm that executes processes based on priority. Lower numbers indicate higher priority.",
    category: "basic" as const
  },
  {
    id: "ga",
    name: "Genetic Algorithm (GA)",
    description: "Inspired by natural selection, GA evolves different process sequences to find optimal scheduling solutions by minimizing waiting time.",
    category: "advanced" as const
  },
  {
    id: "pso",
    name: "Particle Swarm Optimization (PSO)",
    description: "Models process scheduling as particles moving in search space, optimizing positions based on individual and group experience.",
    category: "advanced" as const
  },
  {
    id: "aco",
    name: "Ant Colony Optimization (ACO)",
    description: "Mimics ant foraging behavior using pheromone trails to find optimal process scheduling sequences.",
    category: "advanced" as const
  },
  {
    id: "sa",
    name: "Simulated Annealing (SA)",
    description: "Inspired by metal annealing, this algorithm explores many solutions initially, then gradually focuses on promising regions.",
    category: "advanced" as const
  }
];

const Index = () => {
  const navigate = useNavigate();
  
  // State for manually added processes
  const [processes, setProcesses] = useState<Process[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProcess, setEditingProcess] = useState<Process | null>(null);
  
  // State for selected algorithms
  const [selectedAlgorithms, setSelectedAlgorithms] = useState<string[]>([]);

  // Handle process addition/editing
  const handleAddProcess = (process: Process) => {
    if (editingProcess) {
      // Update existing process
      setProcesses(processes.map(p => p.id === process.id ? process : p));
      setEditingProcess(null);
    } else {
      // Add new process
      setProcesses([...processes, process]);
    }
  };

  // Handle process deletion
  const handleDeleteProcess = (id: string) => {
    setProcesses(processes.filter(p => p.id !== id));
  };

  // Handle clearing all processes
  const handleClearAllProcesses = () => {
    setProcesses([]);
  };

  // Handle editing a process
  const handleEditProcess = (process: Process) => {
    setEditingProcess(process);
    setModalOpen(true);
  };

  // Handle starting the simulation
  const handleStartSimulation = () => {
    // Validate inputs
    if (processes.length === 0) {
      toast.error("Please add processes manually before starting the simulation.");
      return;
    }

    if (selectedAlgorithms.length === 0) {
      toast.error("Please select at least one scheduling algorithm.");
      return;
    }

    // Navigate to results page with the simulation data
    navigate("/results", {
      state: {
        simulationData: {
          processes,
          selectedAlgorithms
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <header className="container mx-auto py-12 px-4">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          {/* Project ID Header */}
          <p className="text-sm font-medium text-muted-foreground mb-2">Project Id - SE(OS) - VI - T054</p>
          
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent cpu-gradient">
            CPU Scheduling Simulator
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Test and compare different CPU scheduling algorithms using manually added processes.
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 pb-16">
        <div className="max-w-5xl mx-auto grid gap-8">
          {/* Manual Process Addition Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">Add Processes Manually</h2>
              <Button onClick={() => setModalOpen(true)}>
                <FilePlus className="mr-2 h-4 w-4" />
                Add Process
              </Button>
            </div>
            
            <ProcessList 
              processes={processes} 
              onEdit={handleEditProcess} 
              onDelete={handleDeleteProcess}
              onClearAll={handleClearAllProcesses}
            />
            
            <AddProcessModal
              open={modalOpen}
              onOpenChange={setModalOpen}
              onAddProcess={handleAddProcess}
              editingProcess={editingProcess}
            />
          </section>

          <Separator className="my-2" />

          {/* Algorithm Selection Section */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Select Algorithms</h2>
            <AlgorithmSelection 
              algorithms={algorithms}
              selectedAlgorithms={selectedAlgorithms}
              onSelectionChange={setSelectedAlgorithms}
            />
          </section>

          {/* Start Simulation Button */}
          <section className="mt-4">
            <Card className="border-dashed bg-accent/40 hover:bg-accent/60 transition-colors">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <div className="mb-4 md:mb-0">
                    <h3 className="text-xl font-semibold">Ready to Start</h3>
                    <p className="text-muted-foreground">
                      Click the button to run the simulation with your selected settings
                    </p>
                  </div>
                  <Button 
                    size="lg" 
                    onClick={handleStartSimulation}
                    className="bg-cpu-blue hover:bg-cpu-darkblue text-white"
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Start Simulation
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>

      <footer className="container mx-auto px-4 py-8 border-t">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground mb-4 md:mb-0">
            Learn more about CPU scheduling algorithms and their implementation
          </p>
          <div className="flex space-x-4">
            <a href="#" className="text-sm hover:underline text-cpu-blue">
              About
            </a>
            <a href="#" className="text-sm hover:underline text-cpu-blue">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
