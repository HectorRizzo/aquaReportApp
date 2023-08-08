import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab1',
  templateUrl: './tab1.page.html',
  styleUrls: ['./tab1.page.scss'],
})
export class Tab1Page implements OnInit {

  reportesPE: any[] = [];
  reportesFI: any[] = [];
  dataUser: any;

  constructor(
    private http: HttpClient,
    private route: Router) {}

  ngOnInit(): void {
    this.dataUser = JSON.parse(sessionStorage.getItem('dataUser'));
    this.fetchReportesPE();
    this.fetchReportesFI();
  }

  fetchReportesPE(): void {
    this.http.get(`http://localhost:3000/getLecturaPorIdUsuarioP/${this.dataUser.id}`).subscribe(
      (data: any) => {
        this.reportesPE = data.data; 
      },
      (error) => {
        console.error('Ha ocurrido un error al obtener los datos', error);
      }
    );
  }

  adjustDate(fecha: string): string {
    // Se creará un objeto Date interpretando la fecha como UTC.
    const dateObject = new Date(fecha);
  
    if (isNaN(dateObject.getTime())) {
      return fecha;  // Si el objeto de fecha es inválido, simplemente devuelve la fecha original.
    }
    
    // Devuelve la fecha en formato YYYY-MM-DD sin ajustes de zona horaria.
    return `${dateObject.getUTCFullYear()}-${('0' + (dateObject.getUTCMonth() + 1)).slice(-2)}-${('0' + dateObject.getUTCDate()).slice(-2)}`;
  }  
 

  fetchReportesFI(): void {
    this.http.get(`http://localhost:3000/getLecturaPorIdUsuarioF/${this.dataUser.id}`).subscribe(
      (data: any) => {
        this.reportesFI = data.data;
      },
      (error) => {
        console.error('Ha ocurrido un error al obtener los datos', error);
      }
    );
  }

  onIconClick(reporte: any): void {
    this.route.navigate(['/tabs-lectura/tab1/tomar-lectura', reporte.id_lectura]);
  }

}
