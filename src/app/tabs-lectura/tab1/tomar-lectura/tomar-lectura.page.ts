import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Map, tileLayer, marker } from 'leaflet';
import { GeneralService } from 'src/app/services/general.service';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-tomar-lectura',
  templateUrl: './tomar-lectura.page.html',
  styleUrls: ['./tomar-lectura.page.scss'],
})
export class TomarLecturaPage implements OnInit {

  reporte: any;  
  map: Map;
  isLoading: boolean = true;  


  constructor(
    private activatedRoute: ActivatedRoute,
    private http: HttpClient,
    private commonSrv: GeneralService,
    private route: Router,
    private global: GlobalService
  ) { }

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.fetchLecturaById(id);
  }

  loadMap(){
    const map = new Map('map').setView([this.reporte.latitud, this.reporte.longitud], 17);

    tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
      // eslint-disable-next-line max-len
      attribution: '© <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
    }).addTo(map); // This line is added to add the Tile Layer to our map

    marker([this.reporte.latitud, this.reporte.longitud]).addTo(map)
    .bindPopup('Medidor');
    setTimeout(() => {
      map.invalidateSize();
  }, 0);
  }

  fetchLecturaById(id: string): void {
    this.http.get<any>(`http://localhost:3000/getLecturaPorId/${id}`).subscribe(
      data => {
        this.reporte = data.data;  
        this.isLoading = false;  
        //console.log(this.reporte);
        setTimeout(() => {
          this.loadMap();
        });
      },
      err => {
        //console.error('Hubo un error al obtener el reporte:', err);
        this.isLoading = false;
      }
    );
  }

  guardarLectura(valor: string): void {
    if(valor != ''){
      console.log(this.reporte.id_lectura);
      if (this.reporte.repeticion == 0 || this.reporte.repeticion == null){
        this.http.put<any>(`http://localhost:3000/tomarLectura/${this.reporte.id_lectura}`, {lectura: valor}).subscribe(
          data => {
            console.log('Se guardo la lectura PUT');
            this.commonSrv.successToast('Información guardada con éxito!');
            this.global.refreshData(true);
            this.route.navigate(['/tabs-lectura/tab1']);
          },
          err => {
            console.error('Hubo un error al guardar la lectura PUT:', err);
            this.commonSrv.errorToast('Error al guardar la lectura.');
          }
        );
        this.http.post<any>(`http://localhost:3000/agregarLecturaHistorica`, {medidor: this.reporte.id_medidor, lectura: valor}).subscribe(
          data => {
            console.log('Se guardo la lectura POST');
          },
          err => {
            console.error('Hubo un error al guardar la lectura: POST', err);
          }
        );
      }else{
        this.http.put<any>(`http://localhost:3000/tomarLecturaRepeticion/${this.reporte.id_lectura}`, {lectura: valor, repeticion: this.reporte.repeticion}).subscribe(
          data => {
            console.log('Se guardo la lectura PUT');
            this.commonSrv.successToast('Información guardada con éxito!');
            this.global.refreshData(true);
            this.route.navigate(['/tabs-lectura/tab1']);
          },
          err => {
            console.error('Hubo un error al guardar la lectura PUT:', err);
            this.commonSrv.errorToast('Error al guardar la lectura.');
          }
        );
        this.http.post<any>(`http://localhost:3000/agregarLecturaHistorica`, {medidor: this.reporte.id_medidor, lectura: valor}).subscribe(
          data => {
            console.log('Se guardo la lectura POST');
          },
          err => {
            console.error('Hubo un error al guardar la lectura POST:', err);
          }
        );
      }
    }else{
      this.commonSrv.errorToast('Error al guardar la lectura, verifique que el campo no este vacio y que sea un número.');
    } 
  }
}

