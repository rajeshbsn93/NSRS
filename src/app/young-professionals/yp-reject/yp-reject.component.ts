import { CommonModule } from "@angular/common";
import { Component, inject, OnInit, QueryList, ViewChild, ViewChildren } from "@angular/core";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { DateAdapter, MAT_DATE_FORMATS } from "@angular/material/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { MaterialModule } from "src/app/_common/material.module";
import { MY_DATE_FORMATS } from "src/app/_common/models/my_dateFormat";
import { LoaderComponent } from "src/app/standalone_components/loader/loader.component";

import { CoachTrainingInfoEntity, CoachingInfoService, OfficialCurrentTrainingInfosEntity, OfficialPreviousTrainingInfosEntity } from "src/app/_common/services/role-inner-pages-services/coach-services/coaching-info.service";
import { StorageService } from "src/app/_common/services/common-services/storage.service";
import { CommonSharableService, Official_Training_InfoEntity } from "src/app/_common/services/common-services/commonSharable.service";
import { AlertService } from "src/app/_common/services/common-services/alert.service";

import Swal from "sweetalert2";
import { first } from "rxjs";
import { MatDialog } from "@angular/material/dialog";
import { YpCommonPopupComponent } from "../yp-common-popup/yp-common-popup.component";

export interface ypData{
  s_no: number
  kitd: string
  athlete_name: string
  date_of_birth: string
  father_name: string
  status: string
  comments: string

}
@Component({
  selector: 'app-yp-reject',
  templateUrl: './yp-reject.component.html',
  styleUrls: ['./yp-reject.component.css']
})
export class YpRejectComponent implements OnInit {
  dialog = inject(MatDialog);
  loader:boolean = false;
  loader2:boolean = false;
  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  @ViewChildren(MatSort) sort = new QueryList<MatSort>();
  athleteCurrentTableColumns: string[] = ['s_no', 'kitd','athlete_name','date_of_birth','father_name' ,'status','comments'];
  // athleteCurrentCoachingInfoData = new MatTableDataSource<any>();
  athleteCurrentCoachingInfoData:ypData[] =[];


  academyDetails:any;
  @ViewChild('deleteModal') deleteModal:any;
  deleteModalRef:any;
  deleteRowData:any;
  @ViewChild('verifyModal') verifyModal:any;
  verifyModalRef:any;
  verifyModalRowData:any;

  constructor(){}
  

  ngOnInit(): void {
    
    this.athleteCurrentCoachingInfoData=[
      {
        s_no: 1,
        kitd: 'string',
        athlete_name: 'string',
        date_of_birth: 'string',
        father_name: 'null',
        comments: 'Dummy Comments..',
        status: 'string'
      }
    ]



  
  }
  

 
  openDialog() {
    this.dialog.open(YpCommonPopupComponent, {
      data: {
        animal: 'panda',
      },
    });
  }

}
