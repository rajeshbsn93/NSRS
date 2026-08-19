import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { LoaderComponent } from 'src/app/standalone_components/loader/loader.component';
import { MaterialModule } from 'src/app/_common/material.module';
import { MY_DATE_FORMATS } from 'src/app/_common/models/my_dateFormat';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { StorageService } from 'src/app/_common/services/common-services/storage.service';
import { SportscientistDetailListService } from 'src/app/_common/services/role-inner-pages-services/academy-services/sportscientist-detail-list.service';
import { environment } from 'src/environments/environment';
import { SharableService } from 'src/app/_common/services/innerPagesServices/innerpagesSharable.service';
import { CampInnerPagesService } from 'src/app/_common/services/camp-services/camp-inner-pages.service';

@Component({
  selector: 'app-add-camp-sport-scientist',
  templateUrl: './add-camp-sport-scientist.component.html',
  styleUrls: ['./add-camp-sport-scientist.component.css'],
  providers: [
    //{provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: DateAdapter, useClass: MomentDateAdapter},
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS}
  ],
  standalone:true,
  imports:[CommonModule,MaterialModule,ReactiveFormsModule,LoaderComponent]

})
export class AddCampSportScientistComponent implements OnInit, OnDestroy {
  sportDisciplineIdToAdd:any;
  multiTagForm!:FormGroup;
  disciplineToAddID:any;
  userDetails:any;
  loader:boolean = false;
  dataByNsrsid:any;
  private  subscription:Subscription | undefined;
  fileUploadRes:any
  fileUrl:any
  fileBaseUrl = environment.fileUrl;
  todayDate = new Date();
  minDate = new Date();
  maxDate = new Date();

  constructor(public activeModal:NgbActiveModal, private fb:FormBuilder,private storageService:StorageService,
    private sportscientistDetailService:SportscientistDetailListService,private alertService:AlertService,
    private _sharableService:SharableService,private campInnerPageService:CampInnerPagesService) { }

  ngOnInit() {
    this.userDetails=this.storageService.getAcademyDetails()
    this.getBasicCampDetail();
    this.multiTagForm = this.fb.group({
      addMultiTagArray:this.fb.array([])
    })
    this.addMultiTagArray.push(this.AddMultiTagArrayControls());
  }

  get addMultiTagArray(): FormArray{
    return this.multiTagForm.get('addMultiTagArray') as FormArray
  }
  AddMultiTagArrayControls(): FormGroup{
    return this.fb.group({
      ki_unique_id:['',Validators.required],
      offcialDetailId:[''],
      coach_name:[{value:'',disabled:true}],
      designation:[''],
      doj:['',Validators.required ],
      endDate:['',Validators.required],
      docPath:[''],
      document_upload_path_url:[''],
    })
  }
  newAddMultiTagArray(){  
    this.addMultiTagArray.push(this.AddMultiTagArrayControls())  
  }
  removeAddMultiTagArray(index:any){
    this.addMultiTagArray.removeAt(index)
  }
  changeNSRSID(event:any,index:any){
   const coachRoleId = 103;
   let duplicateCheck:boolean = false;
    let nsrsId = (event.target as HTMLInputElement)?.value
    if(nsrsId!=''){
      if(this.addMultiTagArray.length > 1){
        duplicateCheck = false;
        for(let j=0; j<index; j++){
          if((this.addMultiTagArray.at(j)?.value?.ki_unique_id)?.trim() === (nsrsId)?.trim()){
            duplicateCheck = true;
            break;
          }else{
            duplicateCheck = false;
          }
        }
        if(duplicateCheck == true){
          this.resetControls(index,'ki_unique_id')
          this.addMultiTagArray.updateValueAndValidity();
          this.alertService.swalPopWarning("Duplicate entry is detected!");
        }else if(duplicateCheck == false){
          this.loader=true
          this.campInnerPageService.GetCoachSSDetailforCamp(nsrsId,this.sportDisciplineIdToAdd.sportScienceListToSearch,coachRoleId).subscribe({
            next:(res:any)=>{
              this.loader=false
              this.dataByNsrsid=res[0]
              //console.log(this.dataByNsrsid)
              if(res.length>0){
                  this.setmultiTagFormValues(index)
              }else{
                this.alertService.swalPopWarning(`Either NSRS ID is not valid or category mapping is not correct`)
                this.resetControls(index,'ki_unique_id');              
                this.resetControls(index,'coach_name');                 
              }
            },
            error:()=>{
              console.error('error caught in athlete mapping details')
              this.loader=false
            }
          })          
        }
      }else{
        this.loader=true
      this.campInnerPageService.GetCoachSSDetailforCamp(nsrsId,this.sportDisciplineIdToAdd.sportScienceListToSearch,coachRoleId).subscribe({
        next:(res:any)=>{
          this.loader=false
          this.dataByNsrsid=res[0]
          // console.log(this.dataByNsrsid)
          if(res.length>0){
            this.setmultiTagFormValues(index)
          }else{
            this.alertService.swalPopWarning(`Either NSRS ID is not valid or category mapping is not correct`);
            this.resetControls(index,'ki_unique_id')              
            this.resetControls(index,'coach_name')              
          }
        },
        error:()=>{
          console.error('error caught in athlete mapping details')
          this.loader=false
        }
      })
      }

    }else{
      this.alertService.swalPopWarning("Please enter a NSRS ID")
      //console.log(nsrsId)
    }
  }

  resetControls(index:number,controlName:string){
    this.addMultiTagArray.controls[index].get(controlName)?.reset(); 
  }

  verifyFileSize(files:any){
    var fileSize = files[0].size
    //console.log(fileSize)
    return fileSize
  }

  verifyDocumentFileExtension(files:any){
    var fileIndex = files[0].name.lastIndexOf(".") + 1;
    var extFile = files[0].name.substr(fileIndex, files[0].name.length).toLowerCase();
    return extFile 
  }

  public uploadDocuments=(files:any,index:any)=>{
    if (files.length === 0){
      return;
    }else{
      var extFile=this.verifyDocumentFileExtension(files)
      if (extFile == "jpg" || extFile == "jpeg" || extFile == "png" || extFile == "pdf") {
        var fileSize=this.verifyFileSize(files)
        if(fileSize<=500000){
          const formData = new FormData();
          for (let i = 0; i < files.length; i++) {
            formData.append("file",files[i], files[i].name);
            formData.append("path",'data/Tempimage')
            formData.append("uploadType",'3')
          }
          //serivce calling
          this.loader = true
          this._sharableService.uploadFile(formData).subscribe({
            next: (res) => {
              this.loader = false
              this.fileUploadRes=res;
              if(this.fileUploadRes.isUploaded==true) {
                this.alertService.swalPopSuccess('File Uploaded')
                this.AddMultiTagArrayControls().controls['docPath'].setValue=this.fileUploadRes.filedataList[0].filePath
                // this.addMultiTagArray.at(index).patchValue({
                //   document_upload_path:this.fileUploadRes.filedataList[0].filePath
                // });
                this.fileUrl=this.fileUploadRes.filedataList[0].filePath;
                this.addMultiTagArray.controls[index].get('document_upload_path_url')?.setValue(this.fileUploadRes.filedataList[0].filePath);
                //console.log(this.fileUrl)
              } else {
                this.alertService.swalPopError(this.fileUploadRes.errorMsg || 'Upload Failed! Please Try Again.');
                this.addMultiTagArray.controls[index].get('docPath')?.setValue('');
                this.addMultiTagArray.controls[index].get('document_upload_path_url')?.setValue(null);
              }
            },
            error: () => {
              console.error('error caught in file uploading');
              this.addMultiTagArray.controls[index].get('docPath')?.setValue('');
              this.addMultiTagArray.controls[index].get('document_upload_path_url')?.setValue(null);
              this.loader=false;
            }
          })
        }else{
          this.alertService.swalPopError('File size must not be more than 500kb')
        }
      }
      else {
        this.alertService.swalPopWarning('Only jpg, jpeg, png, pdf file is allowed!')
      }
    }
  }

  setmultiTagFormValues(index:any){
    // this.addMultiTagArray.at(index).patchValue({
    //   coach_name:this.dataByNsrsid.first_name,
    //   academy_detail_id:this.userDetails.user_id,
    //   designation:""
    // })
    this.addMultiTagArray.at(index).patchValue({
      coach_name:this.dataByNsrsid.full_name,
      offcialDetailId:this.dataByNsrsid.official_detail_id
    });
  }

  submitMultiTagged(){   
    //console.log('dataByNsrsid',this.dataByNsrsid)
     
    if(this.multiTagForm.valid){
      //console.log(this.multiTagForm.getRawValue().addMultiTagArray);
      let formArrayValue = this.addMultiTagArray.getRawValue();
        formArrayValue.forEach((item, i) => {
        formArrayValue[i].docPath = formArrayValue[i].document_upload_path_url;
        delete formArrayValue[i].document_upload_path_url;
        delete formArrayValue[i].coach_name;
        delete formArrayValue[i].ki_unique_id;
      }
      );
      for(let i of this.multiTagForm.getRawValue().addMultiTagArray){
        i.doj=i.doj.utc('dd-MM-YYYY')
      }
      //console.log(formArrayValue)
      this.loader = true
    this.subscription =  this.campInnerPageService.saveCampOfficialDetail(this.userDetails.user_id,formArrayValue)
      .subscribe({
        next:(res:any)=>{
          //console.log(res)
          this.loader = false;
          if(res){
            this.alertService.swalPopSuccess('Saved successfully!')
            this.activeModal.close(res)
          }
        },
        error:()=>{
          console.error('error caught in AcademySportScientistMapping');
          this.loader = false
        }
      })
      
    }else{
      this.multiTagForm.markAllAsTouched()
    }
  }

  ngOnDestroy(): void {
   this.subscription?.unsubscribe();
  }

    // get basic camp details to validate 
  getBasicCampDetail() {
    this.campInnerPageService.basicCampDetail(this.userDetails.user_id).subscribe({
      next: (res: any) => {
        if (res) {
          this.minDate = new Date(res[0].from_date);
          this.maxDate = new Date(res[0].to_date);
        }
      }, error: (err) => { console.log(err); }
    })
  }
  

}
