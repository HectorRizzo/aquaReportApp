import { Injectable } from '@angular/core';
import { ApiServices } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

    constructor(private api: ApiServices) { }

    getReportesAll() {
        return this.api.apiCall('admin/get-reportes', 'POST', {});
    }

    getReportesFiltro(data: any) {
        return this.api.apiCall('admin/get-reportes-filtro', 'POST', data);
    }

    asignarReporte(data: any) {
        return this.api.apiCall('admin/asignar-reporte', 'POST', data);
    }

    getUsuarios(data: any) {
        return this.api.apiCall('admin/get-all-users', 'POST', data);
    }

    eliminarReporte(id: any) {
        return this.api.apiCall('admin/eliminar-reporte/'+id, 'POST', {});
    }
}
