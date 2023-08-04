import { Injectable } from '@angular/core';
import { ApiServices } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class PersonalService {

    constructor(private api: ApiServices) { }

    getReportesAll() {
        return this.api.apiCall('personal/get-reportes', 'POST', {});
    }

    getReportesFiltro(data: any) {
        return this.api.apiCall('personal/get-reportes-filtro', 'POST', data);
    }

    cerrarReporte(data: any) {
        return this.api.apiCall('personal/cerrar-reporte', 'POST', data);
    }

    fasearReporte(data: any) {
        return this.api.apiCall('personal/fasear-reporte', 'POST', data);
    }

}
