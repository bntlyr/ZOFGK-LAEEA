'use client';

import { useState } from 'react';
import { Upload, File } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface FileUploadProps {
  label: string;
  acceptedFileTypes: string;
  onFileSelect: (file: File) => void;
}

export function FileUpload({ label, acceptedFileTypes, onFileSelect }: FileUploadProps) {
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      onFileSelect(file);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={`file-upload-${label}`} className="text-sm font-medium text-gray-700">
        {label}
      </Label>
      <div className="flex items-center space-x-2">
        <Input
          id={`file-upload-${label}`}
          type="file"
          accept={acceptedFileTypes}
          onChange={handleFileChange}
          className="hidden"
        />
        <Button
          onClick={() => document.getElementById(`file-upload-${label}`)?.click()}
          variant="outline"
          className="w-full justify-start text-left font-normal hover:bg-blue-50"
        >
          <Upload className="mr-2 h-4 w-4" />
          {fileName || `Choose ${label} file`}
        </Button>
        {fileName && (
          <Button variant="ghost" size="icon" className="text-blue-600 hover:text-blue-800">
            <File className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}