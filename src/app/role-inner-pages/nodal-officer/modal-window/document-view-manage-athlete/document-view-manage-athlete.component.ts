import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { error } from 'highcharts';
import { map, Observable } from 'rxjs';
import { MaterialModule } from 'src/app/_common/material.module';
import { MY_DATE_FORMATS } from 'src/app/_common/models/my_dateFormat';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { ManageAthleteService } from 'src/app/_common/services/nodal-officer-service/manage-athlete.service';
import { AthleteDocumentService } from 'src/app/_common/services/role-inner-pages-services/athlete-services/athlete-document.service';
import { LoaderComponent } from 'src/app/standalone_components/loader/loader.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-document-view-manage-athlete',
  templateUrl: './document-view-manage-athlete.component.html',
  styleUrls: ['./document-view-manage-athlete.component.css'],
  standalone:true,
  imports:[CommonModule, MaterialModule,LoaderComponent,ReactiveFormsModule],
  providers:[
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  ]
})
export class DocumentViewManageAthleteComponent implements OnInit {
  elementRowData:any;
  loader:boolean = false;
  athleteDocument$:Observable<any> = new Observable();
  fileBaseUrl = environment.fileUrl;
  esignForm!:FormGroup

  constructor(
    public activeModal:NgbActiveModal,
    private athleteDocumentService:AthleteDocumentService,
    private _fb:FormBuilder,
    private manageAthleteService:ManageAthleteService,
    private _alertService:AlertService
  ) { }

  ngOnInit() {
    // console.log(this.elementRowData)
    this.getAthleteDocumentInfo();
    this.initiateForm()
  }
  initiateForm(){
    this.esignForm = this._fb.group({
      dob:[{ value: this.elementRowData.date_of_birth, disabled: true }],
      remark:['', [Validators.required]]      
    })
  }
  getAthleteDocumentInfo(){
    this.loader = true
    this.athleteDocument$ = this.athleteDocumentService.athleteDocumentInfo(this.elementRowData.player_detail_id).pipe(map((data)=>{
      this.loader = false
      return data
    }))
  }
  verifyDocumentPath(docPath:string){
    if(docPath){
      if(docPath.includes('.pdf')){
        return './assets/images/pdf.png'      
      }
      else {
        return this.fileBaseUrl+docPath
      }
    }
    else return docPath
  }
  rejectButton(){
    if(this.esignForm.valid){      
      const data = {
        player_detail_id: this.elementRowData.player_detail_id,
        date_of_birth: this.elementRowData.date_of_birth,
        remarks: this.esignForm.get('remark')?.value,
        sport_display_name: this.elementRowData.sport_display_name,
        is_Verified: 2
      }
      this.loader = true;
      this.manageAthleteService.savePlayerDobverification(data).subscribe({
        next:(res)=>{
          this.loader =false;
          console.log(res)
          this.activeModal.close();
          this._alertService.swalPopSuccess('Your request has been submitted !');
        },
        error:(error)=>{
          console.error(error);
          this.loader = false
        }
      })
    }else{
      this.esignForm.markAllAsTouched()
    }
  }

}
