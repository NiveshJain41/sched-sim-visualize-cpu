import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { AddProcessModal, Process } from "@/components/AddProcessModal";
import { ProcessList } from "@/components/ProcessList";
import { AlgorithmSelection, Algorithm } from "@/components/AlgorithmSelection";
import { FilePlus, Play, Cpu, Activity } from "lucide-react";

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

  // Generate unique process ID
  const generateProcessId = () => {
    return `P${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  // Handle process addition/editing
  const handleAddProcess = (processData: Omit<Process, 'id'>) => {
    if (editingProcess) {
      // Update existing process - keep the same ID
      const updatedProcess = { ...processData, id: editingProcess.id };
      setProcesses(processes.map(p => p.id === editingProcess.id ? updatedProcess : p));
      setEditingProcess(null);
    } else {
      // Add new process with unique ID
      const newProcess = { ...processData, id: generateProcessId() };
      setProcesses([...processes, newProcess]);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>

      <header className="relative container mx-auto py-16 px-4">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          {/* Project ID Header */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-full">
            <Cpu className="h-4 w-4 text-blue-400" />
            <p className="text-sm font-medium text-slate-300">Project Id - SE(OS) - VI - T054</p>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            CPU Scheduling Simulator
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Test and compare different CPU scheduling algorithms using manually added processes with advanced visualization and performance metrics.
          </p>
          
          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 max-w-3xl mx-auto">
            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-blue-400 mb-1">
                <Activity className="h-4 w-4" />
                <span className="text-sm font-medium">Processes</span>
              </div>
              <div className="text-2xl font-bold text-white">{processes.length}</div>
            </div>
            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-purple-400 mb-1">
                <Cpu className="h-4 w-4" />
                <span className="text-sm font-medium">Algorithms</span>
              </div>
              <div className="text-2xl font-bold text-white">{selectedAlgorithms.length}</div>
            </div>
            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-cyan-400 mb-1">
                <Play className="h-4 w-4" />
                <span className="text-sm font-medium">Ready</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {processes.length > 0 && selectedAlgorithms.length > 0 ? "Yes" : "No"}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="relative container mx-auto px-4 pb-16">
        <div className="max-w-5xl mx-auto grid gap-8">
          {/* Manual Process Addition Section */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-white mb-2">Process Management</h2>
                <p className="text-slate-400">Add and configure processes for scheduling simulation</p>
              </div>
              <Button 
                onClick={() => setModalOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg"
              >
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

          <Separator className="bg-slate-700/50" />

          {/* Algorithm Selection Section */}
          <section>
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-white mb-2">Algorithm Selection</h2>
              <p className="text-slate-400">Choose scheduling algorithms to compare and analyze</p>
            </div>
            <AlgorithmSelection 
              algorithms={algorithms}
              selectedAlgorithms={selectedAlgorithms}
              onSelectionChange={setSelectedAlgorithms}
            />
          </section>

          {/* Start Simulation Button */}
          <section className="mt-4">
            <Card className="border-slate-700/50 bg-slate-800/30 backdrop-blur-sm hover:bg-slate-800/50 transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="text-center md:text-left">
                    <h3 className="text-2xl font-semibold text-white mb-2">Ready to Simulate</h3>
                    <p className="text-slate-400 text-lg">
                      Execute the simulation with your configured processes and selected algorithms
                    </p>
                    <div className="flex gap-4 mt-3 text-sm text-slate-500">
                      <span>• {processes.length} processes configured</span>
                      <span>• {selectedAlgorithms.length} algorithms selected</span>
                    </div>
                  </div>
                  <Button 
                    size="lg" 
                    onClick={handleStartSimulation}
                    className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white border-0 shadow-lg text-lg px-8 py-6"
                    disabled={processes.length === 0 || selectedAlgorithms.length === 0}
                  >
                    <Play className="mr-2 h-5 w-5" />
                    Start Simulation
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>

      <footer className="relative container mx-auto px-4 py-8 border-t border-slate-700/50">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-slate-400 mb-4 md:mb-0">
            Advanced CPU scheduling simulation with comprehensive algorithm analysis
          </p>
          <div className="flex space-x-4">
            <a href="#" className="text-sm hover:underline text-blue-400 hover:text-blue-300 transition-colors">
              Documentation
            </a>
            <a href="#" className="text-sm hover:underline text-purple-400 hover:text-purple-300 transition-colors">
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
