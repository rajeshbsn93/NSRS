import { CommonModule } from '@angular/common';
import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, forkJoin, map, takeUntil } from 'rxjs';
import { Months } from 'src/app/_common/_enums/role-code';
import { MaterialModule } from 'src/app/_common/material.module';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { EquipmentProcurementService } from 'src/app/_common/services/role-inner-pages-services/kic-services/monitoring-evaluation/equipmentProcurement.service';
import { LoaderComponent } from 'src/app/standalone_components/loader/loader.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-kisce-monitoring-modal-view',
  templateUrl: './kisce-monitoring-modal-view.component.html',
  styleUrls: ['./kisce-monitoring-modal-view.component.css'],
  standalone:true,
    imports:[CommonModule,ReactiveFormsModule,MaterialModule,LoaderComponent]
})
export class KisceMonitoringModalViewComponent implements OnInit {


  fileurl=environment.fileUrl;
  equipmentModalViewData:any;
  dataSourceForEquipment:any;
  dataSourceForPCA:any;
  dataSourceForBranding:any;
  dataSourceForTraining:any;
  dataSourceForCCTV:any;

  equipmentModalToViewFor:any

  monthsDetails:any=Months;
  tabData$:Observable<any>=new Observable();

  // @ViewChild('matPaginator1',{read: MatPaginator}) matPaginator1!: MatPaginator
  // @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  @ViewChild('categoryPaginator') categoryPaginator!: MatPaginator;
  @ViewChild('kicPCAPaginator') kicPCAPagination!: MatPaginator
  @ViewChild('kicBrandingWISEPaginator') kicBrandingWISEPagination!: MatPaginator
  @ViewChild('kicTrainingWISEPaginator') kicTrainingWISEPagination!: MatPaginator
  @ViewChild('kicCCTVWISEPaginator') kicCCTVWISEPagination!: MatPaginator

  displayedColumnsKICEquipment:string[]=['sno','type','status','date_procurement','reason_for_delay','uploadDocuments','remark'];
  displayedColumnsForPCA:string[]=['sno','kiud','name','discipline','aadhar_validation','joining_date','elgibility_criteria','reason_for_delay'];
  displayedBrandingColumns:string[]=['sno','year','brandingAtKIC','uploadImage','brandingRemarks'];
  displayedTrainingKicColumns:string[]=['sno','year','month','regularTrainingProvided','reasonForTrainingNotProvided','uploadedDocument'];
  displayedCCTVKicColumns:string[]=['sno','year','month','covered_by_cctv','upload_vedio'];

  showLoader:Boolean=false;

  constructor(public activeModal:NgbActiveModal,private _equipmentProcurementService:EquipmentProcurementService,private _alertService:AlertService) { }

  ngOnInit(): void {
    this.getTabData(this.equipmentModalViewData);
    // this.getEquipmentDetails();
    // this.getPCADetails();
    // this.getBrandingDetails();
    // this.getTrainingDetails();
    // this.getCCTVDetails();
  }

  getTabData(elementData:any){
    this.showLoader=true;
    var equipmentData$= this._equipmentProcurementService.getEquipmentProcurement(this.equipmentModalViewData.user_id,this.equipmentModalViewData.role_id,80);
    var pcaData$= this._equipmentProcurementService.getPCAListForKic(this.equipmentModalViewData.user_id,this.equipmentModalViewData.role_id,80);
    var brandingData$=this._equipmentProcurementService.getBranding(this.equipmentModalViewData.user_id,this.equipmentModalViewData.role_id,80);
    var trainingData$=this._equipmentProcurementService.getTrainingDetailsList(this.equipmentModalViewData.user_id,this.equipmentModalViewData.role_id,80);
    var cctvData$=this._equipmentProcurementService.getCctvFeedList(this.equipmentModalViewData.user_id,this.equipmentModalViewData.role_id,80);

    this.tabData$=forkJoin([equipmentData$,pcaData$,brandingData$,trainingData$,cctvData$]).pipe(map((data:any)=>{
      if(data[0].status){
        
        this.dataSourceForEquipment = new MatTableDataSource(data[0].data);
        // this.dataSourceForEquipment.paginator = this.categoryPaginator;
      
        // this.dataSourceForEquipment.paginator = this.kicEuipmentWISEPagination
        setInterval(() => this.dataSourceForEquipment.paginator = this.categoryPaginator);
      }else{
        this.dataSourceForEquipment = new MatTableDataSource([]);
        // this.dataSourceForEquipment.paginator = this.matPaginator1
        setInterval(() => this.dataSourceForEquipment.paginator = this.categoryPaginator);
      }
      if(data[1].status){
        this.dataSourceForPCA=new MatTableDataSource(data[1].data)
        // this.dataSourceForPCA.paginator = this.kicPCAPagination
        setInterval(() => this.dataSourceForPCA.paginator = this.kicPCAPagination);
      }else{
        this.dataSourceForPCA=new MatTableDataSource<any>([])
        // this.dataSourceForPCA.paginator = this.kicPCAPagination
        setInterval(() => this.dataSourceForPCA.paginator = this.kicPCAPagination);
      }
      if(data[2].status){
        this.dataSourceForBranding=new MatTableDataSource<any>(data[2].data)
        // this.dataSourceForBranding.paginator = this.kicBrandingWISEPagination
        setInterval(() =>  this.dataSourceForBranding.paginator = this.kicBrandingWISEPagination);
      }else{
        this.dataSourceForBranding=new MatTableDataSource<any>([])

      }
      if(data[3].status){
        this.dataSourceForTraining=new MatTableDataSource<any>(data[3].data)
        this.dataSourceForTraining.paginator=this.kicTrainingWISEPagination
        setInterval(() =>   this.dataSourceForTraining.paginator=this.kicTrainingWISEPagination);
      }else{
        this.dataSourceForTraining=[]
        this.dataSourceForTraining.paginator=this.kicTrainingWISEPagination
      }
      if(data[4].status){
        this.dataSourceForCCTV=new MatTableDataSource<any>(data[4].data);
        // this.dataSourceForCCTV.paginator=this.kicCCTVWISEPagination
        setInterval(() =>   this.dataSourceForCCTV.paginator=this.kicCCTVWISEPagination);
      }else{
        this.dataSourceForCCTV=[]
        this.dataSourceForCCTV.paginator=this.kicCCTVWISEPagination
      }
      this.showLoader=false;
      return data
    }))
  }
  

  get(month:any){
    if(month){
       var name=this.monthsDetails.filter((data:any)=>{
        if(data.id==Number(month)){
          return data.name
        }
      })
      return name[0].name
    }
      return 'N/A'
  }

}
