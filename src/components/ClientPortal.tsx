
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  FileText, 
  Download, 
  MessageSquare, 
  Clock, 
  CheckCircle,
  AlertTriangle,
  Eye,
  Search,
  Package,
  Calendar
} from "lucide-react";

const mockClientDocuments = [
  {
    id: 'DOC-001',
    shipmentId: 'SHP-2024-001',
    name: 'Bill of Lading - Container MSKU-123456-7',
    type: 'Bill of Lading',
    uploadDate: '2024-01-15',
    status: 'validated',
    size: '2.3 MB',
    comments: [],
    clientCanComment: true
  },
  {
    id: 'DOC-002', 
    shipmentId: 'SHP-2024-001',
    name: 'Factura Comercial - ACME Corp',
    type: 'Factura Comercial',
    uploadDate: '2024-01-16',
    status: 'pending_review',
    size: '1.8 MB',
    comments: [
      {
        id: 1,
        author: 'Freight Forwarder',
        message: 'Favor revisar el valor declarado en la línea 3',
        date: '2024-01-16 14:30',
        type: 'request'
      }
    ],
    clientCanComment: true
  },
  {
    id: 'DOC-003',
    shipmentId: 'SHP-2024-001', 
    name: 'Lista de Empaque',
    type: 'Lista de Empaque',
    uploadDate: '2024-01-16',
    status: 'validated',
    size: '1.2 MB',
    comments: [],
    clientCanComment: true
  }
];

const getStatusConfig = (status: string) => {
  const configs = {
    validated: { 
      label: 'Validado', 
      color: 'bg-green-100 text-green-700',
      icon: CheckCircle 
    },
    pending_review: { 
      label: 'Pendiente Revisión', 
      color: 'bg-yellow-100 text-yellow-700',
      icon: Clock 
    },
    rejected: { 
      label: 'Rechazado', 
      color: 'bg-red-100 text-red-700',
      icon: AlertTriangle 
    }
  };
  return configs[status as keyof typeof configs] || configs.pending_review;
};

export const ClientPortal = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');

  const filteredDocuments = mockClientDocuments.filter(doc =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.shipmentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addComment = (docId: string) => {
    if (!newComment.trim()) return;
    
    // Here you would typically send the comment to your backend
    console.log(`Adding comment to ${docId}: ${newComment}`);
    setNewComment('');
    setSelectedDoc(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Portal del Cliente</h1>
        <p className="text-gray-600">
          Bienvenido, <span className="font-medium">ACME Corp</span>. 
          Aquí puedes revisar y comentar los documentos de tus envíos.
        </p>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-blue-600" />
            <span className="text-gray-600">3 envíos activos</span>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-green-600" />
            <span className="text-gray-600">12 documentos disponibles</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-yellow-600" />
            <span className="text-gray-600">2 requieren atención</span>
          </div>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar documentos por nombre, tipo o envío..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Documents List */}
      <div className="space-y-4">
        {filteredDocuments.map((doc) => {
          const statusConfig = getStatusConfig(doc.status);
          const StatusIcon = statusConfig.icon;
          const isExpanded = selectedDoc === doc.id;

          return (
            <Card key={doc.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <div>
                        <h3 className="font-medium text-gray-900">{doc.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {doc.shipmentId}
                          </Badge>
                          <span className="text-xs text-gray-500">{doc.type}</span>
                          <span className="text-xs text-gray-500">•</span>
                          <span className="text-xs text-gray-500">{doc.size}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>Subido: {new Date(doc.uploadDate).toLocaleDateString('es-ES')}</span>
                      </div>
                      <Badge className={statusConfig.color}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusConfig.label}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3 mr-1" />
                      Ver
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="h-3 w-3 mr-1" />
                      Descargar
                    </Button>
                    {doc.clientCanComment && (
                      <Button 
                        size="sm" 
                        variant={doc.comments.length > 0 ? "default" : "outline"}
                        onClick={() => setSelectedDoc(isExpanded ? null : doc.id)}
                      >
                        <MessageSquare className="h-3 w-3 mr-1" />
                        {doc.comments.length > 0 ? `${doc.comments.length} comentarios` : 'Comentar'}
                      </Button>
                    )}
                  </div>
                </div>

                {/* Comments Section */}
                {doc.comments.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Comentarios</h4>
                    <div className="space-y-3">
                      {doc.comments.map((comment) => (
                        <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-sm font-medium text-gray-900">
                              {comment.author}
                            </span>
                            <span className="text-xs text-gray-500">
                              {comment.date}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700">{comment.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add Comment Form */}
                {isExpanded && doc.clientCanComment && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="space-y-3">
                      <Textarea
                        placeholder="Escribe tu comentario o pregunta..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        rows={3}
                      />
                      <div className="flex justify-end gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setSelectedDoc(null)}
                        >
                          Cancelar
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => addComment(doc.id)}
                          disabled={!newComment.trim()}
                        >
                          Enviar Comentario
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredDocuments.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No se encontraron documentos
            </h3>
            <p className="text-gray-600">
              Intenta ajustar los criterios de búsqueda
            </p>
          </CardContent>
        </Card>
      )}

      {/* Help Section */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="bg-blue-600 rounded-full p-2">
              <MessageSquare className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="font-medium text-blue-900 mb-1">¿Necesitas ayuda?</h3>
              <p className="text-sm text-blue-700 mb-3">
                Si tienes dudas sobre algún documento o necesitas asistencia, 
                no dudes en contactar con tu freight forwarder.
              </p>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                Contactar Soporte
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
