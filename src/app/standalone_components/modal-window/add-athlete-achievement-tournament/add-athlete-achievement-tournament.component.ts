import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MaterialModule } from 'src/app/_common/material.module';
import { LoaderComponent } from '../../loader/loader.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { YearFormatDirective } from '../../directives/year-format.directive';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MY_DATE_FORMATS } from 'src/app/_common/models/my_dateFormat';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { SharableService } from 'src/app/_common/services/innerPagesServices/innerpagesSharable.service';
import { TournamentService } from 'src/app/_common/services/innerPagesServices/tournament.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-athlete-achievement-tournament',
  templateUrl: './add-athlete-achievement-tournament.component.html',
  styleUrls: ['./add-athlete-achievement-tournament.component.css'],
  standalone:true,
  imports:[CommonModule,ReactiveFormsModule,MaterialModule,LoaderComponent,YearFormatDirective],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    DatePipe
  ]
})
export class AddAthleteAchievementTournamentComponent implements OnInit {
  addAchievementForm!:FormGroup;
  elementRowData:any;
  loader:boolean = false
  stateListData:any;
  eventListData:Array<any> = [];
  fileBaseUrl = environment.fileUrl;
  isSaveClicked:boolean = false;

  constructor(
    public activeModal:NgbActiveModal,
    private _fb:FormBuilder,
    private _alertService:AlertService,
    private _sharableService:SharableService,
    private _tournamentService:TournamentService,
    private _datePipe:DatePipe
  ) { }

  ngOnInit() {
    // console.log(this.elementRowData)
    this.initiateForm(this.elementRowData);
    if(this.elementRowData.tournament_Level== 'National') this.getState();
  }
  initiateForm(elementRowData:any){
    this.addAchievementForm = this._fb.group({
      tournamentYear:[{value:elementRowData.tournament_Year.toString() || '',disabled:true},Validators.required],
      level:[{value:elementRowData.tournament_Level ? elementRowData.tournament_Level: '', disabled:true},Validators.required],
      category_type:[{value:elementRowData.tournament_Category_Name || '', disabled:true},Validators.required],
      tournament:[{value:elementRowData.tournament_Name || '', disabled:true},Validators.required],
      age_category:[{value:elementRowData.category || '', disabled:true},Validators.required],
      start_date:[{value:elementRowData.from_Date || '', disabled:true}, Validators.required],
      end_date:[{value:elementRowData.to_date || '', disabled:true},Validators.required],
      venue:[{value:elementRowData.venue || '', disabled:true},Validators.required],
      nsrs_id:['', Validators.required],
      athlete_name:['', Validators.required],
      discipline:['', Validators.required],
      position:['', Validators.required],
      result:['', Validators.required],
      event:['', Validators.required],
      represented:['', Validators.required],
      document_path:['', Validators.required],
      player_detail_id:['', Validators.required],
    })
  }
  getState(){ 
    const appendData = [
        {state_name:'India'},
        {state_name:'CAG'},
        {state_name:'RSPB'},
        {state_name:'SSCB'},
        {state_name:'Sports Authority of India'},
        {state_name:'SPSPBSCB'},
        {state_name:'OTHER'},
    ];
    this.loader = true
    this._sharableService.stateList().subscribe({
      next:(response)=>{
        this.loader = false;
        this.stateListData = response;
        for(let i of appendData){
          this.stateListData.push(i)
        }
      },
      error:(err)=>{
        this.loader = false
        console.error(err);
      }
    });
  }
  changeNSRSID(event:any){
    if(event.target.value.trim()!=''){
      this.loader = true;
      this._tournamentService.getTournamentPlayerDetail(this.elementRowData.tournament_Detail_Id,event.target.value).subscribe({
        next:(res:any)=>{
          this.loader = false;
          // console.log(res);
          if(res.player_detail_id==0){
            this._alertService.swalPopWarning("Invalid NSRS ID or Athlete's sport is not in tournament");
            this.addAchievementForm.patchValue({
              athlete_name:'',
              discipline:'',           
              player_detail_id:'',           
            });
            this.addAchievementForm.get('athlete_name')?.enable()
            this.addAchievementForm.get('discipline')?.enable()
            this.eventListData = []
          }else{
            this.patchValuesControls(res)
            this.getEventdetailTournamnetwise(res.sport_detail_id,res.gender=="Male" ? 1:2)
          }
        },
        error:(err)=>{
          this.loader = false;
          console.error(err)
        }
      })
    }else{
      this.addAchievementForm.patchValue({
        athlete_name:'',
        discipline:'',           
        player_detail_id:'',           
      })
      this.addAchievementForm.get('athlete_name')?.enable()
      this.addAchievementForm.get('discipline')?.enable()      
    }
    
  }
  patchValuesControls(response:any){
    this.addAchievementForm.patchValue({
      athlete_name:response.full_name,
      discipline:response.sport_display_name,           
      player_detail_id:response.player_detail_id,           
    })
    this.addAchievementForm.get('athlete_name')?.disable()
    this.addAchievementForm.get('discipline')?.disable()
  }
  getEventdetailTournamnetwise(sport_id:number,gender_id:number){
    this.loader = true;
    this.eventListData = [];
    this._tournamentService.eventdetailTournamnetwise(this.elementRowData.tournament_Detail_Id).subscribe({
      next:(response:any)=>{
        this.loader = false;
        // console.log('EventdetailTournamnet',response)
        if(response.length>0){
          const filterData = response.filter((item:any)=>{
            if(item.sport_id==sport_id && (item.gender_id==gender_id ||  item?.gender_id===3 )) return item
          })
          this.eventListData = filterData
        }
      },
      error:(err)=>{
        this.loader = false;
        console.error(err)        
      }
    })
  }
  checkEmptyNSRSID(){
    if(this.addAchievementForm.get('nsrs_id')?.value ==''){
      this._alertService.swalPopWarning('Please fill NSRS ID')
    }
  }
  getFileExtension(file:any) {
    let fileIndex = file.name.lastIndexOf(".") + 1;
    let extFile = file.name.substr(fileIndex, file.name.length).toLowerCase();
    return extFile;
  }
  fileUpload(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    const extFile=this.getFileExtension(file);
    if (extFile == "jpg" || extFile == "jpeg" || extFile == "png" || extFile == "pdf") {
      const formData = new FormData();
      formData.append("file",file, file.name);
      formData.append("path", "Athlete\\Achievement");
      formData.append("uploadType","3")
      this.loader = true;
      this._sharableService.uploadFile(formData).subscribe({
        next: (response: any) => {
          this.loader = false;
          if (response.isUploaded==true) {
              // this.swalAlert('success','Upload Successful!');
              // this.document_pathUrl = response.filedataList[0].filePath;
              // this.document_pathInput.nativeElement.value = null;
              this._alertService.swalPopSuccess('Upload Successful!')
              this.addAchievementForm.get('document_path')?.setValue(response.filedataList[0].filePath)
          } else {
            // this.swalAlert('error',response.errMsg || 'Upload Failed! Please try again.');
            this._alertService.swalPopError(response.errMsg || 'Upload Failed! Please try again.');
          }
        },
        error: () => {
          this.loader=false;
          this._alertService.swalPopError('Upload Failed! Please try again.');
          console.error("error caught in upload file")
        }
      });
    } 
    else {
      // this.swalAlert('warning','Only jpg, jpeg, png or pdf file is allowed!');
    }
  }
  save(){
    this.isSaveClicked = true
    let checkEmptyField:any = []
    Object.keys(this.addAchievementForm.getRawValue()).forEach((key:any)=>{ 
      if(this.addAchievementForm.getRawValue()?.[key]=='' && key!=='player_detail_id'){
        checkEmptyField.push(key)
      }
    })
    if(!checkEmptyField.length && this.addAchievementForm.valid){
      let id= 0
      this.loader = true
      this._tournamentService.SaveAthleteAchievementDetail(
        id,this.addAchievementForm.getRawValue().player_detail_id, this.addAchievementForm.getRawValue().event,
        this.addAchievementForm.getRawValue().represented, this.addAchievementForm.getRawValue().position,
        this.addAchievementForm.getRawValue().result, this.addAchievementForm.getRawValue().document_path,
        this.elementRowData.tournament_Detail_Id, this.addAchievementForm.getRawValue().age_category,
        this.addAchievementForm.getRawValue().level,this.addAchievementForm.getRawValue().tournament,
        this._datePipe.transform(this.addAchievementForm.getRawValue().start_date,'yyyy-MM-dd'),
        this._datePipe.transform(this.addAchievementForm.getRawValue().end_date,'yyyy-MM-dd'),
        this.addAchievementForm.getRawValue().venue
      ).subscribe({
        next: (response: any) => {
          this.loader = false;
          if (response.value == 1) {
            this._alertService.swalPopSuccess('Saved successfully!');
            this.activeModal.close(response.value);
          } else {
            this._alertService.swalPopError(response.messaage);
          }
          // if (response) {
          //   if (response.value == 1) {
          //     this._alertService.swalPopSuccess('Saved successfully!');
          //     this.activeModal.close(response);
          //   } else {
          //     this._alertService.swalPopError(response.messaage);
          //   }
          // } else {
          //   this._alertService.swalPopError('Something went wrong!');
          // }
        },
        error: (err) => {
          this.loader = false;
          console.error(err)
        }
      })
    }else{
      this._alertService.swalPopWarning(`${checkEmptyField.join(', ')} fields ${checkEmptyField.length > 1 ? 'are' : 'is'} blank `);
      this.addAchievementForm.markAllAsTouched();
    }
  }

}
