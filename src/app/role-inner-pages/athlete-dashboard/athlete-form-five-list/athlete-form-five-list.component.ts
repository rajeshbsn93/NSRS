import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MaterialModule } from 'src/app/_common/material.module';
import { LoaderComponent } from 'src/app/standalone_components/loader/loader.component';
import { AthleteDashboardSidebarComponent } from '../athlete-dashboard-sidebar/athlete-dashboard-sidebar.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AthleteFormFiveComponent } from '../../modal-window/athlete-dashboard-modal/athlete-form-five/athlete-form-five.component';
import { athleteformfiveService } from 'src/app/_common/services/role-inner-pages-services/athlete-services/atheleteformfive.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { AthleteFormFiveDocumentsComponent } from '../../modal-window/athlete-dashboard-modal/athlete-form-five-documents/athlete-form-five-documents.component';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface PeriodicElement {
  sno: string;
  kid: string;
  name: string;
  fname: string;
  documents:string;
  status:string;
}

@Component({
  selector: 'app-athlete-form-five-list',
  templateUrl: './athlete-form-five-list.component.html',
  styleUrls: ['./athlete-form-five-list.component.css'],
  standalone:true,
  imports:[CommonModule,MaterialModule,LoaderComponent,AthleteDashboardSidebarComponent,MatIconModule]
})



export class AthleteFormFiveListComponent implements OnInit {
  displayedColumns: string[] = ['sno', 'kid', 'name', 'eventName', 'submitDate','documents','status'];
  dataSource:any;
  loader:boolean = false;
  loaderTiles:boolean = false;
  form5list:any;
  tilesData:any=[];
  basePath = environment.fileUrl

  formFiveTilesData$: Observable<any> = new Observable();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  constructor(
    private modalService:NgbModal,private _formFiveService:athleteformfiveService,private _alertService:AlertService
  ) { }

  ngOnInit() {
    this.getForm5TilesData();
    this.getFormFiveList();
  }

  getForm5TilesData(){
    this.loaderTiles=true;
    this.formFiveTilesData$=this._formFiveService.getTilesData().pipe(map((res:any)=>{
      this.loaderTiles=false;
      if(res.length>0){
        this.tilesData=res        
      }else{
        this.tilesData=[]
      }
      return res
    }))
  }

  getFormFiveList(){
    this.loader=true;
    this._formFiveService.getPlayerForms().pipe(map((resMap:any)=>{
      resMap.forEach((ele:any,i:number) => {
        resMap[i]['required_status']= ele?.status.split(',').sort((a:any, b:any) => {
          if (a.includes("Pending") && !b.includes("Pending")) {
              return -1; // a comes before b
          } else if (!a.includes("Pending") && b.includes("Pending")) {
              return 1; // b comes before a
          }
          return 0; // keep the original order if neither contains "Pending"
      });
    });
    return resMap
    })).subscribe({
      next:(res:any)=>{
        this.loader=false;
        this.form5list=res
        this.dataSource=this.form5list;
        this.dataSource = new MatTableDataSource<any>(this.form5list);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error:()=>{
        this.loader=false;
      }
    })
  }

  openFormFive(formId:any){
    const athleteForm5Modalref=this.modalService.open(AthleteFormFiveComponent,{size:'xl', centered:true, backdrop: 'static', keyboard: false });
    athleteForm5Modalref.componentInstance.formIdFromParent={data:formId};
    athleteForm5Modalref.result.then((result) => {
      if (result) this.getFormFiveList()
    });
  }


  openDocuments(formId:any){
    const athleteDocumentModalref=this.modalService.open(AthleteFormFiveDocumentsComponent,{size:'lg', centered:true, backdrop: 'static', keyboard: false });
    athleteDocumentModalref.componentInstance.formIdFromParent={data:formId};
    athleteDocumentModalref.result.then((result) => {
      if (result) this.getFormFiveList()
    });
  }


}
