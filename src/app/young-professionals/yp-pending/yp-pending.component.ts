import { CommonModule,Location } from "@angular/common";
import { Component, inject, OnInit, QueryList, ViewChild, ViewChildren } from "@angular/core";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { DateAdapter, MAT_DATE_FORMATS } from "@angular/material/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort, Sort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { MaterialModule } from "src/app/_common/material.module";
import { MY_DATE_FORMATS } from "src/app/_common/models/my_dateFormat";
import { LoaderComponent } from "src/app/standalone_components/loader/loader.component";

import { CoachTrainingInfoEntity, CoachingInfoService, OfficialCurrentTrainingInfosEntity, OfficialPreviousTrainingInfosEntity } from "src/app/_common/services/role-inner-pages-services/coach-services/coaching-info.service";
import { StorageService } from "src/app/_common/services/common-services/storage.service";
import { AlertService } from "src/app/_common/services/common-services/alert.service";

import Swal from "sweetalert2";
import { first } from "rxjs";
import { YoungProfessionalService } from "src/app/_common/services/young-professional/young-professional.service";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { YpCommonPopupComponent } from "../yp-common-popup/yp-common-popup.component";
import { environment } from "src/environments/environment";
declare var Digio:any
export interface ypData{
    s_no: number
    form5Id:number
    player_detail_id: number,
    kitd_unique_id: string
    full_name: string
    date_of_birth: string
    father_full_name: string
    status: string
    form5_Status: number,
    required_string_arr:string[]
}

function compare(a: number | string |Date, b: number | string | Date, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
} 

function compareDate(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}


@Component({
  selector: 'app-yp-pending',
  templateUrl: './yp-pending.component.html',
  styleUrls: ['./yp-pending.component.css']
})
export class YpPendingComponent implements OnInit {
  loader:boolean = false;
  loader2:boolean = false;
  @ViewChild(MatPaginator) paginator!:MatPaginator;
  // @ViewChildren(MatSort) sort = new QueryList<MatSort>();
  @ViewChild(MatSort) sort!:MatSort;
  athleteCurrentTableColumns: string[] = ['s_no', 'kitd', 'eventName','name','date_of_birth','father_name','document' ,'status','action'];
  dialog = inject(MatDialog);
  academyDetails:any;
  @ViewChild('deleteModal') deleteModal:any;
  deleteModalRef:any;
  deleteRowData:any;
  @ViewChild('verifyModal') verifyModal:any;
  verifyModalRef:any;
  verifyModalRowData:any;

  pendingFormFivePlayerList:ypData[]=[]
  dataSource:any
  isLoading:Boolean=false
  competitionName!:string
  type!:string
  docType: string = 'Export';
  fileUrl=environment.fileUrl
  export: string = "0";
  @ViewChild('exporter') exporter: any
  yearDropdownList:any = [];
  gameDropdownList:any = [];
  selectModelYears:any = ''
  selectModelGames:any = ''
  constructor(private location: Location,
    private youngProfessionalService:YoungProfessionalService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private swalAlert:AlertService
  ){}
  

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      // this.competitionName = params['competitionName'];
      this.type = params['type']; 
      // if(this.type ==='pending'){
      //   this.athleteCurrentTableColumns.push('action')
      // }
      this.getFormFivePlayerList()
    });
 
  }

 getFormFivePlayerList(){
         this.isLoading=true
  this.youngProfessionalService.getFormFivePlayerList('',this.type).subscribe({
        next: (res:any) => {
          if(res){
            let arrStr:any=[]
            // if(this.type=='approved'){
            //   this.eSignedSorting(res)
            //  }
            
            res.forEach((ele:any,i:number) => {              
              res[i]['required_status']= ele?.status.split(',').sort((a:any, b:any) => {
                  if (a.includes("Pending") && !b.includes("Pending")) {
                      return -1; // a comes before b
                  } else if (!a.includes("Pending") && b.includes("Pending")) {
                      return 1; // b comes before a
                  }
                  return 0; // keep the original order if neither contains "Pending"
              });
            
            });
            
            

            this.pendingFormFivePlayerList=res
            const yearSet:Set<String> = new Set()
            const competetionSet:Set<String> = new Set()
            this.pendingFormFivePlayerList.forEach((pendingPlayerList:any,i:number) => {
              pendingPlayerList.s_no = i+1     
              pendingPlayerList.date_of_birth = pendingPlayerList.date_of_birth
              const [competition, year] = pendingPlayerList.comp_ShortCode.split(' ');
              competetionSet.add(competition)
              yearSet.add(year)
            });
            this.yearDropdownList = Array.from(yearSet).sort();
            this.gameDropdownList = Array.from(competetionSet);
         
    
            const ELEMENT_DATA: ypData[] =  this.pendingFormFivePlayerList;
            this.dataSource = new MatTableDataSource<ypData>(ELEMENT_DATA);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.isLoading=false
          }
         
        },
        error: (error) => {

          this.isLoading=false
        },
      });
 } 

 eSignedSorting(data:any){
   data.sort((a:any, b:any) => {
    if (a.isSigned === b.isSigned) {
      return 0; // If both are signed or both are unsigned, maintain current order
    }
    return a.isSigned ? 1 : -1; // If a is signed, it should go after b
  });

 }

 convertToDate(dateString: string): Date {
  const parts = dateString.split('/'); // Split the date string by '/'
  // Construct the date in 'yyyy-MM-dd' format
  const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
  return new Date(formattedDate);
}

 viewYPDocument(form5Id:number){
  this.router.navigate(['/yp/view-document', form5Id]);
 }
  goBack(){
    this.router.navigate([`/yp-dashboard`]);
    // this.location.back();
  }


  navigateToCom(form5Id:number ,playerDetailId:number ,statusType:string){
    this.router.navigate([`/yp/form5/${statusType}`, form5Id,playerDetailId]);
  }


  openDialog(ypData:any) {
    this.dialog.open(YpCommonPopupComponent, {
       width: '500px',
      data: {
        type : 'ypReject',
        ypData:ypData
      },
    });
  }
 
  downloadPdf(obj:any){
    let urlPath=this.fileUrl+obj?.form5DocPath
    this.triggerDownload(urlPath,obj)
  }
  triggerDownload(url: string,obj:any) {
    let fileName=obj?.kitd_unique_id+'_form5.pdf'
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.download = fileName; // Set the desired filename
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url); // Clean up the blob URL
  }


  exportData() {
    this.isLoading = true
    let itemsData = this.dataSource?.filteredData
      let headers:any = []
      let  fileName = 'athletes_form5_status';
      headers = ['S.No','NSRS ID', 'Name', 'Date of Birth', 'Father Name',  'Status',]
      
      itemsData.forEach((res: any) => {
        res['S.No'] = res['s_no'],
        res['NSRS ID'] = res['kitd_unique_id'] ? res['kitd_unique_id'] : '-',
        res['Name'] = res['full_name'] ? res['full_name'] : '-'
        res['Date of Birth'] = res['date_of_birth']
        res['Father Name'] = res['father_full_name']
        res['Status'] = res['status']  
      })
      setTimeout(() => {
        this.youngProfessionalService.downloadFile(itemsData, fileName, headers)
        this.isLoading = false
        this.export = "0"
      }, 500);
  }


   sortData(sort: Sort) {
    const data = this.pendingFormFivePlayerList.slice();
    if (!sort.active || sort.direction === '') {
      this.dataSource = data;
      return;
    }

    this.dataSource = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 's_no':
          return compare(a.s_no, b.s_no, isAsc);
        case 'kitd':
          return compare(a.kitd_unique_id, b.kitd_unique_id, isAsc);
        case 'father_name':
          return compare(a.father_full_name, b.father_full_name, isAsc);
        case 'date_of_birth':
          return compare(a.date_of_birth, b.date_of_birth, isAsc);
          // return compare(a.date_of_birth, b.date_of_birth, isAsc);
        case 'name':
          return compare(a.full_name, b.full_name, isAsc);
        default:
          return 0;
      }
    });
  }
  changeSelection(){
    if(this.selectModelGames || this.selectModelYears){
      let filterData:any = []
      if(this.selectModelYears && this.selectModelGames === ''){
        filterData = this.pendingFormFivePlayerList.filter((item:any)=>item.comp_ShortCode.includes(this.selectModelYears))
      }
      if(this.selectModelGames && this.selectModelYears === ''){
        filterData = this.pendingFormFivePlayerList.filter((item:any)=>item.comp_ShortCode.includes(this.selectModelGames))
      }
      if(this.selectModelGames && this.selectModelYears){
        filterData = this.pendingFormFivePlayerList.filter((item:any)=>item.comp_ShortCode.includes(this.selectModelGames) && item.comp_ShortCode.includes(this.selectModelYears))
      }
      console.log(filterData)
      const ELEMENT_DATA: ypData[] =  filterData;
      this.dataSource = new MatTableDataSource<ypData>(ELEMENT_DATA);    
      setTimeout(()=>{
        this.dataSource.paginator = this.paginator;
      },0)
    }
  }


}
