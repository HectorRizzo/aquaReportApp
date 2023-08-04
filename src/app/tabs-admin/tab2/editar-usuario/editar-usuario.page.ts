import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AdminService } from 'src/app/services/admin.service';
import { AuthService } from 'src/app/services/auth.service';
import { GeneralService } from 'src/app/services/general.service';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-editar-usuario',
  templateUrl: './editar-usuario.page.html',
  styleUrls: ['./editar-usuario.page.scss'],
})
export class EditarUsuarioPage implements OnInit {

  usuario: any = {
    id: 0,
    correo: '',
    password: '',
    nombre: '',
    apellido: '',
    puntaje: 0,
    id_tipo_usuario: 0,
    estado: 0,
  };

  estadoList: any = [];
  tipoUsuarioList: any = [];

  loading = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private apiSrv: AdminService,
    private toastSrv: ToastController,
    private route: Router,
    private commonSrv: GeneralService,
    private auth: AuthService,
    private global: GlobalService,
  ) { }

  ngOnInit() {

    this.usuario.id = this.activatedRoute.snapshot.paramMap.get('usuario_id');

    if(this.usuario.id>0){
      this.getUsuarioById();
    }else{
      this.getCatalogos();
    }

  }

  getUsuarioById() {
    const id = this.usuario.id;
    this.commonSrv.getUserBy(id).subscribe(
      (res: any) => {
        this.usuario = res.data;
        const nombres = res.data.name.split(' ');
        if(nombres.length==2){
          this.usuario.nombre = nombres[0];
          this.usuario.apellido = nombres[1];
        }else if(nombres.length==3){
          this.usuario.nombre = nombres[0];
          this.usuario.apellido = nombres[1] + ' ' +  nombres[2];
        }else if(nombres.length==4){
          this.usuario.nombre = nombres[0] + ' ' + nombres[1];
          this.usuario.apellido = nombres[2] + ' ' + nombres[3];
        }else {
          this.usuario.nombre = this.usuario.name;
        }
        this.usuario.password = '';
        this.getCatalogos();
      },
      (err) => {
        this.commonSrv.errorToast('Error al obtener el usuario');
      }
    );
  }

  getCatalogos() {
    const data = {
      params: '\'ESTADO\''
    };

    this.commonSrv.getCatalogos(data).subscribe(
      (res: any) => {
        this.estadoList = [];
        this.estadoList = res.data.ESTADO;
        this.getTiposUsuario();
      },
      (err) => {
        this.commonSrv.errorToast('Error al cargar catalogos');
      }
    );
  }

  getTiposUsuario() {

    this.commonSrv.getTiposUsuario().subscribe(
      (res: any) => {
        this.tipoUsuarioList = [];
        this.tipoUsuarioList = res.data;;
      },
      (err) => {
        this.commonSrv.errorToast('Error al cargar roles de usuario');
      }
    );
  }

  guardarData() {

    if(
      this.usuario.email=='' || this.usuario.email==undefined
    ){
      this.commonSrv.warningToast('El campo Correo es obligatorio');
      return ;
    }else if(
      this.usuario.nombre=='' || this.usuario.nombre==undefined
    ){
      this.commonSrv.warningToast('El campo Nombre es obligatorio');
      return ;
    }else if(
      this.usuario.apellido=='' || this.usuario.apellido==undefined
    ){
      this.commonSrv.warningToast('El campo Apellido es obligatorio');
      return ;
    }else if(
      this.usuario.id_tipo_usuario==0 || this.usuario.id_tipo_usuario==undefined
    ){
      this.commonSrv.warningToast('Seleccione un Tipo de Usuario');
      return ;
    }else if(
      this.usuario.estado==0 || this.usuario.estado==undefined
    ){
      this.commonSrv.warningToast('Seleccione un Estado');
      return ;
    // }else if(
    //   this.usuario.password=='' || this.usuario.password==undefined
    // ){
    //   this.commonSrv.warningToast('El campo Contraseña es obligatorio');
    //   return ;
    }

    this.usuario.name = this.usuario.nombre + ' ' + this.usuario.apellido;

    const data  = {
      usuario: this.usuario
    };

    const id = this.usuario.id;

    this.loading = true;
    this.auth.crearUsuario(data).subscribe(
      (res: any) => {
        this.commonSrv.successToast(id==0?'Usuario creado con éxito':'Usuario actualizado con éxito');
        this.global.refreshData(true);
        this.loading = false;
        this.route.navigate(['tabs-admin/tab2']);
      },
      (err) => {
        this.commonSrv.errorToast(err);
        this.loading = false;
      }
    );
  }

  getPlaceholder(input: string): string {
    if(input==='tipo'){
      const tipo = this.usuario.id_tipo_usuario;
      return tipo==1?'USUARIO':tipo==2?'PERSONAL':'ADMIN';
    } else if (input==='estado'){
      const estado = this.usuario.estado;
      return estado=='A'?'ACTIVO':'INACTIVO';
    }
    return '';
  }
}
