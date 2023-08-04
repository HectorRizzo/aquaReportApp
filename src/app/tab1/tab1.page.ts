import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { GeneralService } from '../services/general.service';
import { GlobalService } from '../services/global.service';
// import { WebView } from '@ionic-native/ionic-webview/ngx';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  image: string;
  noFoto = true;

  constructor(
    private route: Router,
    private camera: Camera,
    private commonSrv: GeneralService,
    private global: GlobalService
    // private webView: WebView
  ) {
    this.global.getObservable().subscribe(
      (data)=>{
        if(data){
          this.image = undefined;
          this.noFoto = true;
        }
      }
    );
  }

  ngOnInit() {
    this.takePicture();
  }

  takePicture() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.CAMERA,
      correctOrientation: true,
      targetHeight: 800,
      targetWidth: 800,
    };
    this.camera.getPicture(options)
    .then((imageData) => {
      this.image = 'data:image/jpeg;base64,' + imageData;
      this.noFoto = false;
    }, (err) => {
      this.commonSrv.errorToast('No se selecciono una imagen');
      // this.noFoto = true;
    });
  }

  goReporte() {
    this.route.navigate(['/tabs/tab1/reporte',this.image]);
  }

  // this.webView.convertFileSrc(imageData);

}
