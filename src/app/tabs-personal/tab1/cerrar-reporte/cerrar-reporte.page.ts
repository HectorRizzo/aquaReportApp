import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { GeneralService } from 'src/app/services/general.service';
import { PersonalService } from 'src/app/services/personal.service';
import { GlobalService } from 'src/app/services/global.service';
import { Map,tileLayer,marker } from 'leaflet';

@Component({
  selector: 'app-cerrar-reporte',
  templateUrl: './cerrar-reporte.page.html',
  styleUrls: ['./cerrar-reporte.page.scss'],
})
export class CerrarReportePage implements OnInit {

  prioridadList: any = [];
  faseList: any = [];
  personalList: any = [];

  reporte: any = {
    id_reporte: 0,
    fecha: moment(new Date()).format('YYYY-MM-DD'),
    hora: moment(new Date()).format('HH:mm:ss'),
    latitud: '',
    longitud: '',
    descripcion: '',
    imagen: '',
  };

  new_reporte: any = {
    id_reporte: 0, // Se cambia mas adelante
    fecha_finalizo: moment(new Date()).format('YYYY-MM-DD'),
    hora_finalizo: moment(new Date()).format('HH:mm:ss'),
    comentario_mantenimiento: '',
    fase: 0, // empieza en 0 y cambia a FI(finalizado) o PR(con problemas)
  };

  problemas = false;

  map: Map;

  loading = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private apiSrv: PersonalService,
    private route: Router,
    private commonSrv: GeneralService,
    private global: GlobalService
    ) { }

  ngOnInit() {
    console.log(this.reporte);
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
    this.loading = false;
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
      // eslint-disable-next-line @typescript-eslint/quotes
      params: "'PRIORIDAD','FASE'",
    };

    this.commonSrv.getCatalogos(data).subscribe(
      (res: any) => {
        this.prioridadList = [];
        this.faseList = [];
        this.prioridadList = res.data.PRIORIDAD;
        this.faseList = res.data.FASE.filter(e => e.valor==='PR' || e.valor==='FI');
        // this.getPersonal();
      },
      (err) => {
        this.commonSrv.errorToast('Error al cargar catalogos');
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
      },
      (err) => {
        this.commonSrv.errorToast('Error al obtener los personales');
      }
    );

  }

  handleFase(event) {
    const fase = event.detail.value;
    if (fase === 'PR') {
      this.problemas = true;
      this.new_reporte.fecha_finalizo = undefined;
      this.new_reporte.hora_finalizo = undefined;
      this.new_reporte.comentario_mantenimiento = '';
    } else if (fase === 'FI') {
      this.problemas = false;
      this.new_reporte.fecha_finalizo = moment(new Date()).format('YYYY-MM-DD');
      this.new_reporte.hora_finalizo = moment(new Date()).format('HH:mm:ss');
      this.new_reporte.comentario_mantenimiento = undefined;
    }
  }

  cerrarReporte() {

    if(
      this.new_reporte.fase==0 || this.new_reporte.fase==undefined
    ){
      this.commonSrv.warningToast('Debe seleccionar un Estado');
      return ;
    } else if(
      this.new_reporte.fase=='FI' && (this.new_reporte.fecha_finalizo==undefined || this.new_reporte.hora_finalizo==undefined)
    ){
      this.commonSrv.warningToast('Si se marca el reporte como finalizado, debe tener una fecha de finalización');
      return ;
    } else if(
      this.new_reporte.fase=='PR' && (this.new_reporte.comentario_mantenimiento=='' || this.new_reporte.comentario_mantenimiento==undefined)
    ){
      this.commonSrv.warningToast('Si se marca el reporte con problemas, debe ingresar un Comentario detallando el inconveniente');
      return ;
    }

    const fase = this.new_reporte.fase;

    const data = {
      reporte: this.new_reporte
    };

    // return ;
    this.apiSrv.cerrarReporte(data).subscribe(
      (res: any) => {
        this.commonSrv.successToast(fase=='PR'?'Se ha notificado este reporte con problemas...':'Se ha cerrado el reporte éxitosamente!');
        this.global.refreshData(true);
        this.route.navigate(['/tabs-personal/tab1']);
      },
      (err) => {
        this.commonSrv.errorToast(err);
      }
    );
  }

}
