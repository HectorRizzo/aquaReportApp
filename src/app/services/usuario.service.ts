import { Injectable } from '@angular/core';
import { ApiServices } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

    constructor(private api: ApiServices) { }

    getReportesAll() {
        return this.api.apiCall('usuario/get-reportes', 'POST', {});
    }

    getReportesFiltro(data: any) {
        return this.api.apiCall('usuario/get-reportes-filtro', 'POST', data);
    }

    enviarReporte(data: any) {
        return this.api.apiCall('usuario/enviar-reporte', 'POST', data);
    }

}
