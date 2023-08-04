import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { GeneralService } from 'src/app/services/general.service';
import { GlobalService } from 'src/app/services/global.service';
import { PersonalService } from 'src/app/services/personal.service';
import { Map,tileLayer,marker } from 'leaflet';

@Component({
  selector: 'app-aceptar-reporte',
  templateUrl: './aceptar-reporte.page.html',
  styleUrls: ['./aceptar-reporte.page.scss'],
})
export class AceptarReportePage implements OnInit {


  reporte: any = {
    id_reporte: 0,
    fecha_asignacion: moment(new Date()).format('YYYY-MM-DD'),
    hora_asignacion: moment(new Date()).format('HH:mm:ss'),
    latitud: '',
    longitud: '',
    descripcion: '',
    imagen: '',
  };

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
    this.reporte.id_reporte = this.activatedRoute.snapshot.paramMap.get('reporte_id');
    if(this.reporte.id_reporte>0){
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
    const id = this.reporte.id_reporte;
    this.commonSrv.getReporteBy(id).subscribe(
      (res: any) => {
        this.reporte = res.data;
        this.reporte.fechahora_asignacion = ''+res.data.fecha_asignacion+' '+res.data.hora_asignacion;
        this.loadMap();
      },
      (err) => {
        this.commonSrv.errorToast('Error al obtener el reporte');
        this.loading = false;
      }
    );
  }

  aceptarReporte() {
    const data = {
      reporte: {
        id_reporte: this.reporte.id_reporte,
        fase: 'EC'
      }
    };

    this.apiSrv.fasearReporte(data).subscribe(
      (res: any) => {
        this.commonSrv.successToast('Se ha cambiado el estado éxitosamente!');
        this.global.refreshData(true);
        this.route.navigate(['/tabs-personal/tab1']);
      },
      (err) => {
        this.commonSrv.errorToast(err);
      }
    );
  }


}
