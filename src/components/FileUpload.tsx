
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, File, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface FileUploadProps {
  onFileUploaded: (file: File | null) => void;
}

export function FileUpload({ onFileUploaded }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    
    if (!selectedFile) return;
    
    if (!selectedFile.name.endsWith('.py')) {
      toast.error("Please upload a Python (.py) file");
      return;
    }
    
    setFile(selectedFile);
    onFileUploaded(selectedFile);
    toast.success("File uploaded successfully! Ready to start the simulation.");
  };

  const removeFile = () => {
    setFile(null);
    onFileUploaded(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files?.[0];
    
    if (!droppedFile) return;
    
    if (!droppedFile.name.endsWith('.py')) {
      toast.error("Please upload a Python (.py) file");
      return;
    }
    
    setFile(droppedFile);
    onFileUploaded(droppedFile);
    toast.success("File uploaded successfully! Ready to start the simulation.");
  };

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        {file ? (
          <div className="flex items-center p-4 border border-border rounded-md bg-secondary/20 animate-slide-in">
            <File className="h-8 w-8 text-cpu-purple mr-4" />
            <div className="flex-1">
              <p className="font-medium">{file.name}</p>
              <p className="text-sm text-muted-foreground">
                {(file.size / 1024).toFixed(2)} KB
              </p>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={removeFile}
              className="text-muted-foreground hover:text-destructive"
            >
              <X className="h-5 w-5" />
            </Button>
            <Check className="h-5 w-5 ml-2 text-green-500" />
          </div>
        ) : (
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
              isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/20"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="mx-auto flex flex-col items-center justify-center gap-2">
              <Upload className="h-10 w-10 text-muted-foreground/70" />
              <h3 className="text-lg font-medium mt-2">Upload Python File</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Upload a Python file containing functions that simulate processes
              </p>
              <input
                type="file"
                accept=".py"
                id="file-upload"
                className="hidden"
                onChange={handleFileChange}
              />
              <Button asChild>
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="mr-2 h-4 w-4" />
                  Browse Files
                </label>
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                or drop your file here
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
