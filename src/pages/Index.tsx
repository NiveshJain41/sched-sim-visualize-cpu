
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { AddProcessModal, Process } from "@/components/AddProcessModal";
import { ProcessList } from "@/components/ProcessList";
import { AlgorithmSelection, Algorithm } from "@/components/AlgorithmSelection";
import { FilePlus, Play, Cpu, Activity, Zap, Binary, Layers } from "lucide-react";

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
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Primary gradient orbs */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute top-3/4 -right-32 w-80 h-80 bg-gradient-to-bl from-purple-500/20 to-pink-400/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full blur-2xl animate-pulse-slow"></div>
        
        {/* Floating particles */}
        <div className="absolute top-1/3 left-1/4 w-2 h-2 bg-blue-400/60 rounded-full animate-bounce"></div>
        <div className="absolute top-2/3 right-1/4 w-1 h-1 bg-purple-400/60 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-cyan-400/60 rounded-full animate-bounce" style={{animationDelay: '2s'}}></div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23334155" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] bg-repeat"></div>
      </div>

      <header className="relative container mx-auto py-20 px-4">
        <div className="max-w-6xl mx-auto text-center space-y-8">
          {/* Enhanced Project ID Header with glassmorphism */}
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
              <Binary className="h-4 w-4 text-white" />
            </div>
            <p className="text-sm font-semibold text-slate-200 tracking-wide">SE(OS) - VI - T054</p>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          </div>
          
          {/* Enhanced main title with better typography */}
          <div className="space-y-4">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tight">
              <span className="bg-gradient-to-r from-blue-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
                CPU
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-300 via-pink-300 to-orange-300 bg-clip-text text-transparent">
                Scheduler
              </span>
            </h1>
            <div className="flex items-center justify-center gap-4">
              <div className="h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent w-32"></div>
              <Zap className="h-6 w-6 text-yellow-400 animate-pulse" />
              <div className="h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent w-32"></div>
            </div>
          </div>
          
          <p className="text-xl md:text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed font-medium">
            Experience next-generation CPU scheduling simulation with advanced algorithms, 
            <span className="text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text font-semibold"> real-time visualization</span>, 
            and comprehensive performance analytics.
          </p>
          
          {/* Enhanced stats cards with modern design */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
            {[
              { icon: Activity, label: "Active Processes", value: processes.length, color: "from-blue-500 to-cyan-400" },
              { icon: Layers, label: "Algorithms Selected", value: selectedAlgorithms.length, color: "from-purple-500 to-pink-400" },
              { icon: Cpu, label: "System Status", value: processes.length > 0 && selectedAlgorithms.length > 0 ? "Ready" : "Pending", color: "from-emerald-500 to-teal-400" }
            ].map((stat, index) => (
              <div key={index} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r opacity-60 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" 
                     style={{background: `linear-gradient(to right, var(--tw-gradient-stops))`}}></div>
                <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 shadow-xl">
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${stat.color} mb-4`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">{stat.label}</p>
                    <p className="text-3xl font-bold text-white">{stat.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </header>

      <main className="relative container mx-auto px-4 pb-20">
        <div className="max-w-6xl mx-auto grid gap-12">
          {/* Enhanced Process Management Section */}
          <section className="space-y-8">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-blue-300">Process Management</span>
              </div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                Configure Your Processes
              </h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                Design and customize process configurations for comprehensive scheduling analysis
              </p>
            </div>
            
            <div className="flex justify-center mb-8">
              <Button 
                onClick={() => setModalOpen(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 shadow-2xl shadow-blue-500/25 px-8 py-6 text-lg rounded-2xl transition-all duration-300 hover:scale-105"
              >
                <FilePlus className="mr-3 h-5 w-5" />
                Create New Process
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

          <Separator className="bg-gradient-to-r from-transparent via-slate-700 to-transparent h-px" />

          {/* Enhanced Algorithm Selection Section */}
          <section className="space-y-8">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-purple-300">Algorithm Selection</span>
              </div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                Choose Your Algorithms
              </h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                Select from traditional and advanced metaheuristic scheduling algorithms
              </p>
            </div>
            
            <AlgorithmSelection 
              algorithms={algorithms}
              selectedAlgorithms={selectedAlgorithms}
              onSelectionChange={setSelectedAlgorithms}
            />
          </section>

          {/* Enhanced Start Simulation Section */}
          <section className="mt-12">
            <Card className="border-0 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl shadow-2xl overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5"></div>
              <CardContent className="p-12 relative">
                <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
                  <div className="text-center lg:text-left space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-4xl font-bold bg-gradient-to-r from-emerald-300 to-blue-300 bg-clip-text text-transparent">
                        Launch Simulation
                      </h3>
                      <p className="text-xl text-slate-300 leading-relaxed max-w-lg">
                        Execute comprehensive analysis with your configured processes and selected algorithms
                      </p>
                    </div>
                    
                    <div className="flex flex-wrap gap-6 text-sm">
                      <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                        <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                        <span className="text-slate-300">{processes.length} processes configured</span>
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                        <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                        <span className="text-slate-300">{selectedAlgorithms.length} algorithms selected</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center gap-4">
                    <Button 
                      size="lg" 
                      onClick={handleStartSimulation}
                      className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white border-0 shadow-2xl shadow-emerald-500/25 text-xl px-12 py-8 rounded-2xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={processes.length === 0 || selectedAlgorithms.length === 0}
                    >
                      <Play className="mr-3 h-6 w-6" />
                      Begin Analysis
                    </Button>
                    {(processes.length === 0 || selectedAlgorithms.length === 0) && (
                      <p className="text-sm text-slate-400 text-center max-w-xs">
                        Add processes and select algorithms to enable simulation
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>

      <footer className="relative container mx-auto px-4 py-12 border-t border-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <p className="text-slate-400 mb-2">
                Advanced CPU scheduling simulation platform
              </p>
              <p className="text-sm text-slate-500">
                Built with modern algorithms and real-time analytics
              </p>
            </div>
            <div className="flex items-center space-x-6">
              <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium hover:underline">
                Documentation
              </a>
              <a href="#" className="text-purple-400 hover:text-purple-300 transition-colors text-sm font-medium hover:underline">
                Source Code
              </a>
              <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors text-sm font-medium hover:underline">
                Research Paper
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
