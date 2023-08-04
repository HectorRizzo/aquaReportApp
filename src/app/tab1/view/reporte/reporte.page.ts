import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import * as moment from 'moment';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ToastController } from '@ionic/angular';
import { GeneralService } from 'src/app/services/general.service';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@awesome-cordova-plugins/native-geocoder/ngx';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.page.html',
  styleUrls: ['./reporte.page.scss'],
})
export class ReportePage implements OnInit {

  dataUser: any;
  reporte: any = {
    fecha: moment(new Date()).format('YYYY-MM-DD'),
    hora: moment(new Date()).format('HH:mm:ss'),
    latitud: '',
    longitud: '',
    descripcion: '',
    imagen: '',
    ubicacion: '',
    id_usuario_reporto: 0,
  };

  loading = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,
    private apiSrv: UsuarioService,
    private toastSrv: ToastController,
    private route: Router,
    private commonSrv: GeneralService,
    private global: GlobalService,
  ) { }

  ngOnInit() {

    this.dataUser = JSON.parse(sessionStorage.getItem('dataUser'));
    this.reporte.imagen = this.activatedRoute.snapshot.paramMap.get('imagen');
    console.log(this.reporte.imagen);
    this.locate();
  }

  async locate() {
    const ubi = await this.geolocation.getCurrentPosition();
    this.reporte.latitud = ubi.coords.latitude;
    this.reporte.longitud = ubi.coords.longitude;
    // this.reporte.latitud, this.reporte.longitud
    // -2.144970307782228, -79.96587743537143 FIMCP
    // -2.1447102773269435, -79.9676557066737 FIEC
    this.nativeGeocoder.reverseGeocode(this.reporte.latitud, this.reporte.longitud, { useLocale: true, maxResults: 1 }).then(
      (res: any) => {
        const direccion = res[0];
        if(direccion.locality=='Milagro'){
          // pruebas en milagro
          this.reporte.ubicacion = direccion.thoroughfare + ', ' + direccion.locality;
        }else{
          // en otro caso se usa areas de interes para sacar x ej. facultades de espol
          this.reporte.ubicacion = direccion.areasOfInterest[0];
        }
      }
    );
    // this.nativeGeocoder.reverseGeocode(-2.144970307782228, -79.96587743537143, { useLocale: true, maxResults: 1 }).then(
    //   (res: any) => {
    //     console.log(res[0]);
    //     this.reporte.ubicacion = res[0].locality;
    //     console.log(this.reporte);
    //   }
    // );
    // this.nativeGeocoder.reverseGeocode(-2.1447102773269435, -79.9676557066737, { useLocale: true, maxResults: 1 }).then(
    //   (res: any) => {
    //     console.log(res[0]);
    //     this.reporte.ubicacion = res[0].locality;
    //     console.log(this.reporte);
    //   }
    // );
  }



  subirReporte() {

    if(this.reporte.descripcion=='' || this.reporte.descripcion==undefined){
      this.commonSrv.warningToast('Debe ingresar una descripción');
      return ;
    }

    this.reporte.id_usuario_reporto = this.dataUser.id;
    console.log(this.reporte);
    const data = {
      reporte: this.reporte
    };

    this.loading = true;
    this.apiSrv.enviarReporte(data).subscribe(
      (res: any) => {
        console.log(res);
        this.commonSrv.successToast('Reporte subido éxitosamente!');
        this.global.refreshData(true);
        this.loading = false;
        this.route.navigate(['/tabs/tab1']);
      },
      (err) => {
        this.commonSrv.errorToast(err);
        console.log(err);
        this.loading = false;
      }
    );
  }

}
