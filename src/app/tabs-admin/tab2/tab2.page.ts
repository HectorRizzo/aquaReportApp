import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { GeneralService } from 'src/app/services/general.service';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-tab2',
  templateUrl: './tab2.page.html',
  styleUrls: ['./tab2.page.scss'],
})
export class Tab2Page implements OnInit {

  userList = [];

  loading = true;

  constructor(
    private apiSrv: AdminService,
    private route: Router,
    private commonSrv: GeneralService,
    private global: GlobalService,
    ) {
      this.global.getObservable().subscribe(
        (data)=>{
          if(data){
            this.ngOnInit();
          }
        }
      );
    }

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.loading = true;
    const data = {
      tipo: 'ADMIN', // tipo del que no va a ser obtenido
    };

    this.apiSrv.getUsuarios(data).subscribe(
      (res: any) => {
        this.userList = [];
        this.userList = res.data;
        this.loading = false;
      },
      (err) => {
        this.commonSrv.errorToast('Error al cargar los usuarios');
        this.loading = false;
      }
    );
  }

  goEditarUsuario(usuario: any) {
    this.route.navigate(['/tabs-admin/tab2/editar-usuario',usuario.id]);
  }

  goCrearUsuario() {
    this.route.navigate(['/tabs-admin/tab2/editar-usuario',0]);
  }

}
