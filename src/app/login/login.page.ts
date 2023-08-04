import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiServices } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { GeneralService } from '../services/general.service';
import { GlobalService } from '../services/global.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  user = {
    email: '',
    password: '',
  };
  show = false;
  loading = false;

  constructor(private route: Router,
    private auth: AuthService,
    private commonSrv: GeneralService,
    private api: ApiServices,
    private global: GlobalService
    ) { }

  ngOnInit() {
  }

  login() {

    if(
      this.user.email=='' || this.user.email==undefined
    ){
      this.commonSrv.warningToast('El campo Correo es obligatorio');
      return ;
    }else if (
      this.user.password=='' || this.user.password==undefined
    ){
      this.commonSrv.warningToast('El campo Contraseña es obligatorio');
      return ;
    }

    const data = {
      email: this.user.email,
      password: this.user.password,
    };

    this.loading = true;

    this.auth.login(data).subscribe(
      (res: any) => {
        this.api.setToken(res.token);
        this.getUser();
      },
      (err) => {
        if(err.error.error){
          this.commonSrv.errorToast(err.error.error);
        }else{
          this.commonSrv.errorToast('Error al iniciar sesion, intente de nuevo mas tarde');
        }
        this.loading = false;
      }
    );
  }

  getUser() {
    this.auth.getLogUser().subscribe(
      (res: any) => {
        sessionStorage.setItem('dataUser', JSON.stringify(res.user));
        this.global.refreshData(true);
        this.loading = false;
        if(res.status){
          this.commonSrv.errorToast(res.status);
          return;
        }
        const tipo = res.user.id_tipo_usuario;
        if(tipo==1){
          sessionStorage.setItem('userGuard', 'espol');
          this.route.navigate(['/tabs']);
        }else if(tipo==2){
          sessionStorage.setItem('userGuard', 'personal');
          this.route.navigate(['/tabs-personal']);
        }else if(tipo==3){
          sessionStorage.setItem('userGuard', 'admin');
          this.route.navigate(['/tabs-admin']);
        }else{
          this.commonSrv.errorToast('Error en el sistema, intente de nuevo más tarde');
          return;
        }
      },
      (err) => {
        this.commonSrv.errorToast('Error al iniciar sesion, intente de nuevo mas tarde');
        this.loading = false;
      }
    );
  }
  showPassword() {
    this.show = !this.show;
  }

}
