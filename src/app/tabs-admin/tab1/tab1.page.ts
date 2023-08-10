import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { GeneralService } from 'src/app/services/general.service';
import { GlobalService } from 'src/app/services/global.service';
import { Map,tileLayer,marker } from 'leaflet';
import { AlertController } from '@ionic/angular';
import * as L from 'leaflet';
import { Renderer2 } from '@angular/core';

@Component({
  selector: 'app-tab1',
  templateUrl: './tab1.page.html',
  styleUrls: ['./tab1.page.scss'],
})
export class Tab1Page implements OnInit {

  segment = 'emitidos';
  today: any;
  firstday: any;
  lastday: any;

  filter: any;

  reportesEM: any = [];
  reportesPR: any = [];
  prioridadList: any = [];

  reporte: any = {
    fecha: moment(new Date()).format('YYYY-MM-DD'),
    hora: moment(new Date()).format('HH:mm:ss'),
    latitud: '',
    longitud: '',
    descripcion: '',
    imagen: '',
  };

  map: Map;
  newMarker: any;
  address: string[];

  maps: any[] = [];

  loading = true;

  constructor(
    private route: Router,
    private apiSrv: AdminService,
    private commonSrv: GeneralService,
    private alertController: AlertController,
    private global: GlobalService,
    private renderer: Renderer2
    ) {
      this.global.getObservable().subscribe(
        (data)=>{
          if(data){
            this.ngOnInit();
          }
        }
      );
    }

  ngOnInit() {

    this.today = new Date();
    this.firstday = new Date(this.today.getFullYear(),this.today.getMonth(), 1);
    this.lastday = new Date(this.today.getFullYear(),this.today.getMonth() + 1, 0);

    this.filter = {
      // fecha_desde: moment(this.firstday).format('YYYY-MM-DD'),
      // fecha_hasta: moment(this.lastday).format('YYYY-MM-DD')
      filterControl: '',
    };

    this.getCatalogos();
  }

  loadMap(r, i) {
    const map = L.map('map' + i).setView([r.latitud, r.longitud], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
    }).addTo(map);

    L.marker([r.latitud, r.longitud]).addTo(map)
      .bindPopup('Ubicación del reporte')
      .openPopup();

    this.maps.push(map);
}

  getCatalogos() {
    this.loading = true;
    const data = {
      // eslint-disable-next-line @typescript-eslint/quotes
      params: "'PRIORIDAD'",
    };

    this.commonSrv.getCatalogos(data).subscribe(
      (res: any) => {
        this.prioridadList = [];
        this.prioridadList = res.data.PRIORIDAD;
        this.getReportesEM();
      },
      (err) => {
        this.commonSrv.errorToast('Error al cargar catalogos');
        this.loading = false;
      }
    );
  }

  getReportesEM() {

    const data = {
      params: {
        filter: this.filter
      },
      fase: 'EM'
    };

    this.apiSrv.getReportesFiltro(data).subscribe(
      (res: any) => {
        this.reportesEM = [];
        res.data.forEach(e => {
          console.log(e);
          Object.assign(e, {
            expand: false,
            fechahora: ''+e.fecha+' '+e.hora
          });
          this.reportesEM.push(e);
        });
        this.getReportesPR();
      },
      (err) => {
        this.commonSrv.errorToast('Error al cargar reportes');
        this.loading = false;
      }
    );
  }

  getReportesPR() {

    const data = {
      params: {
        filter: this.filter
      },
      fase: 'PR'
    };

    this.apiSrv.getReportesFiltro(data).subscribe(
      (res: any) => {
        this.reportesPR = [];
        res.data.forEach(e => {
          Object.assign(e, {
            expand: false,
            fechahora: ''+e.fecha+' '+e.hora
          });
          this.reportesPR.push(e);
        });
        this.loading = false;
      },
      (err) => {
        this.commonSrv.errorToast('Error al cargar reportes');
        this.loading = false;
      }
    );
  }

  expand(item: any){
    item.expand = !item.expand;
    if (item.expand) {
      if (item.fase === 'EM') {
      setTimeout(() => {
          this.loadMap(item, this.reportesEM.indexOf(item));
      }, 0);
    } else {
      setTimeout(() => {
        this.loadMap(item, this.reportesPR.indexOf(item));
    }, 0);
    }
  }
  }

  goAsignarReporte(reporte: any) {
    this.route.navigate(['/tabs-admin/tab1/asignar-reporte',reporte.id_reporte]);
  }

  async presentAlert(r) {
    const alert = await this.alertController.create({
      header: 'Reporte ',
      subHeader: 'Fecha: '+moment(r.fechahora_asignacion).format('YYYY-MM-DD HH:mm:ss')+'\nDescripcion: '+r.descripcion,
      message: '¿Está seguro que desea eliminar este reporte?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Alert canceled');
          },
        },
        {
          text: 'Aceptar',
          role: 'confirm',
          handler: () => {
            this.eliminarReporte(r);
          },
        },
      ],
    });

    await alert.present();

  }

  eliminarReporte(r) {
    const id = r.id_reporte;

    this.loading = true;
    this.apiSrv.eliminarReporte(id).subscribe(
      (res) => {
        this.commonSrv.successToast('Reporte eliminado exitosamente!');
        this.getReportesEM();
      },(err) => {
        this.commonSrv.errorToast('No fue posible eliminar el reporte');
        this.loading = false;
      }
    );
  }

}
