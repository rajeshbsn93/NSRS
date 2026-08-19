import { Component, inject, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { YoungProfessionalService } from 'src/app/_common/services/young-professional/young-professional.service';
import { YpCommonPopupComponent } from '../yp-common-popup/yp-common-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';

function compare(a: number | string |Date, b: number | string | Date, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
} 
@Component({
  selector: 'app-yp-dashboard-tabs',
  templateUrl: './yp-dashboard-tabs.component.html',
  styleUrls: ['./yp-dashboard-tabs.component.css']
})
export class YpDashboardTabsComponent implements OnInit {
@Input() getParentListData:any
@Input() type:string = ''
@ViewChild(MatPaginator) paginator!:MatPaginator;
@ViewChild(MatSort) sort!:MatSort;
dialog = inject(MatDialog);

athleteCurrentTableColumns: string[] = ['s_no', 'kitd', 'eventName','name','date_of_birth','father_name','document' ,'status','action'];
isLoading:Boolean=false;
dataSource = new MatTableDataSource()
fileUrl=environment.fileUrl
  export: string = "0";

  constructor(
    private router: Router,
    private youngProfessionalService:YoungProfessionalService,
  ) { }

  ngOnInit() {
  }
  ngOnChanges(changes: SimpleChanges){
    if(changes['getParentListData']){
      // this.getParentListData = changes['getParentListData'].currentValue
      this.dataSource = new MatTableDataSource<any>(this.getParentListData)
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator
    }
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
      const data = this.getParentListData.slice();
      if (!sort.active || sort.direction === '') {
        this.dataSource = data;
        return;
      }
  
      this.dataSource = data.sort((a:any, b:any) => {
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

}
