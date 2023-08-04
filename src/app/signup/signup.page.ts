import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiServices } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { GeneralService } from '../services/general.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  show = false;

  user: any = {
    id: 0,
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    id_tipo_usuario: 1,
    estado: 'A',
  };

  loading = false;

  constructor(private auth: AuthService,
    private commonSrv: GeneralService,
    private api: ApiServices,
    private route: Router) { }

  ngOnInit() {
  }

  register() {

    if(
      this.user.nombre=='' || this.user.nombre==undefined
    ){
      this.commonSrv.warningToast('El campo Nombre es obligatorio');
      return ;
    }else if (
      this.user.apellido=='' || this.user.apellido==undefined
    ){
      this.commonSrv.warningToast('El campo Apellido es obligatorio');
      return ;
    }else if (
      this.user.email=='' || this.user.email==undefined
    ){
      this.commonSrv.warningToast('El campo Correo es obligatorio');
      return ;
    }else if (
      this.user.password=='' || this.user.password==undefined
    ){
      this.commonSrv.warningToast('El campo Contraseña es obligatorio');
      return ;
    }else if (
      this.user.password.length<3
    ){
      this.commonSrv.warningToast('La contraseña es demasiado corta');
      return ;
    }else if (
      this.user.password_confirmation!=this.user.password
    ){
      this.commonSrv.warningToast('Las contraseñas no coinciden');
      return ;
    }

    this.user.name = this.user.nombre + ' ' + this.user.apellido;

    const data =  this.user;
    this.loading = true;
    this.auth.register(data).subscribe(
      (res: any) => {
        this.api.setToken(res.token);
        sessionStorage.setItem('dataUser', JSON.stringify(res.user));
        sessionStorage.setItem('userGuard', 'espol');
        this.loading = false;
        this.route.navigate(['/tabs']);
      },
      (err) => {
        console.log(err);
        let msjError = 'Error en el sistema, intente de nuevo mas tarde';
        if(err.error.email[0]=='The email has already been taken.'){
          msjError = 'El correo ingresado esta en uso.';
        }else if(err.error.email[0]=='The email must be a valid email address.') {
          msjError = 'El correo ingresado no es valido.';
        }
        this.commonSrv.errorToast(msjError);
        this.loading = false;
      }
    );
  }
  showPassword() {
    this.show = !this.show;
  }

}
