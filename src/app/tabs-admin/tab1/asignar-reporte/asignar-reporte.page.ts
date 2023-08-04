import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { ToastController } from '@ionic/angular';
import { AdminService } from 'src/app/services/admin.service';
import { GeneralService } from 'src/app/services/general.service';
import { GlobalService } from 'src/app/services/global.service';
import { Map,tileLayer,marker } from 'leaflet';

@Component({
  selector: 'app-asignar-reporte',
  templateUrl: './asignar-reporte.page.html',
  styleUrls: ['./asignar-reporte.page.scss'],
})
export class AsignarReportePage implements OnInit {

  dataUser: any;
  prioridadList: any = [];
  personalList: any = [];

  reporte: any = {
    id_reporte: 0,
    fecha: moment(new Date()).format('YYYY-MM-DD'),
    hora: moment(new Date()).format('HH:mm:ss'),
    latitud: '',
    longitud: '',
    ubicacion: '',
    descripcion: '',
    imagen: '',
  };

  new_reporte: any = {
    id_reporte: 0, // Se cambia mas adelante
    fecha_asignacion: moment(new Date()).format('YYYY-MM-DD'),
    hora_asignacion: moment(new Date()).format('HH:mm:ss'),
    comentario_admin: '',
    prioridad: 0, // Se escoge de catalogos
    id_usuario_asigno: 0, // Por ahora va fijo al admin
    id_usuario_asignado: 0, // Se escoge de usuarios de mantenimiento
    fase: 'AS',
  };

  map: Map;

  loading = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private apiSrv: AdminService,
    private toastSrv: ToastController,
    private route: Router,
    private commonSrv: GeneralService,
    private global: GlobalService,
    ) { }

  ngOnInit() {

    this.dataUser = JSON.parse(sessionStorage.getItem('dataUser'));
    this.new_reporte.id_reporte = this.activatedRoute.snapshot.paramMap.get('reporte_id');
    if(this.new_reporte.id_reporte>0){
      this.getReporteById();
    }

  }

  loadMap(){
    const map = new Map('map').setView([this.reporte.latitud, this.reporte.longitud], 17);

    tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
      // eslint-disable-next-line max-len
      attribution: '© <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
    }).addTo(map); // This line is added to add the Tile Layer to our map

    marker([this.reporte.latitud, this.reporte.longitud]).addTo(map)
    .bindPopup('Fuga de agua.');
  }

  getReporteById() {
    this.loading = true;
    const id = this.new_reporte.id_reporte;
    this.commonSrv.getReporteBy(id).subscribe(
      (res: any) => {
        this.reporte = res.data;
        this.reporte.fechahora = ''+res.data.fecha+' '+res.data.hora;
        this.loadMap();
        this.getCatalogos();
      },
      (err) => {
        this.commonSrv.errorToast('Error al obtener el reporte');
        this.loading = false;
      }
    );
  }

  getCatalogos() {
    const data = {
      params: '\'PRIORIDAD\'',
    };

    this.commonSrv.getCatalogos(data).subscribe(
      (res: any) => {
        this.prioridadList = [];
        this.prioridadList = res.data.PRIORIDAD;
        this.getPersonal();
      },
      (err) => {
        this.commonSrv.errorToast('Error al cargar catalogos');
        this.loading = false;
      }
    );
  }

  getPersonal() {

    const data = {
      tipo: 'PERSONAL',
    };

    this.commonSrv.getUsersBy(data).subscribe(
      (res: any) => {
        this.personalList = [];
        this.personalList = res.data;
        this.loading = false;
      },
      (err) => {
        this.commonSrv.errorToast('Error al obtener los personales');
        this.loading = false;
      }
    );

  }

  asignarReporte() {

    if(
      this.new_reporte.prioridad==0 || this.new_reporte.prioridad==undefined
    ){
      this.commonSrv.warningToast('Debe seleccionar una Prioridad');
      return ;
    } else if(
      this.new_reporte.id_usuario_asignado==0 || this.new_reporte.id_usuario_asignado==undefined
    ){
      this.commonSrv.warningToast('Debe asignar un personal de mantenimiento');
      return ;
    }

    this.new_reporte.id_usuario_asigno = this.dataUser.id;

    const data = {
      reporte: this.new_reporte
    };

    this.apiSrv.asignarReporte(data).subscribe(
      (res: any) => {
        console.log(res);
        this.global.refreshData(true);
        this.commonSrv.successToast('Reporte asignado éxitosamente!');
        this.route.navigate(['/tabs-admin/tab1']);
      },
      (err) => {
        this.commonSrv.errorToast(err);
      }
    );
  }

}
