
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Package, 
  Search, 
  FileText, 
  Calendar, 
  MapPin,
  Clock,
  User,
  Eye,
  Plus
} from "lucide-react";

const mockShipments = [
  {
    id: 'SHP-2024-001',
    client: 'ACME Corp',
    origin: 'Barcelona, España',
    destination: 'Miami, FL',
    status: 'en_transito',
    departure: '2024-01-15',
    estimated: '2024-01-22',
    documents: 8,
    pendingDocs: 2,
    type: 'FCL',
    container: 'MSKU-123456-7'
  },
  {
    id: 'SHP-2024-002', 
    client: 'Global Trade Ltd',
    origin: 'Valencia, España',
    destination: 'New York, NY',
    status: 'documentacion',
    departure: '2024-01-18',
    estimated: '2024-01-25',
    documents: 12,
    pendingDocs: 0,
    type: 'LCL',
    container: 'TCLU-789012-3'
  },
  {
    id: 'SHP-2024-003',
    client: 'Import Express',
    origin: 'Madrid, España', 
    destination: 'Los Angeles, CA',
    status: 'preparacion',
    departure: '2024-01-20',
    estimated: '2024-01-28',
    documents: 5,
    pendingDocs: 3,
    type: 'FCL',
    container: 'OOLU-345678-9'
  }
];

const getStatusBadge = (status: string) => {
  const statusConfig = {
    preparacion: { label: 'Preparación', variant: 'secondary' as const, color: 'bg-gray-100 text-gray-700' },
    documentacion: { label: 'Documentación', variant: 'default' as const, color: 'bg-yellow-100 text-yellow-700' },
    en_transito: { label: 'En Tránsito', variant: 'default' as const, color: 'bg-blue-100 text-blue-700' },
    entregado: { label: 'Entregado', variant: 'default' as const, color: 'bg-green-100 text-green-700' }
  };
  
  return statusConfig[status as keyof typeof statusConfig] || statusConfig.preparacion;
};

export const ShipmentsList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const filteredShipments = mockShipments.filter(shipment => {
    const matchesSearch = shipment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shipment.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shipment.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shipment.destination.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || shipment.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Envíos</h1>
          <p className="text-gray-600">Administra y rastrea todos tus envíos internacionales</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Envío
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por ID, cliente, origen o destino..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              {['all', 'preparacion', 'documentacion', 'en_transito', 'entregado'].map((status) => (
                <Button
                  key={status}
                  variant={selectedStatus === status ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedStatus(status)}
                  className="capitalize"
                >
                  {status === 'all' ? 'Todos' : getStatusBadge(status).label}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shipments Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredShipments.map((shipment) => {
          const statusConfig = getStatusBadge(shipment.status);
          return (
            <Card key={shipment.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-900">
                      {shipment.id}
                    </CardTitle>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {shipment.client}
                    </p>
                  </div>
                  <Badge className={statusConfig.color}>
                    {statusConfig.label}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Route */}
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-600 truncate">
                    {shipment.origin} → {shipment.destination}
                  </span>
                </div>

                {/* Container & Type */}
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Package className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">{shipment.type}</span>
                  </div>
                  <span className="text-xs text-gray-500 font-mono">
                    {shipment.container}
                  </span>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 text-xs">Salida</p>
                    <p className="font-medium text-gray-900 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(shipment.departure).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Est. llegada</p>
                    <p className="font-medium text-gray-900 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(shipment.estimated).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                </div>

                {/* Documents Status */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-900">
                        Documentos
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {shipment.documents} total
                      </Badge>
                      {shipment.pendingDocs > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {shipment.pendingDocs} pendientes
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Eye className="h-3 w-3 mr-1" />
                    Ver Detalles
                  </Button>
                  <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                    <FileText className="h-3 w-3 mr-1" />
                    Documentos
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredShipments.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No se encontraron envíos
            </h3>
            <p className="text-gray-600">
              Intenta ajustar los filtros de búsqueda
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
