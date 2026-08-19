import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { DomSanitizer } from "@angular/platform-browser";
import { AngularEditorConfig, AngularEditorModule } from "@kolkov/angular-editor";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { first } from "rxjs";
import { MaterialModule } from "src/app/_common/material.module";
import { AlertService } from "src/app/_common/services/common-services/alert.service";
import { Enable_disableFormService } from "src/app/_common/services/common-services/enable_disableForm.service";
import { StorageService } from "src/app/_common/services/common-services/storage.service";
import { SharableService } from "src/app/_common/services/innerPagesServices/innerpagesSharable.service";
import { AthleteSuccessStoryService } from "src/app/_common/services/role-inner-pages-services/athlete-services/athlete-success-story.service";
import { LoaderComponent } from "src/app/standalone_components/loader/loader.component";
import { environment } from "src/environments/environment";
import Swal from "sweetalert2";


@Component({
    selector:'app-athlete-success-story',
    templateUrl:'./athlete-success-story.component.html',
    styleUrls:['./athlete-success-story.component.css'],
    standalone:true,
    imports:[CommonModule,MaterialModule,ReactiveFormsModule,LoaderComponent,AngularEditorModule ]
})
export class AthleteSuccessStoryComponent implements OnInit{
    storyFormReadonlyEdit:boolean = true
    actionPhotoFormReadonlyEdit:boolean = true
    videoLinkReadonlyEdit:boolean = true
    storyForm!:FormGroup;
    actionPhotoForm!:FormGroup;
    videorForm!:FormGroup;
    userDetails:any;
    loader:boolean = false;
    photoUploadRes1:any;
    photoUploadUrl1:any
    photoUploadRes2:any;
    photoUploadUrl2:any
    photoUploadRes3:any;
    photoUploadUrl3:any
    photoUploadRes4:any;
    photoUploadUrl4:any;
    urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
    fileBaseUrl = environment.fileUrl;

    constructor(public activeModal:NgbActiveModal,private formBuilder:FormBuilder,private enableDisableService:Enable_disableFormService,
      private storageService:StorageService,private alertService:AlertService,private sharableService:SharableService,
      private athleteSuccessStoryService:AthleteSuccessStoryService,private _sanitizer: DomSanitizer){}

// kolkov editor configuration
editorConfig: AngularEditorConfig = {
  editable: true,
  spellcheck: true,
  height: '15rem',
  minHeight: '5rem',
  placeholder: 'Enter Success Story Here...',
  translate: 'no',
  sanitize:false,
  // defaultParagraphSeparator: 'p',
  // defaultFontName: 'Arial',
  toolbarHiddenButtons: [
    ['insertVideo','insertImage','toggleEditorMode',]
    ],  
};
    ngOnInit(): void {
      this.userDetails=this.storageService.getUserDetails()
      //console.log(this.userDetails)
        this.reactiveForm();
        this.setFormValues()
    }
    reactiveForm(){
        this.storyForm=this.formBuilder.group({
          description_detail:['',],
        })
        this.actionPhotoForm=this.formBuilder.group({
          photo_link1:['',],
            photo_link2:['',],
            photo_link3:[''],
            photo_link4:['',],
        })
        this.videorForm=this.formBuilder.group({
          video_link1:['',[Validators.pattern(this.urlRegex)]],
          video_link2:['',[Validators.pattern(this.urlRegex)]],
          video_link3:['',[Validators.pattern(this.urlRegex)]],
        })
      }
video1Link:any
      setFormValues(){
        this.loader = true
        this.athleteSuccessStoryService.playermediamanage(this.userDetails.user_id).pipe(first()).subscribe({
          next:(response:any)=>{
            this.loader=false
            //console.log(response)
            if(response !=null){
              this.storyForm.controls['description_detail'].setValue(response?.description_detail);
              this.photoUploadUrl1 = response?.photo_link1
              this.photoUploadUrl2 = response?.photo_link2
              this.photoUploadUrl3 = response?.photo_link3
              this.photoUploadUrl4 = response?.photo_link4
              this.videorForm.controls['video_link1'].setValue(response?.video_link1);
              // console.log((response?.video_link1).split('v=')[1].split('&')[0])
              // this.video1Link = this._sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${(response?.video_link1).split('v=')[1].split('&')[0]}`)
              this.videorForm.controls['video_link2'].setValue(response?.video_link2);
              this.videorForm.controls['video_link3'].setValue(response?.video_link3);
              this.editorConfig.editable = false;
              this.editorConfig.showToolbar = false;
              this.storyForm.disable();
              this.actionPhotoForm.disable();
              this.videorForm.disable();
            }else{
              this.editorConfig.editable = false;
              this.editorConfig.showToolbar = false;
              this.storyForm.disable();
              this.actionPhotoForm.disable();
              this.videorForm.disable();
            }

          },
          error:()=>{
            this.loader = false
            console.error('Caught in GetAthletePersonalInfo API')
          }
        })
        
      }

      verifyDocumentFileExtension(files:any){
        var fileIndex = files[0].name.lastIndexOf(".") + 1;
        var extFile = files[0].name.substr(fileIndex, files[0].name.length).toLowerCase();
        return extFile 
      }
      swalFileUploadSuccess(){
        Swal.fire({
          position: 'center',
          icon: 'success',
          text: `File Uploaded`,
          showConfirmButton: false,
          timer:1500
        });
      }
      
      swalFileUploadError(errMsg:any){
        Swal.fire({
          position: 'center',
          icon: 'error',
          text: errMsg,
          showConfirmButton: false,
          timer:1500
        });
      }

      photoUpload1(files: any) {
        //console.log(files)
        if (files.length === 0){
          return;
        }else{
          var extFile=this.verifyDocumentFileExtension(files)
          if (extFile == "jpg" || extFile == "jpeg" || extFile == "png" || extFile == "pdf") {
          // if (extFile == "pdf") {
            const formData = new FormData();
            for (let i = 0; i < files.length; i++) {
              formData.append("file",files[i], files[i].name);
              formData.append("path","Tempimage")
              var d=3
              formData.append("uploadType","3")
              // formData.append("academy_detail_id",this.academy_detail_id)
            }
            //serivce calling
            this.loader = true;
            this.sharableService.uploadFile(formData).subscribe({
              next:res=>{
                this.loader = false;
                //console.log(res)
                this.photoUploadRes1=res;
                if(this.photoUploadRes1.isUploaded==true){
                  this.swalFileUploadSuccess()
                  // this.documentForm.controls['photo1'].setValue=this.photoUploadRes1.filedataList[0].filePath
                  this.photoUploadUrl1=this.photoUploadRes1.filedataList[0].filePath
                  //console.log(this.photoUploadUrl1)
                }else{
                  var errMsg
                  if(this.photoUploadRes1.errorMsg){
                    errMsg=this.photoUploadRes1.errorMsg
                  }else{
                    errMsg='Failed Please Try Again!'
                  }
                  this.swalFileUploadError(errMsg)
                }
              },
              error:(error)=>{
                console.error("error caught in upload file")
                this.loader=false
              }
            })
    
          } 
          else {
            Swal.fire({
              icon: 'error',
              // title: 'Oops...',
              text: 'Only jpg, jpeg, png, pdf file is allowed!',
            })
          }
          
          
        }
      }  
      photoUpload2(files: any) {
        //console.log(files)
        if (files.length === 0){
          return;
        }else{
          var extFile=this.verifyDocumentFileExtension(files)
          if (extFile == "jpg" || extFile == "jpeg" || extFile == "png" || extFile == "pdf") {
          // if (extFile == "pdf") {
            const formData = new FormData();
            for (let i = 0; i < files.length; i++) {
              formData.append("file",files[i], files[i].name);
              formData.append("path","Tempimage")
              var d=3
              formData.append("uploadType","3")
              // formData.append("academy_detail_id",this.academy_detail_id)
            }
            //serivce calling
            this.loader = true;
            this.sharableService.uploadFile(formData).subscribe({
              next:res=>{
                this.loader = false;
                //console.log(res)
                this.photoUploadRes2=res;
                if(this.photoUploadRes2.isUploaded==true){
                  this.swalFileUploadSuccess()
                  // this.documentForm.controls['photo2'].setValue=this.photoUploadRes2.filedataList[0].filePath
                  this.photoUploadUrl2=this.photoUploadRes2.filedataList[0].filePath
                  //console.log(this.photoUploadUrl2)
                }else{
                  var errMsg
                  if(this.photoUploadRes2.errorMsg){
                    errMsg=this.photoUploadRes2.errorMsg
                  }else{
                    errMsg='Failed Please Try Again!'
                  }
                  this.swalFileUploadError(errMsg)
                }
              },
              error:(error)=>{
                console.error("error caught in upload file")
                this.loader=false
              }
            })
    
          } 
          else {
            Swal.fire({
              icon: 'error',
              // title: 'Oops...',
              text: 'Only jpg, jpeg, png, pdf file is allowed!',
            })
          }
          
          
        }
      } 
      photoUpload3(files: any) {
        //console.log(files)
        if (files.length === 0){
          return;
        }else{
          var extFile=this.verifyDocumentFileExtension(files)
          if (extFile == "jpg" || extFile == "jpeg" || extFile == "png" || extFile == "pdf") {
          // if (extFile == "pdf") {
            const formData = new FormData();
            for (let i = 0; i < files.length; i++) {
              formData.append("file",files[i], files[i].name);
              formData.append("path","Tempimage")
              var d=3
              formData.append("uploadType","3")
              // formData.append("academy_detail_id",this.academy_detail_id)
            }
            //serivce calling
            this.loader = true;
            this.sharableService.uploadFile(formData).subscribe({
              next:res=>{
                this.loader = false;
                //console.log(res)
                this.photoUploadRes3=res;
                if(this.photoUploadRes3.isUploaded==true){
                  this.swalFileUploadSuccess()
                  // this.documentForm.controls['photo3'].setValue=this.photoUploadRes3.filedataList[0].filePath
                  this.photoUploadUrl3=this.photoUploadRes3.filedataList[0].filePath
                  //console.log(this.photoUploadUrl3)
                }else{
                  var errMsg
                  if(this.photoUploadRes3.errorMsg){
                    errMsg=this.photoUploadRes3.errorMsg
                  }else{
                    errMsg='Failed Please Try Again!'
                  }
                  this.swalFileUploadError(errMsg)
                }
              },
              error:(error)=>{
                console.error("error caught in upload file")
                this.loader=false
              }
            })
    
          } 
          else {
            Swal.fire({
              icon: 'error',
              // title: 'Oops...',
              text: 'Only jpg, jpeg, png, pdf file is allowed!',
            })
          }
          
          
        }
      }
      photoUpload4(files: any) {
        //console.log(files)
        if (files.length === 0){
          return;
        }else{
          var extFile=this.verifyDocumentFileExtension(files)
          if (extFile == "jpg" || extFile == "jpeg" || extFile == "png" || extFile == "pdf") {
          // if (extFile == "pdf") {
            const formData = new FormData();
            for (let i = 0; i < files.length; i++) {
              formData.append("file",files[i], files[i].name);
              formData.append("path","Tempimage")
              var d=3
              formData.append("uploadType","3")
              // formData.append("academy_detail_id",this.academy_detail_id)
            }
            //serivce calling
            this.loader = true;
            this.sharableService.uploadFile(formData).subscribe({
              next:res=>{
                this.loader = false;
                //console.log(res)
                this.photoUploadRes4=res;
                if(this.photoUploadRes4.isUploaded==true){
                  this.swalFileUploadSuccess()
                  // this.documentForm.controls['photo4'].setValue=this.photoUploadRes4.filedataList[0].filePath
                  this.photoUploadUrl4=this.photoUploadRes4.filedataList[0].filePath
                  //console.log(this.photoUploadUrl4)
                }else{
                  var errMsg
                  if(this.photoUploadRes4.errorMsg){
                    errMsg=this.photoUploadRes4.errorMsg
                  }else{
                    errMsg='Failed Please Try Again!'
                  }
                  this.swalFileUploadError(errMsg)
                }
              },
              error:(error)=>{
                console.error("error caught in upload file")
                this.loader=false
              }
            })
    
          } 
          else {
            Swal.fire({
              icon: 'error',
              // title: 'Oops...',
              text: 'Only jpg, jpeg, png, pdf file is allowed!',
            })
          }
          
          
        }
      }
      editStory(){
        this.editorConfig.editable = !this.editorConfig.editable;
        this.storyFormReadonlyEdit = !this.storyFormReadonlyEdit;
        this.editorConfig.showToolbar = true;
      }
      editPhoto(){
        this.actionPhotoForm.enable();
        this.actionPhotoFormReadonlyEdit = !this.actionPhotoFormReadonlyEdit;
      }
      editVideo(){
        // this.enableDisableService.enableField(this.videorForm,'name',true)
        this.videorForm.enable();
        this.videoLinkReadonlyEdit = !this.videoLinkReadonlyEdit;
      }
      saveStory(){    
        this.storyForm.enable();    
        if(this.storyForm.valid){
            this.storyForm.value.player_detail_id = this.userDetails.user_id;
          this.storyForm.value.photo_link1 = '';
          this.storyForm.value.photo_link2 = '';
          this.storyForm.value.photo_link3 = '';
          this.storyForm.value.photo_link4 = '';
          this.storyForm.value.video_link1 = '';
          this.storyForm.value.video_link2 = '';
          this.storyForm.value.video_link3 = '';
          //console.log(this.storyForm.value)
          this.editorConfig.editable = !this.editorConfig.editable;
          this.storyFormReadonlyEdit = !this.storyFormReadonlyEdit;
          this.athleteSuccessStoryService.savePlayerMediaInfo(this.storyForm.value).subscribe({
            next:(response)=>{
              //console.log(response);
              this.alertService.swalPopSuccess('Save Successfully!');
              this.activeModal.close();
            }
          })
          
        }else{
          this.storyForm.markAllAsTouched()
        }
      }
      savePhoto(){
        //console.log(this.actionPhotoForm.value)      
        if(this.actionPhotoForm.valid){
          this.actionPhotoFormReadonlyEdit = !this.actionPhotoFormReadonlyEdit;
          this.actionPhotoForm.value.player_detail_id = this.userDetails.user_id;
          this.actionPhotoForm.value.description_detail = '';
          this.actionPhotoForm.value.video_link1 = '';
          this.actionPhotoForm.value.video_link2 = '';
          this.actionPhotoForm.value.video_link3 = '';
          if(this.photoUploadRes1 !=undefined){
            this.actionPhotoForm.value.photo_link1  =this.photoUploadRes1.filedataList[0].filePath;
          }else if(this.photoUploadUrl1 !=null)this.actionPhotoForm.value.photo_link1 = this.photoUploadUrl1;
          if(this.photoUploadRes2 !=undefined){
            this.actionPhotoForm.value.photo_link2  =this.photoUploadRes2.filedataList[0].filePath;
          }else if(this.photoUploadUrl2 !=null)this.actionPhotoForm.value.photo_link2 = this.photoUploadUrl2;
          if(this.photoUploadRes3 !=undefined){
            this.actionPhotoForm.value.photo_link3  =this.photoUploadRes3.filedataList[0].filePath;
          }else if(this.photoUploadUrl3 !=null)this.actionPhotoForm.value.photo_link3 = this.photoUploadUrl3;
          if(this.photoUploadRes4 !=undefined){
            this.actionPhotoForm.value.photo_link4  =this.photoUploadRes4.filedataList[0].filePath;
          }else if(this.photoUploadUrl4 !=null)this.actionPhotoForm.value.photo_link4 = this.photoUploadUrl4;

          this.athleteSuccessStoryService.savePlayerMediaInfo(this.actionPhotoForm.value).subscribe({
            next:(response)=>{
              //console.log(response);
              this.alertService.swalPopSuccess('Save Successfully!');
              this.activeModal.close();
            }
          })
          
        }else{
          this.actionPhotoForm.markAllAsTouched()
        }
    }
    saveVideo(){
      //console.log(this.videorForm.value)      
      if(this.videorForm.valid){
        this.videoLinkReadonlyEdit = !this.videoLinkReadonlyEdit;
        this.videorForm.value.player_detail_id = this.userDetails.user_id;
        this.videorForm.value.description_detail = '';
        this.videorForm.value.photo_link1 = '';
        this.videorForm.value.photo_link2 = '';
        this.videorForm.value.photo_link3 = '';
        this.videorForm.value.photo_link4 = '';
        this.athleteSuccessStoryService.savePlayerMediaInfo(this.videorForm.value).subscribe({
          next:(response)=>{
            //console.log(response);
            this.alertService.swalPopSuccess('Save Successfully!');
            this.activeModal.close();
          }
        })
        
      }else{
        this.videorForm.markAllAsTouched();
      }
    }

}