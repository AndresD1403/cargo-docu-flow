
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Package, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Users,
  Upload,
  Eye
} from "lucide-react";

export const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* KPIs Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Documentos Activos
            </CardTitle>
            <FileText className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">1,247</div>
            <p className="text-xs text-green-600 flex items-center gap-1">
              <span>+12%</span>
              <span className="text-gray-500">vs mes anterior</span>
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Envíos en Proceso
            </CardTitle>
            <Package className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">34</div>
            <p className="text-xs text-gray-500">
              15 próximos a entregar
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Docs. Pendientes
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">8</div>
            <p className="text-xs text-red-600">
              3 requieren atención urgente
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Clientes Activos
            </CardTitle>
            <Users className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">127</div>
            <p className="text-xs text-gray-500">
              5 nuevos este mes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-blue-600" />
            Acciones Rápidas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="h-20 flex flex-col gap-2 bg-blue-600 hover:bg-blue-700">
              <Upload className="h-6 w-6" />
              <span>Subir Documentos</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2 hover:bg-gray-50">
              <Package className="h-6 w-6" />
              <span>Nuevo Envío</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2 hover:bg-gray-50">
              <FileText className="h-6 w-6" />
              <span>Generar Reporte</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-gray-600" />
              Actividad Reciente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  action: "Documento BL subido",
                  client: "ACME Corp",
                  shipment: "SHP-2024-001",
                  time: "Hace 15 min",
                  status: "success"
                },
                {
                  action: "Factura validada",
                  client: "Global Trade Ltd",
                  shipment: "SHP-2024-002",
                  time: "Hace 1 hora",
                  status: "success"
                },
                {
                  action: "Documento rechazado",
                  client: "Import Express",
                  shipment: "SHP-2024-003",
                  time: "Hace 2 horas",
                  status: "error"
                }
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">
                      {activity.client} • {activity.shipment}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={activity.status === 'success' ? 'default' : 'destructive'}>
                      {activity.status === 'success' ? 'Éxito' : 'Error'}
                    </Badge>
                    <span className="text-xs text-gray-400">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Alertas y Notificaciones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  type: "urgent",
                  message: "3 documentos requieren validación urgente",
                  shipment: "SHP-2024-005",
                  icon: AlertTriangle
                },
                {
                  type: "warning",
                  message: "BL próximo a vencer (2 días)",
                  shipment: "SHP-2024-008",
                  icon: Clock
                },
                {
                  type: "info",
                  message: "Cliente solicitó acceso a documentos",
                  shipment: "SHP-2024-012",
                  icon: Eye
                }
              ].map((alert, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <alert.icon className={`h-5 w-5 ${
                    alert.type === 'urgent' ? 'text-red-500' : 
                    alert.type === 'warning' ? 'text-yellow-500' : 
                    'text-blue-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                    <p className="text-xs text-gray-500">{alert.shipment}</p>
                  </div>
                  <Button size="sm" variant="outline">
                    Ver
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
