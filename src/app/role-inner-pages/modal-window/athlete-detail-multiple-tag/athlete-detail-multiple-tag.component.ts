import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LoaderComponent } from 'src/app/standalone_components/loader/loader.component';
import { MaterialModule } from 'src/app/_common/material.module';
import { MY_DATE_FORMATS } from 'src/app/_common/models/my_dateFormat';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { Enable_disableFormService } from 'src/app/_common/services/common-services/enable_disableForm.service';
import { StorageService } from 'src/app/_common/services/common-services/storage.service';
import { SharableService } from 'src/app/_common/services/innerPagesServices/innerpagesSharable.service';
import { AthleteDetailListService } from 'src/app/_common/services/role-inner-pages-services/academy-services/athlete-detail-list.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-athlete-detail-multiple-tag',
  templateUrl: './athlete-detail-multiple-tag.component.html',
  styleUrls: ['./athlete-detail-multiple-tag.component.css'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter},
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS}
  ],
  standalone:true,
  imports:[CommonModule,MaterialModule,ReactiveFormsModule,LoaderComponent],
  
})
export class AthleteDetailMultipleTagComponent implements OnInit {
  disciplineToAddID:any
  multiAthleteTagForm!:FormGroup
  userDetails:any
  loader:boolean=false
  getDataByNsrsId:any
  fileUploadRes:any
  fileUrl:any
  fileBaseUrl = environment.fileUrl;

  constructor(public activeModal:NgbActiveModal,private fb:FormBuilder,private aletService:AlertService,
    private athleteDetailService:AthleteDetailListService,private storageService:StorageService,
    private _sharableService:SharableService,private enableDisableService:Enable_disableFormService) { }

  ngOnInit() {
    this.userDetails=this.storageService.getAcademyDetails();
    this.multiAthleteTagForm = this.fb.group({
      addMultiTagArray:this.fb.array([])
    });

    this.addMultiTagArray.push(this.AddMultiTagArray());
  }

  get addMultiTagArray(): FormArray{
    return this.multiAthleteTagForm.get('addMultiTagArray') as FormArray
  }

  AddMultiTagArray():FormGroup{
    return this.fb.group({
      ki_unique_id:['',Validators.required],
      athelete_name:[''],
      geoLocation:['',Validators.required],
      type_of_athelete:['',Validators.required],
      joining_status:['',Validators.required],
      date_of_joining:['',Validators.required],
      valid_upto:[''],
      document_upload_path:['',Validators.required],
      document_upload_path_url:[null, Validators.required],
      sport_detail_id:[''],
      academy_detail_id:[''],
      category:[''],
      scheme:[''],
      date_of_notification:[''],
      notification_no:['']
    })
  }

  newAddMultiTagArray(){
    this.addMultiTagArray.push(this.AddMultiTagArray())
  }

  removeAddMultiTagArray(index:any){
    this.addMultiTagArray.removeAt(index)
  }

  nsrsId:any;
  duplicateCheck:boolean = false;
  changeInNsrsID(event:Event,index:any){
    this.nsrsId=(event.target as HTMLInputElement)?.value
    if(this.nsrsId!=''){
      if(this.addMultiTagArray.length > 1){
        this.duplicateCheck = false   
        for(let j=0 ; j<index; j++){
          if((this.addMultiTagArray.at(j)?.value.ki_unique_id).trim() === (this.nsrsId).trim()){
            this.duplicateCheck = true;
            break
            
          }else{
            // console.log('index',index)
            this.duplicateCheck = false
          }
        }
        if(this.duplicateCheck==true){
            //console.log("matches")
            this.addMultiTagArray.controls[index].get('ki_unique_id')?.reset()
            this.addMultiTagArray.updateValueAndValidity();
            this.aletService.swalPopWarning("Duplicate entry is detected!");
        }else if(this.duplicateCheck==false){
          this.loader=true
            this.athleteDetailService.academyAthleteGetDateByNSRSId(this.userDetails.user_id,this.nsrsId).subscribe({
              next:res=>{
                this.loader=false
                this.getDataByNsrsId=res
                //console.log(this.getDataByNsrsId)
                if(this.getDataByNsrsId[0].player_detail_id!=0){
                  this.setInputValues(index)
                }else{
                  var msg;
                  if(this.getDataByNsrsId[0].first_name==null){
                    msg=this.getDataByNsrsId[0].remark
                  }else{
                    // msg=this.getDataByNsrsId[0].remark + ' is in ' + this.getDataByNsrsId[0].first_name
                    msg=this.getDataByNsrsId[0].remark 
                  }            
                  //console.log(msg)
                  this.aletService.swalPopError(msg)
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
        this.athleteDetailService.academyAthleteGetDateByNSRSId(this.userDetails.user_id,this.nsrsId).subscribe({
          next:res=>{
            this.loader=false
            this.getDataByNsrsId=res
            //console.log(this.getDataByNsrsId)
            if(this.getDataByNsrsId[0].player_detail_id!=0){
              this.setInputValues(index)
            }else{
              var msg;
              if(this.getDataByNsrsId[0].first_name==null){
                msg=this.getDataByNsrsId[0].remark
              }else{
                // msg=this.getDataByNsrsId[0].remark + ' is in ' + this.getDataByNsrsId[0].first_name
                msg=this.getDataByNsrsId[0].remark 
              }            
              //console.log(msg)
              this.aletService.swalPopError(msg)
            }
          },
          error:()=>{
            console.error('error caught in athlete mapping details')
            this.loader=false
          }
        })
      }
    }else{
      this.aletService.swalPopWarning("Please enter a NSRSId")
      //console.log(this.nsrsId)
    }
  }

  setInputValues(index:any){ 
    this.addMultiTagArray.at(index).patchValue({
      athelete_name:this.getDataByNsrsId[0].first_name,
      doj:this.getDataByNsrsId[0].date_of_birth,
      sport_detail_id:this.getDataByNsrsId[0].sport_detail_id,
      academy_detail_id:this.userDetails.user_id,
      category:'',
      scheme:null,
      date_of_notification:'',
      notification_no:null
    });
    this.enableDisableService.DisableFieldFormArray(this.addMultiTagArray,index,'athelete_name',true)
    this.enableDisableService.DisableFieldFormArray(this.addMultiTagArray,index,'dob',true)
    // this.DisableField(index,"athelete_name",true)
    // this.DisableField(index,"dob",true)
    // this.DisableField(index,"sport",true)
  }

  // private DisableField(index:number,formControlName:string,disableVal?:boolean){
  //   this.addMultiTagArray.controls[index].get(formControlName)?.disable({onlySelf:disableVal})
  // }
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
                this.aletService.swalPopSuccess('File Uploaded')
                this.AddMultiTagArray().controls['document_upload_path'].setValue=this.fileUploadRes.filedataList[0].filePath
                // this.addMultiTagArray.at(index).patchValue({
                //   document_upload_path:this.fileUploadRes.filedataList[0].filePath
                // });
                this.fileUrl=this.fileUploadRes.filedataList[0].filePath;
                this.addMultiTagArray.controls[index].get('document_upload_path_url')?.setValue(this.fileUploadRes.filedataList[0].filePath);
                //console.log(this.fileUrl)
              } else {
                this.aletService.swalPopError(this.fileUploadRes.errorMsg || 'Upload Failed! Please Try Again.');
                this.addMultiTagArray.controls[index].get('document_upload_path')?.setValue('');
                this.addMultiTagArray.controls[index].get('document_upload_path_url')?.setValue(null);
              }
            },
            error: () => {
              console.error('error caught in file uploading');
              this.addMultiTagArray.controls[index].get('document_upload_path')?.setValue('');
              this.addMultiTagArray.controls[index].get('document_upload_path_url')?.setValue(null);
              this.loader=false;
            }
          })
        }else{
          this.aletService.swalPopError('File size must not be more than 500kb')
        }
      }
      else {
        this.aletService.swalPopWarning('Only jpg, jpeg, png, pdf file is allowed!')
      }
    }
  }

  submitMultiTagged(){
    //console.log(this.addMultiTagArray.valid)
    //console.log(this.addMultiTagArray)
    if(this.addMultiTagArray.valid){
      for(let data of this.addMultiTagArray.value){
        data.date_of_joining=data.date_of_joining.utc('dd-MM-YYYY')
        if (data.valid_upto) data.valid_upto=data.valid_upto.utc('dd-MM-YYYY')
      }
      let formArrayValue = this.addMultiTagArray.getRawValue();
      formArrayValue.forEach((item, i) => {
        formArrayValue[i].document_upload_path = formArrayValue[i].document_upload_path_url;
        delete formArrayValue[i].document_upload_path_url;
      }
      );
      this.loader=true
      this.athleteDetailService.saveAcademyAthleteData(this.userDetails.user_id,formArrayValue).subscribe({
        next:(res:any)=>{
          this.loader=false;
            this.aletService.swalPopSuccess(res.error);
            this.activeModal.close({...this.addMultiTagArray.getRawValue()});
        },
        error:()=>{
          this.aletService.swalPopError('Something went wrong! Please try again.');
          console.error('error caught in saving academy multiple athletes')
          this.loader=false
        }
      })
    }else{
      this.addMultiTagArray.markAllAsTouched()
    }
    
  }

}
