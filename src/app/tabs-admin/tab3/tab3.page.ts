import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiServices } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { GeneralService } from 'src/app/services/general.service';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-tab3',
  templateUrl: './tab3.page.html',
  styleUrls: ['./tab3.page.scss'],
})
export class Tab3Page implements OnInit {

  usuario: any = {
    id: 0,
    name: '',
    email: '',
    password: '',
    matricula: '',
    fecha_nacimiento: '',
    facultad: 0
  };
  dataUser: any;

  facultadList: any = [];

  constructor(
    private route: Router,
    private api: ApiServices,
    private commonSrv: GeneralService,
    private auth: AuthService,
    private global: GlobalService
  ) {
    this.global.getObservable().subscribe(
      (data)=>{
        if(data){
          this.ngOnInit();
        }
      }
    );
  }

  ngOnInit(): void {
    this.dataUser = JSON.parse(sessionStorage.getItem('dataUser'));
    this.usuario = this.dataUser;
    this.getCatalogos();
  }

  getCatalogos() {
    const data = {
      params: '\'FACULTAD\''
    };

    this.commonSrv.getCatalogos(data).subscribe(
      (res: any) => {
        this.facultadList = [];
        this.facultadList = res.data.FACULTAD;
      },
      (err) => {
        this.commonSrv.errorToast('Error al cargar catalogos');
      }
    );
  }

  goGraficos() {
    this.route.navigate(['/tabs-admin/tab3/graficos']);
  }

  getPlaceholder(input: string): string {
    const facultad = this.usuario.facultad;
    return facultad;
  }

  logout() {
    this.api.logout();
  }

  guardarInfo() {
    if ( this.usuario.password &&
      (this.usuario.password.length<3)
    ){
      this.commonSrv.warningToast('La contraseña es demasiado corta');
      return ;
    };

    if(!this.usuario.password){
      this.usuario.password = '';
    }

    const data  = {
      usuario: this.usuario
    };

    this.auth.crearUsuario(data).subscribe(
      (res: any) => {
        this.commonSrv.successToast('Información actualizada con éxito!');
        // this.global.refreshData(true);
        this.getUserId();
      },
      (err) => {
        this.commonSrv.errorToast(err);
      }
    );
  }

  getUserId() {
    const id = this.usuario.id;

    this.commonSrv.getUserBy(id).subscribe(
      (res: any) => {
        // sessionStorage.removeItem('dataUser');
        sessionStorage.setItem('dataUser',JSON.stringify(res.data));
        this.dataUser = JSON.parse(sessionStorage.getItem('dataUser'));
      },
      (err) => {
        this.commonSrv.errorToast('Error al obtener el usuario');
      }
    );
  }

}
