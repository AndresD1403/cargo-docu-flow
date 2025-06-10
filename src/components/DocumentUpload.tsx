
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  Upload, 
  FileText, 
  X, 
  CheckCircle, 
  Loader2,
  Eye,
  Scan,
  AlertCircle
} from "lucide-react";

interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  ocrData?: any;
  classification?: string;
}

export const DocumentUpload = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [selectedShipment, setSelectedShipment] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: UploadedFile[] = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file),
      status: 'uploading'
    }));

    setFiles(prev => [...prev, ...newFiles]);

    // Simulate upload and OCR processing
    newFiles.forEach(uploadedFile => {
      setTimeout(() => {
        setFiles(prev => prev.map(f => 
          f.id === uploadedFile.id 
            ? { ...f, status: 'processing' }
            : f
        ));

        // Simulate OCR processing
        setTimeout(() => {
          setFiles(prev => prev.map(f => 
            f.id === uploadedFile.id 
              ? { 
                  ...f, 
                  status: 'completed',
                  classification: getDocumentType(uploadedFile.file.name),
                  ocrData: {
                    text: "Documento procesado exitosamente",
                    confidence: Math.random() * 30 + 70 // 70-100%
                  }
                }
              : f
          ));
        }, 2000);
      }, 1000);
    });
  }, []);

  const getDocumentType = (filename: string) => {
    const name = filename.toLowerCase();
    if (name.includes('bl') || name.includes('lading')) return 'Bill of Lading';
    if (name.includes('invoice') || name.includes('factura')) return 'Factura Comercial';
    if (name.includes('packing') || name.includes('lista')) return 'Lista de Empaque';
    if (name.includes('certificate') || name.includes('certificado')) return 'Certificado';
    return 'Documento General';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    onDrop(droppedFiles);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      onDrop(selectedFiles);
    }
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const submitDocuments = () => {
    if (files.length === 0) {
      toast({
        title: "Error",
        description: "Selecciona al menos un documento para subir",
        variant: "destructive",
      });
      return;
    }

    if (!selectedShipment) {
      toast({
        title: "Error", 
        description: "Selecciona un envío para asociar los documentos",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Éxito",
      description: `${files.length} documento(s) subido(s) correctamente`,
    });

    // Reset form
    setFiles([]);
    setSelectedShipment('');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-blue-600" />
            Subir Documentos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Shipment Selection */}
          <div className="space-y-2">
            <Label htmlFor="shipment">Envío Asociado *</Label>
            <Select value={selectedShipment} onValueChange={setSelectedShipment}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un envío" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SHP-2024-001">SHP-2024-001 - ACME Corp (Barcelona → Miami)</SelectItem>
                <SelectItem value="SHP-2024-002">SHP-2024-002 - Global Trade (Valencia → New York)</SelectItem>
                <SelectItem value="SHP-2024-003">SHP-2024-003 - Import Express (Madrid → Los Angeles)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragOver 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-700 mb-2">
              Arrastra documentos aquí o haz clic para seleccionar
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Soporta PDF, JPG, PNG (máx. 10MB por archivo)
            </p>
            <input
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileInput}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button variant="outline" className="cursor-pointer">
                Seleccionar Archivos
              </Button>
            </label>
          </div>

          {/* Uploaded Files List */}
          {files.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Documentos Subidos</h3>
              <div className="space-y-3">
                {files.map((file) => (
                  <div key={file.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <FileText className="h-8 w-8 text-blue-600 flex-shrink-0" />
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{file.file.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-gray-500">
                          {(file.file.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                        {file.classification && (
                          <Badge variant="secondary" className="text-xs">
                            {file.classification}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {file.status === 'uploading' && (
                        <div className="flex items-center gap-2 text-blue-600">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-sm">Subiendo...</span>
                        </div>
                      )}
                      
                      {file.status === 'processing' && (
                        <div className="flex items-center gap-2 text-yellow-600">
                          <Scan className="h-4 w-4" />
                          <span className="text-sm">Procesando OCR...</span>
                        </div>
                      )}
                      
                      {file.status === 'completed' && (
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle className="h-4 w-4" />
                          <span className="text-sm">
                            Procesado ({file.ocrData?.confidence?.toFixed(0)}% precisión)
                          </span>
                        </div>
                      )}
                      
                      {file.status === 'error' && (
                        <div className="flex items-center gap-2 text-red-600">
                          <AlertCircle className="h-4 w-4" />
                          <span className="text-sm">Error</span>
                        </div>
                      )}

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeFile(file.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Additional Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tags">Etiquetas (opcional)</Label>
              <Input id="tags" placeholder="urgente, BL, exportación" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Prioridad</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Normal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baja</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="urgent">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comments">Comentarios</Label>
            <Textarea 
              id="comments" 
              placeholder="Información adicional sobre estos documentos..."
              rows={3}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button 
              onClick={submitDocuments}
              className="bg-blue-600 hover:bg-blue-700"
              disabled={files.length === 0 || !selectedShipment}
            >
              Subir {files.length} Documento(s)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
