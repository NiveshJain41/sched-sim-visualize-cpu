
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Info, Cpu, Zap, Brain, Settings } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export interface Algorithm {
  id: string;
  name: string;
  description: string;
  category: "basic" | "advanced";
}

interface AlgorithmSelectionProps {
  algorithms: Algorithm[];
  selectedAlgorithms: string[];
  onSelectionChange: (selectedIds: string[]) => void;
}

export function AlgorithmSelection({ 
  algorithms, 
  selectedAlgorithms, 
  onSelectionChange 
}: AlgorithmSelectionProps) {
  const toggleAlgorithm = (algorithmId: string) => {
    if (selectedAlgorithms.includes(algorithmId)) {
      onSelectionChange(selectedAlgorithms.filter((id) => id !== algorithmId));
    } else {
      onSelectionChange([...selectedAlgorithms, algorithmId]);
    }
  };

  const basicAlgorithms = algorithms.filter(algo => algo.category !== "advanced");
  const advancedAlgorithms = algorithms.filter(algo => algo.category === "advanced");

  const renderAlgorithmGroup = (algorithmList: Algorithm[], isAdvanced = false) => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {algorithmList.map((algorithm, index) => (
        <div
          key={algorithm.id}
          className={`group relative flex items-center space-x-4 rounded-2xl border p-6 transition-all duration-300 cursor-pointer ${
            selectedAlgorithms.includes(algorithm.id)
              ? isAdvanced 
                ? 'border-purple-400/50 bg-gradient-to-r from-purple-500/10 to-pink-500/10 shadow-lg shadow-purple-500/20 scale-105' 
                : 'border-blue-400/50 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 shadow-lg shadow-blue-500/20 scale-105'
              : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 hover:scale-102'
          }`}
          style={{animationDelay: `${index * 0.1}s`}}
          onClick={() => toggleAlgorithm(algorithm.id)}
        >
          <div className="absolute inset-0 bg-gradient-to-r opacity-20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"
               style={{
                 background: selectedAlgorithms.includes(algorithm.id) 
                   ? isAdvanced 
                     ? 'linear-gradient(to right, #8b5cf6, #ec4899)' 
                     : 'linear-gradient(to right, #3b82f6, #06b6d4)'
                   : 'transparent'
               }}></div>
          
          <div className="relative z-10 flex items-center space-x-4 w-full">
            <Checkbox
              id={algorithm.id}
              checked={selectedAlgorithms.includes(algorithm.id)}
              onChange={() => {}} // Handled by parent onClick
              className="border-slate-500 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-500 data-[state=checked]:to-purple-500 data-[state=checked]:border-transparent"
            />
            
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor={algorithm.id}
                  className="font-semibold leading-none text-white cursor-pointer text-base"
                >
                  {algorithm.name}
                </Label>
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <button 
                      className="inline-flex items-center p-1 rounded-lg hover:bg-white/10 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Info className="h-4 w-4 text-slate-400 hover:text-slate-300" />
                    </button>
                  </HoverCardTrigger>
                  <HoverCardContent 
                    className="w-80 text-sm bg-slate-900/95 backdrop-blur-xl border-slate-700/50 text-slate-200 rounded-xl shadow-2xl" 
                    side="top"
                  >
                    <div className="space-y-2">
                      <h4 className="font-semibold text-white">{algorithm.name}</h4>
                      <p className="text-slate-300 leading-relaxed">{algorithm.description}</p>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </div>
              
              <div className="flex items-center gap-2">
                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                  isAdvanced 
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                }`}>
                  {isAdvanced ? <Brain className="h-3 w-3" /> : <Settings className="h-3 w-3" />}
                  {isAdvanced ? 'Metaheuristic' : 'Traditional'}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-2xl blur-xl"></div>
      <Card className="relative w-full border-0 bg-white/5 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-slate-800/30 to-slate-900/30">
          <CardTitle className="text-xl text-white flex items-center gap-3 font-bold">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
              <Cpu className="h-5 w-5 text-white" />
            </div>
            Algorithm Selection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8 p-8">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                <Cpu className="h-4 w-4 text-white" />
              </div>
              <h3 className="font-semibold text-white text-lg">Traditional Algorithms</h3>
              <div className="flex-1 h-px bg-gradient-to-r from-blue-500/50 to-transparent"></div>
            </div>
            {renderAlgorithmGroup(basicAlgorithms)}
          </div>
          
          {advancedAlgorithms.length > 0 && (
            <>
              <Separator className="bg-gradient-to-r from-transparent via-slate-600 to-transparent h-px" />
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                    <Zap className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="font-semibold text-white text-lg">Advanced Metaheuristic Algorithms</h3>
                  <div className="flex-1 h-px bg-gradient-to-r from-purple-500/50 to-transparent"></div>
                </div>
                {renderAlgorithmGroup(advancedAlgorithms, true)}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
