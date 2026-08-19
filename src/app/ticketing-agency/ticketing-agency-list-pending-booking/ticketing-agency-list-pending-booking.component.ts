import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { SharableService } from 'src/app/_common/services/innerPagesServices/innerpagesSharable.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-ticketing-agency-list-pending-booking',
  templateUrl: './ticketing-agency-list-pending-booking.component.html',
  styleUrls: ['./ticketing-agency-list-pending-booking.component.css']
})
export class TicketingAgencyListPendingBookingComponent implements OnInit, OnChanges {
  @Output() selectedTabIndex = new EventEmitter<number>()
  @Input() proposalListData:any
  displayedColumns: string[] = [
    'sl_no',
    'proposal_type',
    'proposal_id',
    'name',
    'mobile_no',
    'departure_date',
    'return_date',
    'origin',
    'destination',
    'bags',
    'insurance',
    'passport',
    'ticket_upload'
  ];
  pendingForm!:FormGroup
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  initialControlData:Array<any> = []
  loader:boolean = false;
  fileBaseUrl: any = environment.fileUrl;

  constructor(
    private _fb:FormBuilder,
    private _alertService:AlertService,
    private _sharableService:SharableService
  ) { 
    this.formInitialization();
  }

  ngOnInit() {
  //   this.dataSource=[
  //     {
  //     nsrsid:'d'
  //   }
  // ]
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.proposalListData)
    if(this.proposalListData.length){
      this.proposalListData.forEach((item:any)=>{
        this.addItemTicketing(item)
      })
      this.initialControlData = [...this.pendingFormArray.controls]
      this.dataSource.data = this.pendingFormArray.controls
    }
  }
  formInitialization(){
    this.pendingForm = this._fb.group({
      items: this._fb.array([])
    })
  }

  get pendingFormArray():FormArray{
    return this.pendingForm.get('items') as FormArray
  }
  
  addItemTicketing(item:any){
    const group = this._fb.group({
      proposal_Id:[item.proposal_Id],
      ticket_upload: [item?.ticket_upload || '']
    })
    this.pendingFormArray.push(group)
  }
  searchFilter(value:any){
    if(value){
      const data = this.proposalListData.filter((item:any)=>item.proposal_Id.toLowerCase().includes(value.toLowerCase()))   
      console.log(data) 
      this.pendingFormArray.clear();
      data.forEach((el:any)=>{
        this.addItemTicketing(el)
      })
      this.dataSource.data = this.pendingFormArray.controls  
    }else{
      this.dataSource.data = this.initialControlData
    }
  }

  getFileExtension(file: any) {
    let fileIndex = file.name.lastIndexOf('.') + 1;
    let extFile = file.name.substr(fileIndex, file.name.length).toLowerCase();
    return extFile;
  }

  uploadFile(files: any, index: any, formControlName: any) {
    if (files.length === 0) {
      return;
    } else {
      let extFile = this.getFileExtension(files[0]);
      // TODO: Check extension here

      if (extFile == "jpg" || extFile == "jpeg" || extFile == "png" || extFile == "pdf") {
        let fileSize = files[0].size;
        // TODO: Check file size here
        if (fileSize < 10485770) {
          const formData = new FormData();
          formData.append('file', files[0], files[0].name);
          formData.append('path', 'data/Tempimage');
          formData.append('uploadType', '3');

          // Uploading file - calling service
          this.loader = true;
          this._sharableService?.uploadFile(formData).subscribe({
            next: (res:any) => {
              this.loader = false;
              if (res?.isUploaded == true) {
                this._alertService.swalPopSuccess('File Uploaded');
                this.pendingFormArray.controls[index].get(formControlName)?.patchValue(res?.filedataList[0].filePath);
              } else {
                this._alertService.swalPopError(res?.errorMsg || 'Upload Failed! Please Try Again.');
              }
            },
            error: () => {
              this.loader = false;
            },
          });
        } else {
          this._alertService.swalPopError('File size must not be more than 10Mb.');
        }
      } else {
        this._alertService.swalPopWarning('Only JPG, JPEG,PNG, PDF files are allowed!');
      }
    }
  }

  save(){
    this.selectedTabIndex.emit(1)
    console.log(this.pendingFormArray.value)
  }

}
