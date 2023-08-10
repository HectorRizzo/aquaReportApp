import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import * as moment from 'moment';
import { GeneralService } from 'src/app/services/general.service';
import { GlobalService } from 'src/app/services/global.service';
import { PersonalService } from 'src/app/services/personal.service';
import * as L from 'leaflet';
import { Renderer2 } from '@angular/core';

@Component({
  selector: 'app-tab1',
  templateUrl: './tab1.page.html',
  styleUrls: ['./tab1.page.scss'],
})
export class Tab1Page implements OnInit {

  dataUser: any;
  segment = 'asignados';
  today: any;
  firstday: any;
  lastday: any;

  filter: any;

  reportesAS: any = [];
  reportesEC: any = [];
  prioridadList: any = [];

  maps: any[] = [];


  loading = true;

  constructor(
    private route: Router,
    private apiSrv: PersonalService,
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
    this.dataUser = JSON.parse(sessionStorage.getItem('dataUser'));
    this.today = new Date();
    this.firstday = new Date(this.today.getFullYear(),this.today.getMonth(), 1);
    this.lastday = new Date(this.today.getFullYear(),this.today.getMonth() + 1, 0);

    this.filter = {
      // fecha_desde: moment(this.firstday).format('YYYY-MM-DD'),
      // fecha_hasta: moment(this.lastday).format('YYYY-MM-DD')
      filterControl: ''
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
        this.getReportesAS();
      },
      (err) => {
        this.commonSrv.errorToast('Error al cargar catalogos');
        this.loading = false;
      }
    );
  }

  getReportesAS() {

    const data = {
      params: {
        filter: this.filter
      },
      fase: 'AS',
      id_usuario_asignado: this.dataUser.id,
    };

    this.apiSrv.getReportesFiltro(data).subscribe(
      (res: any) => {
        this.reportesAS = [];
        res.data.forEach(e => {
          Object.assign(e, {
            expand: false,
            fechahora_asignacion: ''+e.fecha_asignacion+' '+e.hora_asignacion
          });
          this.reportesAS.push(e);

        });
        console.log(this.reportesAS);
        this.getReportesEC();
      },
      (err) => {
        this.commonSrv.errorToast('Error al cargar reportes');
        this.loading = false;
      }
    );
  }

  getReportesEC() {

    const data = {
      params: {
        filter: this.filter
      },
      fase: 'EC',
      id_usuario_asignado: this.dataUser.id,
    };

    this.apiSrv.getReportesFiltro(data).subscribe(
      (res: any) => {
        this.reportesEC = [];
        res.data.forEach(e => {
          Object.assign(e, {
            expand: false,
            fechahora_asignacion: ''+e.fecha_asignacion+' '+e.hora_asignacion
          });
          this.reportesEC.push(e);
        });
        this.loading = false;
        console.log(this.reportesEC);
      },
      (err) => {
        this.commonSrv.errorToast('Error al cargar reportes');
        this.loading = false;
      }
    );
  }

  expand(item){
    item.expand = !item.expand;
    if (item.expand) {
      if (item.fase === 'AS') {
      setTimeout(() => {
          this.loadMap(item, this.reportesAS.indexOf(item));
      }, 0);
    } else {
      setTimeout(() => {
        this.loadMap(item, this.reportesEC.indexOf(item));
    }, 0);
    }
  }
  }

  async presentAlert(r) {
    const alert = await this.alertController.create({
      header: 'Reporte ',
      subHeader: 'Fecha: '+moment(r.fechahora_asignacion).format('YYYY-MM-DD HH:mm:ss')+'\nDescripcion: '+r.descripcion,
      message: '¿Está seguro que desea aceptar este reporte?',
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
            console.log(r);
            this.aceptarReporte(r);
          },
        },
      ],
    });

    await alert.present();

  }

  aceptarReporte(r) {
    const data = {
      reporte: {
        id_reporte: r.id_reporte,
        fase: 'EC'
      }
    };

    this.apiSrv.fasearReporte(data).subscribe(
      (res: any) => {
        this.commonSrv.successToast('Reporte en curso!');
        this.getReportesAS();
      },
      (err) => {
        this.commonSrv.errorToast('No fue posible iniciar el reporte como en curso');
        this.loading = false;
      }
    );
  }

  goAceptarReporte(reporte: any) {
    this.route.navigate(['/tabs-personal/tab1/aceptar-reporte',reporte.id_reporte]);
  }

  goCerrarReporte(reporte: any) {
    this.route.navigate(['/tabs-personal/tab1/cerrar-reporte',reporte.id_reporte]);
  }
}
