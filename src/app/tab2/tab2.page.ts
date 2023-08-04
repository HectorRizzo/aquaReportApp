import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../services/usuario.service';
import * as moment from 'moment';
import { GlobalService } from '../services/global.service';
import { GeneralService } from '../services/general.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit{

  dataUser: any;
  today: any;
  firstday: any;
  lastday: any;

  filter: any;

  reportes: any = [];

  loading = true;

  constructor(
    private apiSrv: UsuarioService,
    private global: GlobalService,
    private commonSrv: GeneralService,
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

    this.dataUser = JSON.parse(sessionStorage.getItem('dataUser'));
    this.today = new Date();
    this.firstday = new Date(this.today.getFullYear(),this.today.getMonth(), 1);
    this.lastday = new Date(this.today.getFullYear(),this.today.getMonth() + 1, 0);

    this.filter = {
      fecha_desde: moment(this.firstday).format('YYYY-MM-DD'),
      fecha_hasta: moment(this.lastday).format('YYYY-MM-DD')
    };

    this.getReportes();
  }

  getReportes() {

    this.loading = true;
    const data = {
      params: {
        filter: this.filter
      },
      id_usuario_reporto: this.dataUser.id
    };

    this.apiSrv.getReportesFiltro(data).subscribe(
      (res: any) => {
        this.reportes = [];
        res.data.forEach(e => {
          Object.assign(e, {
            fechahora: ''+e.fecha+' '+e.hora
          });
          this.reportes.push(e);
        });
        this.loading = false;
      },
      (err) => {
        this.commonSrv.errorToast('Error al cargar reportes');
        this.loading = false;
      }
    );
  }

}
