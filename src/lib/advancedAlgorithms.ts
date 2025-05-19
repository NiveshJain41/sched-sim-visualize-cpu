import { Process } from "@/components/AddProcessModal";
import { AlgorithmResult, ScheduledProcess } from "@/lib/cpuScheduling";

// Helper function to calculate common metrics
const calculateMetrics = (
  processes: Process[],
  scheduledProcesses: ScheduledProcess[]
): {
  averageWaitingTime: number;
  averageTurnaroundTime: number;
  throughput: number;
  cpuUtilization: number;
} => {
  const totalWaitingTime = scheduledProcesses.reduce((sum, p) => sum + p.waitingTime, 0);
  const totalTurnaroundTime = scheduledProcesses.reduce((sum, p) => sum + p.turnaroundTime, 0);
  const totalBurstTime = processes.reduce((sum, p) => sum + p.burstTime, 0);
  
  const averageWaitingTime = totalWaitingTime / processes.length;
  const averageTurnaroundTime = totalTurnaroundTime / processes.length;
  
  const makespan = scheduledProcesses.length > 0 
    ? Math.max(...scheduledProcesses.map(p => p.endTime)) 
    : 0;
  const throughput = processes.length / (makespan || 1);
  const cpuUtilization = (totalBurstTime / (makespan || 1)) * 100;
  
  return {
    averageWaitingTime,
    averageTurnaroundTime,
    throughput,
    cpuUtilization
  };
};

// Genetic Algorithm (GA)
export const geneticAlgorithm = (processes: Process[]): AlgorithmResult => {
  // Sort processes initially by arrival time
  const sortedProcesses = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
  
  // Population parameters
  const populationSize = 50;
  const generations = 100;
  const mutationRate = 0.1;
  
  // Initialize population with different permutations
  let population: Process[][] = [];
  
  // First solution is just sorted by arrival time (FCFS-like)
  population.push(sortedProcesses);
  
  // Second solution is sorted by burst time (SJF-like)
  population.push([...sortedProcesses].sort((a, b) => a.burstTime - b.burstTime));
  
  // Generate more random permutations for diversity
  for (let i = 2; i < populationSize; i++) {
    const randomPermutation = [...sortedProcesses].sort(() => Math.random() - 0.5);
    population.push(randomPermutation);
  }
  
  // Fitness function: evaluate a solution (lower is better)
  const evaluateFitness = (solution: Process[]): { fitness: number, scheduledProcesses: ScheduledProcess[] } => {
    const scheduledProcesses: ScheduledProcess[] = [];
    let currentTime = 0;
    
    // Process each task according to the solution order, respecting arrival times
    for (const process of solution) {
      // If process hasn't arrived yet, advance time
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
        responseTime: waitingTime
      });
      
      currentTime = endTime;
    }
    
    // Calculate fitness based on average waiting time (lower is better)
    const totalWaitingTime = scheduledProcesses.reduce((sum, p) => sum + p.waitingTime, 0);
    const fitness = totalWaitingTime / scheduledProcesses.length;
    
    return { fitness, scheduledProcesses };
  };
  
  // Selection: tournament selection
  const selectParent = (evaluatedPopulation: { solution: Process[], fitness: number }[]): Process[] => {
    const tournamentSize = 3;
    const tournament = Array(tournamentSize).fill(0).map(() => 
      evaluatedPopulation[Math.floor(Math.random() * evaluatedPopulation.length)]
    );
    
    // Return the best solution from the tournament
    return tournament.reduce((best, current) => 
      current.fitness < best.fitness ? current : best
    ).solution;
  };
  
  // Crossover: order crossover (OX)
  const crossover = (parent1: Process[], parent2: Process[]): Process[] => {
    const size = parent1.length;
    if (size < 2) return [...parent1]; // No crossover for single process
    
    // Choose two random crossover points
    const start = Math.floor(Math.random() * (size - 1));
    const end = start + 1 + Math.floor(Math.random() * (size - start - 1));
    
    // Create child with segment from parent1
    const child: Process[] = Array(size).fill(null);
    for (let i = start; i <= end; i++) {
      child[i] = parent1[i];
    }
    
    // Fill remaining positions with processes from parent2, preserving order
    let j = 0;
    for (let i = 0; i < size; i++) {
      if (i >= start && i <= end) continue;
      
      // Find next process from parent2 that isn't already in child
      while (child.some(p => p && p.id === parent2[j].id)) {
        j = (j + 1) % size;
      }
      
      child[i] = parent2[j];
      j = (j + 1) % size;
    }
    
    return child;
  };
  
  // Mutation: swap mutation
  const mutate = (solution: Process[]): Process[] => {
    const result = [...solution];
    if (Math.random() < mutationRate && solution.length > 1) {
      // Swap two random positions
      const pos1 = Math.floor(Math.random() * solution.length);
      let pos2 = Math.floor(Math.random() * solution.length);
      while (pos1 === pos2) {
        pos2 = Math.floor(Math.random() * solution.length);
      }
      
      // Swap
      [result[pos1], result[pos2]] = [result[pos2], result[pos1]];
    }
    return result;
  };
  
  // Main GA loop
  let bestSolution = { fitness: Infinity, scheduledProcesses: [] as ScheduledProcess[] };
  
  for (let gen = 0; gen < generations; gen++) {
    // Evaluate all solutions
    const evaluatedPopulation = population.map(solution => {
      const evaluated = evaluateFitness(solution);
      return { solution, fitness: evaluated.fitness, scheduledProcesses: evaluated.scheduledProcesses };
    });
    
    // Track best solution
    const generationBest = evaluatedPopulation.reduce((best, current) => 
      current.fitness < best.fitness ? current : best
    );
    
    if (generationBest.fitness < bestSolution.fitness) {
      bestSolution = generationBest;
    }
    
    // Create new population through selection, crossover, and mutation
    const newPopulation: Process[][] = [];
    
    // Elitism: keep best solution
    newPopulation.push(generationBest.solution);
    
    // Generate rest of population
    while (newPopulation.length < populationSize) {
      const parent1 = selectParent(evaluatedPopulation);
      const parent2 = selectParent(evaluatedPopulation);
      let child = crossover(parent1, parent2);
      child = mutate(child);
      newPopulation.push(child);
    }
    
    // Replace population
    population = newPopulation;
  }
  
  const metrics = calculateMetrics(processes, bestSolution.scheduledProcesses);
  
  return {
    name: "Genetic Algorithm (GA)",
    scheduledProcesses: bestSolution.scheduledProcesses,
    ...metrics
  };
};

// Particle Swarm Optimization (PSO)
export const particleSwarmOptimization = (processes: Process[]): AlgorithmResult => {
  // Sort processes initially by arrival time
  const sortedProcesses = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
  
  // PSO parameters
  const particlesCount = 40;
  const iterations = 80;
  const w = 0.7; // Inertia weight
  const c1 = 1.5; // Cognitive parameter
  const c2 = 1.5; // Social parameter
  
  // Represent positions as sequences of processes
  type Particle = {
    position: Process[];    // Current sequence
    velocity: number[];     // Velocity vector (affecting swap probabilities)
    personalBest: {
      position: Process[];
      fitness: number;
      scheduledProcesses: ScheduledProcess[];
    };
  };
  
  // Initialize particles
  const particles: Particle[] = [];
  for (let i = 0; i < particlesCount; i++) {
    const initialPosition = [...sortedProcesses].sort(() => Math.random() - 0.5);
    const initialVelocity = Array(sortedProcesses.length).fill(0).map(() => Math.random());
    
    const evaluated = evaluatePosition(initialPosition);
    
    particles.push({
      position: initialPosition,
      velocity: initialVelocity,
      personalBest: {
        position: [...initialPosition],
        fitness: evaluated.fitness,
        scheduledProcesses: evaluated.scheduledProcesses
      }
    });
  }
  
  // Global best
  let globalBest = {
    position: [...particles[0].position],
    fitness: Infinity,
    scheduledProcesses: [] as ScheduledProcess[]
  };
  
  // Evaluate position
  function evaluatePosition(position: Process[]): { fitness: number, scheduledProcesses: ScheduledProcess[] } {
    const scheduledProcesses: ScheduledProcess[] = [];
    let currentTime = 0;
    
    // Process each task according to position order, respecting arrival times
    for (const process of position) {
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
        responseTime: waitingTime
      });
      
      currentTime = endTime;
    }
    
    // Calculate fitness based on average waiting time (lower is better)
    const totalWaitingTime = scheduledProcesses.reduce((sum, p) => sum + p.waitingTime, 0);
    const fitness = totalWaitingTime / scheduledProcesses.length;
    
    return { fitness, scheduledProcesses };
  }
  
  // Calculate distance between two positions (number of different positions)
  function calculateDistance(position1: Process[], position2: Process[]): number {
    let distance = 0;
    for (let i = 0; i < position1.length; i++) {
      if (position1[i].id !== position2[i].id) {
        distance++;
      }
    }
    return distance;
  }
  
  // Update position based on velocity
  function updatePosition(particle: Particle): Process[] {
    const newPosition = [...particle.position];
    
    // Swap elements with probability based on velocity
    for (let i = 0; i < newPosition.length; i++) {
      if (Math.random() < particle.velocity[i]) {
        // Swap with random element
        const j = Math.floor(Math.random() * newPosition.length);
        [newPosition[i], newPosition[j]] = [newPosition[j], newPosition[i]];
      }
    }
    
    return newPosition;
  }
  
  // Main PSO loop
  for (let iter = 0; iter < iterations; iter++) {
    for (const particle of particles) {
      // Update velocity
      for (let i = 0; i < particle.velocity.length; i++) {
        const r1 = Math.random();
        const r2 = Math.random();
        
        // Cognitive component: personal best influence
        const personalInfluence = c1 * r1 * calculateDistance(particle.position, particle.personalBest.position);
        
        // Social component: global best influence
        const socialInfluence = c2 * r2 * calculateDistance(particle.position, globalBest.position);
        
        // Update velocity with inertia
        particle.velocity[i] = w * particle.velocity[i] + personalInfluence + socialInfluence;
      }
      
      // Update position
      particle.position = updatePosition(particle);
      
      // Evaluate new position
      const evaluated = evaluatePosition(particle.position);
      
      // Update personal best if better
      if (evaluated.fitness < particle.personalBest.fitness) {
        particle.personalBest = {
          position: [...particle.position],
          fitness: evaluated.fitness,
          scheduledProcesses: evaluated.scheduledProcesses
        };
        
        // Update global best if better
        if (evaluated.fitness < globalBest.fitness) {
          globalBest = {
            position: [...particle.position],
            fitness: evaluated.fitness,
            scheduledProcesses: evaluated.scheduledProcesses
          };
        }
      }
    }
  }
  
  const metrics = calculateMetrics(processes, globalBest.scheduledProcesses);
  
  return {
    name: "Particle Swarm Optimization (PSO)",
    scheduledProcesses: globalBest.scheduledProcesses,
    ...metrics
  };
};

// Ant Colony Optimization (ACO)
export const antColonyOptimization = (processes: Process[]): AlgorithmResult => {
  // Sort processes initially by arrival time
  const sortedProcesses = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
  
  // ACO parameters
  const numAnts = 30;
  const numIterations = 100;
  const alpha = 1;  // Pheromone importance
  const beta = 3;   // Heuristic importance
  const rho = 0.1;  // Pheromone evaporation rate
  const q = 100;    // Pheromone deposit factor
  
  // Initialize pheromone matrix
  const n = processes.length;
  const pheromones: number[][] = Array(n).fill(0).map(() => Array(n).fill(1));  // Initial pheromone = 1
  
  // Heuristic information: inverse of burst time difference
  const heuristic: number[][] = Array(n).fill(0).map(() => Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i !== j) {
        // Prefer processes with shorter burst time
        const diff = Math.abs(processes[i].burstTime - processes[j].burstTime);
        heuristic[i][j] = 1 / (1 + diff);  // Avoid division by zero
      }
    }
  }
  
  // Keep track of the best solution
  let bestSolution: { path: Process[], fitness: number, scheduledProcesses: ScheduledProcess[] } = {
    path: [],
    fitness: Infinity,
    scheduledProcesses: []
  };
  
  // Evaluate a solution
  function evaluateSolution(path: Process[]): { fitness: number, scheduledProcesses: ScheduledProcess[] } {
    const scheduledProcesses: ScheduledProcess[] = [];
    let currentTime = 0;
    
    for (const process of path) {
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
        responseTime: waitingTime
      });
      
      currentTime = endTime;
    }
    
    const totalWaitingTime = scheduledProcesses.reduce((sum, p) => sum + p.waitingTime, 0);
    const fitness = totalWaitingTime / scheduledProcesses.length;
    
    return { fitness, scheduledProcesses };
  }
  
  // Main ACO loop
  for (let iter = 0; iter < numIterations; iter++) {
    // Array to store all ant solutions for updating pheromones
    const antSolutions: { path: Process[], fitness: number }[] = [];
    
    // Each ant constructs a solution
    for (let ant = 0; ant < numAnts; ant++) {
      const visited = new Set<number>();
      const path: Process[] = [];
      
      // Start with a random process
      let current = Math.floor(Math.random() * n);
      path.push(processes[current]);
      visited.add(current);
      
      // Construct the rest of the path
      while (visited.size < n) {
        // Calculate probabilities for next process
        const probabilities: number[] = [];
        let sum = 0;
        
        for (let next = 0; next < n; next++) {
          if (visited.has(next)) {
            probabilities.push(0);
          } else {
            const p = Math.pow(pheromones[current][next], alpha) * Math.pow(heuristic[current][next], beta);
            probabilities.push(p);
            sum += p;
          }
        }
        
        // Normalize probabilities
        if (sum > 0) {
          for (let i = 0; i < n; i++) {
            probabilities[i] /= sum;
          }
        }
        
        // Select next process using roulette wheel selection
        const r = Math.random();
        let cumulativeProbability = 0;
        
        for (let next = 0; next < n; next++) {
          cumulativeProbability += probabilities[next];
          if (r <= cumulativeProbability && !visited.has(next)) {
            current = next;
            path.push(processes[next]);
            visited.add(next);
            break;
          }
        }
      }
      
      // Evaluate the constructed path
      const { fitness, scheduledProcesses } = evaluateSolution(path);
      antSolutions.push({ path, fitness });
      
      // Update best solution if needed
      if (fitness < bestSolution.fitness) {
        bestSolution = { path: [...path], fitness, scheduledProcesses };
      }
    }
    
    // Evaporate all pheromones
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        pheromones[i][j] *= (1 - rho);
      }
    }
    
    // Deposit new pheromones based on ant solutions
    for (const { path, fitness } of antSolutions) {
      const deposit = q / fitness;  // Better solutions get more pheromones
      
      for (let i = 0; i < path.length - 1; i++) {
        const from = processes.findIndex(p => p.id === path[i].id);
        const to = processes.findIndex(p => p.id === path[i + 1].id);
        
        if (from >= 0 && to >= 0) {
          pheromones[from][to] += deposit;
        }
      }
      
      // Close the loop (last to first)
      const from = processes.findIndex(p => p.id === path[path.length - 1].id);
      const to = processes.findIndex(p => p.id === path[0].id);
      
      if (from >= 0 && to >= 0) {
        pheromones[from][to] += deposit;
      }
    }
  }
  
  const metrics = calculateMetrics(processes, bestSolution.scheduledProcesses);
  
  return {
    name: "Ant Colony Optimization (ACO)",
    scheduledProcesses: bestSolution.scheduledProcesses,
    ...metrics
  };
};

// Simulated Annealing (SA)
export const simulatedAnnealing = (processes: Process[]): AlgorithmResult => {
  // Sort processes initially by arrival time
  const sortedProcesses = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
  
  // SA parameters
  const initialTemperature = 100;
  const coolingRate = 0.98;
  const minTemperature = 0.1;
  const iterationsPerTemperature = 30;
  
  // Current solution is sorted by arrival time (FCFS-like)
  let currentSolution = [...sortedProcesses];
  let { fitness: currentFitness, scheduledProcesses: currentScheduled } = evaluateSolution(currentSolution);
  
  // Best solution so far
  let bestSolution = [...currentSolution];
  let bestFitness = currentFitness;
  let bestScheduledProcesses = currentScheduled;
  
  // Temperature
  let temperature = initialTemperature;
  
  // Evaluate a solution
  function evaluateSolution(solution: Process[]): { fitness: number, scheduledProcesses: ScheduledProcess[] } {
    const scheduledProcesses: ScheduledProcess[] = [];
    let currentTime = 0;
    
    for (const process of solution) {
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
        responseTime: waitingTime
      });
      
      currentTime = endTime;
    }
    
    const totalWaitingTime = scheduledProcesses.reduce((sum, p) => sum + p.waitingTime, 0);
    const fitness = totalWaitingTime / scheduledProcesses.length;
    
    return { fitness, scheduledProcesses };
  }
  
  // Generate a neighbor solution by swapping two processes
  function generateNeighbor(solution: Process[]): Process[] {
    const neighbor = [...solution];
    const i = Math.floor(Math.random() * neighbor.length);
    let j = Math.floor(Math.random() * neighbor.length);
    
    while (i === j) {
      j = Math.floor(Math.random() * neighbor.length);
    }
    
    [neighbor[i], neighbor[j]] = [neighbor[j], neighbor[i]];
    return neighbor;
  }
  
  // Main simulated annealing loop
  while (temperature > minTemperature) {
    for (let i = 0; i < iterationsPerTemperature; i++) {
      // Generate a neighbor solution
      const neighborSolution = generateNeighbor(currentSolution);
      const { fitness: neighborFitness, scheduledProcesses: neighborScheduled } = evaluateSolution(neighborSolution);
      
      // Calculate acceptance probability
      const delta = neighborFitness - currentFitness;
      const acceptanceProbability = delta < 0 ? 1 : Math.exp(-delta / temperature);
      
      // Decide whether to accept the neighbor
      if (Math.random() < acceptanceProbability) {
        currentSolution = neighborSolution;
        currentFitness = neighborFitness;
        currentScheduled = neighborScheduled;
        
        // Update best solution if needed
        if (currentFitness < bestFitness) {
          bestSolution = [...currentSolution];
          bestFitness = currentFitness;
          bestScheduledProcesses = neighborScheduled;
        }
      }
    }
    
    // Cool down
    temperature *= coolingRate;
  }
  
  const metrics = calculateMetrics(processes, bestScheduledProcesses);
  
  return {
    name: "Simulated Annealing (SA)",
    scheduledProcesses: bestScheduledProcesses,
    ...metrics
  };
};
