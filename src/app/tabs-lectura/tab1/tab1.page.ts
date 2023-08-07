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

  constructor(
    private http: HttpClient,
    private route: Router) {}

  ngOnInit(): void {
    this.fetchReportesPE();
    this.fetchReportesFI();
  }

  fetchReportesPE(): void {
    this.http.get('http://localhost:3000/getLecturasPendientes').subscribe(
      (data: any) => {
        this.reportesPE = data.data; 
      },
      (error) => {
        console.error('Ha ocurrido un error al obtener los datos', error);
      }
    );
  }

  fetchReportesFI(): void {
    this.http.get('http://localhost:3000/getLecturasFinalizadas').subscribe(
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
