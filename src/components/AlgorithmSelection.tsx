import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Info } from "lucide-react";
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

  const renderAlgorithmGroup = (algorithmList: Algorithm[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {algorithmList.map((algorithm) => (
        <div
          key={algorithm.id}
          className="flex items-center space-x-3 space-y-0 rounded-md border p-4 hover:bg-accent/50 transition-colors"
        >
          <Checkbox
            id={algorithm.id}
            checked={selectedAlgorithms.includes(algorithm.id)}
            onCheckedChange={() => toggleAlgorithm(algorithm.id)}
          />
          <div className="flex-1 space-y-1">
            <div className="flex items-center">
              <Label
                htmlFor={algorithm.id}
                className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {algorithm.name}
              </Label>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <button className="ml-2 inline-flex items-center">
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </button>
                </HoverCardTrigger>
                <HoverCardContent className="w-80 text-sm" side="top">
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
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Choose Scheduling Algorithms</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-medium mb-3">Basic Algorithms</h3>
          {renderAlgorithmGroup(basicAlgorithms)}
        </div>
        
        {advancedAlgorithms.length > 0 && (
          <>
            <Separator />
            <div>
              <h3 className="font-medium mb-3">Advanced Metaheuristic Algorithms</h3>
              {renderAlgorithmGroup(advancedAlgorithms)}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
