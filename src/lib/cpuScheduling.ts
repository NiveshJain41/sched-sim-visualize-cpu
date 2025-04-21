import { Process } from "@/components/AddProcessModal";

export interface ScheduledProcess extends Process {
  startTime: number;
  endTime: number;
  waitingTime: number;
  turnaroundTime: number;
  responseTime: number; // For Round Robin
}

export interface AlgorithmResult {
  name: string;
  scheduledProcesses: ScheduledProcess[];
  averageWaitingTime: number;
  averageTurnaroundTime: number;
  throughput: number;
  cpuUtilization: number;
  averageResponseTime?: number; // For Round Robin
}

// First-Come-First-Served (FCFS) algorithm
export const fcfs = (processes: Process[]): AlgorithmResult => {
  // Sort processes by arrival time
  const sortedProcesses = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
  const scheduledProcesses: ScheduledProcess[] = [];
  
  let currentTime = 0;
  let totalWaitingTime = 0;
  let totalTurnaroundTime = 0;
  let totalBurstTime = 0;
  
  sortedProcesses.forEach((process) => {
    // If CPU is idle and next process hasn't arrived yet
    if (currentTime < process.arrivalTime) {
      currentTime = process.arrivalTime;
    }
    
    const waitingTime = Math.max(0, currentTime - process.arrivalTime);
    const startTime = currentTime;
    const endTime = startTime + process.burstTime;
    const turnaroundTime = endTime - process.arrivalTime;
    
    scheduledProcesses.push({
      ...process,
      startTime,
      endTime,
      waitingTime,
      turnaroundTime,
      responseTime: waitingTime // For FCFS, response time equals waiting time
    });
    
    totalWaitingTime += waitingTime;
    totalTurnaroundTime += turnaroundTime;
    totalBurstTime += process.burstTime;
    currentTime = endTime;
  });
  
  const averageWaitingTime = totalWaitingTime / processes.length;
  const averageTurnaroundTime = totalTurnaroundTime / processes.length;
  const makespan = scheduledProcesses.length > 0 
    ? Math.max(...scheduledProcesses.map(p => p.endTime)) 
    : 0;
  const throughput = processes.length / (makespan || 1); // Prevent division by zero
  const cpuUtilization = (totalBurstTime / (makespan || 1)) * 100;
  
  return {
    name: "First-Come-First-Served (FCFS)",
    scheduledProcesses,
    averageWaitingTime,
    averageTurnaroundTime,
    throughput,
    cpuUtilization,
  };
};

// Shortest Job First (SJF) algorithm - non-preemptive
export const sjf = (processes: Process[]): AlgorithmResult => {
  const processesCopy = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
  const scheduledProcesses: ScheduledProcess[] = [];
  
  let currentTime = 0;
  let totalWaitingTime = 0;
  let totalTurnaroundTime = 0;
  let totalBurstTime = 0;
  let remainingProcesses = [...processesCopy];
  
  while (remainingProcesses.length > 0) {
    // Find arrived processes
    const arrivedProcesses = remainingProcesses.filter(p => p.arrivalTime <= currentTime);
    
    if (arrivedProcesses.length === 0) {
      // No processes have arrived yet, advance time to next arrival
      currentTime = Math.min(...remainingProcesses.map(p => p.arrivalTime));
      continue;
    }
    
    // Find the shortest job among arrived processes
    const nextProcess = arrivedProcesses.reduce((prev, curr) => 
      prev.burstTime < curr.burstTime ? prev : curr
    );
    
    // Remove the process from remaining processes
    remainingProcesses = remainingProcesses.filter(p => p.id !== nextProcess.id);
    
    const waitingTime = Math.max(0, currentTime - nextProcess.arrivalTime);
    const startTime = currentTime;
    const endTime = startTime + nextProcess.burstTime;
    const turnaroundTime = endTime - nextProcess.arrivalTime;
    
    scheduledProcesses.push({
      ...nextProcess,
      startTime,
      endTime,
      waitingTime,
      turnaroundTime,
      responseTime: waitingTime // For SJF, response time equals waiting time
    });
    
    totalWaitingTime += waitingTime;
    totalTurnaroundTime += turnaroundTime;
    totalBurstTime += nextProcess.burstTime;
    currentTime = endTime;
  }
  
  const averageWaitingTime = totalWaitingTime / processes.length;
  const averageTurnaroundTime = totalTurnaroundTime / processes.length;
  const makespan = scheduledProcesses.length > 0 
    ? Math.max(...scheduledProcesses.map(p => p.endTime)) 
    : 0;
  const throughput = processes.length / (makespan || 1);
  const cpuUtilization = (totalBurstTime / (makespan || 1)) * 100;
  
  return {
    name: "Shortest Job First (SJF)",
    scheduledProcesses,
    averageWaitingTime,
    averageTurnaroundTime,
    throughput,
    cpuUtilization,
  };
};

// Round Robin algorithm
export const roundRobin = (processes: Process[], timeQuantum: number = 2): AlgorithmResult => {
  const processesCopy = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
  const scheduledProcesses: ScheduledProcess[] = [];
  
  // Keep track of remaining burst time for each process
  const remainingBurstTimes = new Map<string, number>();
  const firstResponseTimes = new Map<string, number>(); // Track first response for each process
  const processStarted = new Map<string, boolean>();
  const processCompleted = new Map<string, { endTime: number, turnaroundTime: number, waitingTime: number }>();
  
  processesCopy.forEach(p => {
    remainingBurstTimes.set(p.id, p.burstTime);
    processStarted.set(p.id, false);
  });
  
  let currentTime = 0;
  let executionSequence: { id: string, startTime: number, endTime: number }[] = [];
  let queue: Process[] = [];
  const processMap = new Map(processesCopy.map(p => [p.id, p]));
  
  // Initialize with processes that arrive at time 0
  processesCopy.filter(p => p.arrivalTime === 0).forEach(p => queue.push(p));
  
  while (queue.length > 0 || remainingBurstTimes.size > 0) {
    if (queue.length === 0) {
      // No processes in queue, advance time to next arrival
      const nextArrival = processesCopy
        .filter(p => p.arrivalTime > currentTime && !processCompleted.has(p.id))
        .reduce((min, p) => Math.min(min, p.arrivalTime), Infinity);
      
      if (nextArrival === Infinity) break; // No more processes to arrive
      
      currentTime = nextArrival;
      processesCopy.filter(p => p.arrivalTime === currentTime).forEach(p => queue.push(p));
      continue;
    }
    
    const currentProcess = queue.shift()!;
    const remainingTime = remainingBurstTimes.get(currentProcess.id)!;
    
    if (!processStarted.get(currentProcess.id)) {
      firstResponseTimes.set(currentProcess.id, currentTime - currentProcess.arrivalTime);
      processStarted.set(currentProcess.id, true);
    }
    
    const executionTime = Math.min(timeQuantum, remainingTime);
    const endTime = currentTime + executionTime;
    
    // Add to execution sequence
    executionSequence.push({
      id: currentProcess.id,
      startTime: currentTime,
      endTime
    });
    
    // Update remaining burst time
    remainingBurstTimes.set(currentProcess.id, remainingTime - executionTime);
    
    // Check for new arrivals during this time slice
    processesCopy.forEach(p => {
      if (p.arrivalTime > currentTime && p.arrivalTime <= endTime && !queue.includes(p) && !processCompleted.has(p.id)) {
        queue.push(p);
      }
    });
    
    currentTime = endTime;
    
    // If process is complete
    if (remainingBurstTimes.get(currentProcess.id) === 0) {
      remainingBurstTimes.delete(currentProcess.id);
      
      const turnaroundTime = endTime - currentProcess.arrivalTime;
      const waitingTime = turnaroundTime - currentProcess.burstTime;
      
      processCompleted.set(currentProcess.id, {
        endTime,
        turnaroundTime,
        waitingTime
      });
    } else {
      // If process still has remaining time, add it back to queue
      queue.push(currentProcess);
    }
  }
  
  // Convert execution sequence to scheduled processes
  processesCopy.forEach(process => {
    const processExecutions = executionSequence.filter(e => e.id === process.id);
    const startTime = Math.min(...processExecutions.map(e => e.startTime));
    const endTime = Math.max(...processExecutions.map(e => e.endTime));
    const completed = processCompleted.get(process.id)!;
    const responseTime = firstResponseTimes.get(process.id) || 0;
    
    scheduledProcesses.push({
      ...process,
      startTime,
      endTime,
      waitingTime: completed.waitingTime,
      turnaroundTime: completed.turnaroundTime,
      responseTime
    });
  });
  
  // Calculate metrics
  const totalWaitingTime = scheduledProcesses.reduce((sum, p) => sum + p.waitingTime, 0);
  const totalTurnaroundTime = scheduledProcesses.reduce((sum, p) => sum + p.turnaroundTime, 0);
  const totalResponseTime = scheduledProcesses.reduce((sum, p) => sum + p.responseTime, 0);
  const totalBurstTime = processes.reduce((sum, p) => sum + p.burstTime, 0);
  
  const averageWaitingTime = totalWaitingTime / processes.length;
  const averageTurnaroundTime = totalTurnaroundTime / processes.length;
  const averageResponseTime = totalResponseTime / processes.length;
  
  // Calculate CPU utilization and throughput
  const makespan = scheduledProcesses.length > 0 
    ? Math.max(...scheduledProcesses.map(p => p.endTime)) 
    : 0;
  const throughput = processes.length / (makespan || 1);
  const cpuUtilization = (totalBurstTime / (makespan || 1)) * 100;
  
  return {
    name: "Round Robin (RR)",
    scheduledProcesses,
    averageWaitingTime,
    averageTurnaroundTime,
    throughput,
    cpuUtilization,
    averageResponseTime
  };
};

// Priority scheduling algorithm - non-preemptive
export const priorityScheduling = (processes: Process[]): AlgorithmResult => {
  // For processes without priority, assign a default high value (lower priority)
  const processesCopy = [...processes].map(p => ({
    ...p,
    priority: p.priority !== undefined ? p.priority : Number.MAX_SAFE_INTEGER
  }));
  
  const scheduledProcesses: ScheduledProcess[] = [];
  
  let currentTime = 0;
  let totalWaitingTime = 0;
  let totalTurnaroundTime = 0;
  let totalBurstTime = 0;
  let remainingProcesses = [...processesCopy];
  
  while (remainingProcesses.length > 0) {
    // Find arrived processes
    const arrivedProcesses = remainingProcesses.filter(p => p.arrivalTime <= currentTime);
    
    if (arrivedProcesses.length === 0) {
      // No processes have arrived yet, advance time to next arrival
      currentTime = Math.min(...remainingProcesses.map(p => p.arrivalTime));
      continue;
    }
    
    // Find the highest priority process (lowest priority number) among arrived processes
    const nextProcess = arrivedProcesses.reduce((prev, curr) => 
      (prev.priority as number) < (curr.priority as number) ? prev : curr
    );
    
    // Remove the process from remaining processes
    remainingProcesses = remainingProcesses.filter(p => p.id !== nextProcess.id);
    
    const waitingTime = Math.max(0, currentTime - nextProcess.arrivalTime);
    const startTime = currentTime;
    const endTime = startTime + nextProcess.burstTime;
    const turnaroundTime = endTime - nextProcess.arrivalTime;
    
    scheduledProcesses.push({
      ...nextProcess,
      startTime,
      endTime,
      waitingTime,
      turnaroundTime,
      responseTime: waitingTime // For Priority scheduling, response time equals waiting time
    });
    
    totalWaitingTime += waitingTime;
    totalTurnaroundTime += turnaroundTime;
    totalBurstTime += nextProcess.burstTime;
    currentTime = endTime;
  }
  
  const averageWaitingTime = totalWaitingTime / processes.length;
  const averageTurnaroundTime = totalTurnaroundTime / processes.length;
  const makespan = scheduledProcesses.length > 0 
    ? Math.max(...scheduledProcesses.map(p => p.endTime)) 
    : 0;
  const throughput = processes.length / (makespan || 1);
  const cpuUtilization = (totalBurstTime / (makespan || 1)) * 100;
  
  return {
    name: "Priority Scheduling",
    scheduledProcesses,
    averageWaitingTime,
    averageTurnaroundTime,
    throughput,
    cpuUtilization,
  };
};

// Function to run all selected algorithms for the given processes
export const runAlgorithms = (
  processes: Process[], 
  selectedAlgorithms: string[]
): AlgorithmResult[] => {
  const results: AlgorithmResult[] = [];
  
  if (selectedAlgorithms.includes("fcfs")) {
    results.push(fcfs(processes));
  }
  
  if (selectedAlgorithms.includes("sjf")) {
    results.push(sjf(processes));
  }
  
  if (selectedAlgorithms.includes("rr")) {
    results.push(roundRobin(processes));
  }
  
  if (selectedAlgorithms.includes("priority")) {
    results.push(priorityScheduling(processes));
  }
  
  return results;
};

// Find the best algorithm based on a specific metric
export const findBestAlgorithm = (
  results: AlgorithmResult[],
  metric: "averageWaitingTime" | "averageTurnaroundTime" | "throughput" | "cpuUtilization" = "averageWaitingTime"
): AlgorithmResult | null => {
  if (results.length === 0) return null;
  
  const compareFn = metric === "throughput" || metric === "cpuUtilization"
    ? (a: number, b: number) => b - a // Higher is better
    : (a: number, b: number) => a - b; // Lower is better
  
  return results.reduce((best, current) => 
    compareFn(current[metric], best[metric]) < 0 ? current : best
  );
};
