import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-tomar-lectura',
  templateUrl: './tomar-lectura.page.html',
  styleUrls: ['./tomar-lectura.page.scss'],
})
export class TomarLecturaPage implements OnInit {

  reporte: any;  
  isLoading: boolean = true;  

  constructor(
    private activatedRoute: ActivatedRoute,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.fetchLecturaById(id);
  }

  fetchLecturaById(id: string): void {
    this.http.get<any>(`http://localhost:3000/getLecturaPorId/${id}`).subscribe(
      data => {
        this.reporte = data.data;  
        this.isLoading = false;  
      },
      err => {
        console.error('Hubo un error al obtener el reporte:', err);
        this.isLoading = false;
      }
    );
  }

  guardarLectura(valor: string): void {
    if(valor != ''){
      console.log(this.reporte.id_lectura);
      this.http.put<any>(`http://localhost:3000/tomarLectura/${this.reporte.id_lectura}`, {lectura: valor}).subscribe(
        data => {
          console.log('Se guardo la lectura');
        },
        err => {
          console.error('Hubo un error al guardar la lectura:', err);
        }
      );
      this.http.post<any>(`http://localhost:3000/agregarLecturaHistorica`, {id_lectura_historica: 61, medidor: this.reporte.id_medidor, lectura: valor}).subscribe(
        data => {
          console.log('Se guardo la lectura');
        },
        err => {
          console.error('Hubo un error al guardar la lectura:', err);
        }
      );

    }else{
      console.log('No se guardo la lectura');
    } 
  }
}

