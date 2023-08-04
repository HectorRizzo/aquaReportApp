import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { ApiServices } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

    constructor(
        private api: ApiServices,
        private toastSrv: ToastController,
        ) { }

    getReportesAll() {
        return this.api.apiCall('general/get-reportes', 'POST', {});
    }

    getReporteBy(id: any) {
        return this.api.apiCall('general/get-reporte-by/'+id, 'POST', {});
    }

    getUsersBy(data: any) {
        return this.api.apiCall('general/get-users-by-tipo', 'POST', data);
    }

    getUserBy(id: any) {
        return this.api.apiCall('general/get-user-by-id/'+id, 'POST', {});
    }

    getTiposUsuario() {
        return this.api.apiCall('general/get-tipos-usuario', 'POST', {});
    }

    getCatalogos(data: any) {
        return this.api.apiCall('general/get-catalogos-by-tipo', 'POST', data);
    }

    infoToast(msg: string, title?: string){
        this.presentToast(msg, 'information', 'secondary', title);
    }

    successToast(msg: string, title?: string){
        this.presentToast(msg, 'checkmark', 'success', title);
    }

    warningToast(msg: string, title?: string){
        this.presentToast(msg, 'warning', 'warning', title);
    }

    errorToast(msg: string, title?: string){
        this.presentToast(msg, 'close', 'danger', title);
    }

    async presentToast(msg: string, icon: string, color: string, title?: string) {
        const toast = await this.toastSrv.create({
        header: title ?? '',
        message: msg,
        duration: 2000,
        color,
        icon
        });

        await toast.present();
    }

}
