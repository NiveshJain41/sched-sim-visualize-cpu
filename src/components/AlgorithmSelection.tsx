
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Info, Cpu, Zap } from "lucide-react";
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {algorithmList.map((algorithm) => (
        <div
          key={algorithm.id}
          className={`flex items-center space-x-3 space-y-0 rounded-lg border p-4 transition-all duration-200 ${
            selectedAlgorithms.includes(algorithm.id)
              ? isAdvanced 
                ? 'border-purple-500/50 bg-purple-600/10 shadow-lg shadow-purple-500/20' 
                : 'border-blue-500/50 bg-blue-600/10 shadow-lg shadow-blue-500/20'
              : 'border-slate-700/50 bg-slate-800/30 hover:bg-slate-700/30'
          }`}
        >
          <Checkbox
            id={algorithm.id}
            checked={selectedAlgorithms.includes(algorithm.id)}
            onCheckedChange={() => toggleAlgorithm(algorithm.id)}
            className="border-slate-600 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-600 data-[state=checked]:to-purple-600"
          />
          <div className="flex-1 space-y-1">
            <div className="flex items-center">
              <Label
                htmlFor={algorithm.id}
                className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-white cursor-pointer"
              >
                {algorithm.name}
              </Label>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <button className="ml-2 inline-flex items-center">
                    <Info className="h-4 w-4 text-slate-400 hover:text-slate-300" />
                  </button>
                </HoverCardTrigger>
                <HoverCardContent 
                  className="w-80 text-sm bg-slate-800 border-slate-700 text-slate-200" 
                  side="top"
                >
                  {algorithm.description}
                </HoverCardContent>
              </HoverCard>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <Card className="w-full border-slate-700/50 bg-slate-800/30 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg text-white flex items-center gap-2">
          <Cpu className="h-5 w-5 text-blue-400" />
          Choose Scheduling Algorithms
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Cpu className="h-4 w-4 text-blue-400" />
            <h3 className="font-medium text-white">Traditional Algorithms</h3>
          </div>
          {renderAlgorithmGroup(basicAlgorithms)}
        </div>
        
        {advancedAlgorithms.length > 0 && (
          <>
            <Separator className="bg-slate-700/50" />
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Zap className="h-4 w-4 text-purple-400" />
                <h3 className="font-medium text-white">Advanced Metaheuristic Algorithms</h3>
              </div>
              {renderAlgorithmGroup(advancedAlgorithms, true)}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
