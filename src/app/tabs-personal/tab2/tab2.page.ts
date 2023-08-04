import { Component, OnInit } from '@angular/core';
import { PersonalService } from 'src/app/services/personal.service';
import * as moment from 'moment';
import { GlobalService } from 'src/app/services/global.service';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'app-tab2',
  templateUrl: './tab2.page.html',
  styleUrls: ['./tab2.page.scss'],
})
export class Tab2Page implements OnInit {

  dataUser: any;
  today: any;
  firstday: any;
  lastday: any;

  filter: any;

  reportesFI: any = [];

  loading = true;

  constructor(
    private apiSrv: PersonalService,
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

    this.getReportesFI();
  }

  getReportesFI() {

    this.loading = true;
    const data = {
      params: {
        filter: this.filter
      },
      fase:'FI',
      id_usuario_asignado: this.dataUser.id,
    };

    this.apiSrv.getReportesFiltro(data).subscribe(
      (res: any) => {
        this.reportesFI = [];
        res.data.forEach(e => {
          Object.assign(e, {
            fechahora_finalizo: ''+e.fecha_finalizo+' '+e.hora_finalizo
          });
          this.reportesFI.push(e);
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
