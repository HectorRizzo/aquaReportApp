import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-tab2',
  templateUrl: './tab2.page.html',
  styleUrls: ['./tab2.page.scss'],
})
export class Tab2Page implements OnInit {

  filter: any;
  firstday: any;
  lastday: any;
  today: any;
  reportes: any[] = [];
  dataUser: any;
  options: any [] = [];
  selectedOption: any;

  constructor(
    private http: HttpClient,
  ) { }

  ngOnInit() {
    this.dataUser = JSON.parse(sessionStorage.getItem('dataUser'));
    this.today = new Date();
    this.firstday = new Date(this.today.getFullYear(),this.today.getMonth(), 1);
    this.lastday = new Date(this.today.getFullYear(),this.today.getMonth() + 1, 0);

    this.filter = {
      fecha_desde: moment(this.firstday).format('YYYY-MM-DD'),
      fecha_hasta: moment(this.lastday).format('YYYY-MM-DD')
    };

    this.getOptions();
  }

  getOptions(): void {
    this.http.get(`http://localhost:3000/getMedidores`).subscribe(
      (data: any) => {
        this.options = data.data;
      },
      (error) => {
        console.error('Ha ocurrido un error al obtener los datos', error);
      }
    );
  }

  getReportesFI(): void {
    console.log('Botón presionado');
    console.log(this.filter);
    console.log(this.selectedOption);
    this.http.post(`http://localhost:3000/getLecturasHistoricasPorMedidor`, {id: this.selectedOption, fechaInicio: this.filter.fecha_desde, fechaFin: this.filter.fecha_hasta}).subscribe(
      (data: any) => {
        this.reportes = data.data;
      },
      (error) => {
        console.error('Ha ocurrido un error al obtener los datos', error);
      }
    );
  }

  getSelectedMedidorName(): string {
    const medidor = this.options.find(option => option.id_medidor === this.selectedOption);
    return medidor ? medidor.nombre : 'Medidor no seleccionado';
  }
  

}
