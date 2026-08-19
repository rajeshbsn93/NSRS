import { Component, inject, OnInit } from '@angular/core';
import { CommonModule,DatePipe,Location } from "@angular/common";
import { YpCommonPopupComponent } from '../yp-common-popup/yp-common-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { YoungProfessionalService } from 'src/app/_common/services/young-professional/young-professional.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { StorageService } from 'src/app/_common/services/common-services/storage.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { environment } from 'src/environments/environment';
declare var Digio:any
@Component({
  selector: 'app-process-form5',
  templateUrl: './process-form5.component.html',
  styleUrls: ['./process-form5.component.css']
})
export class ProcessForm5Component implements OnInit {
  dialog = inject(MatDialog);
  form5Id!: number;
  playerDetailID!: number;
  userDetails:any
  htmlContent!: SafeHtml;
  form5TextDeatil!:any
  approverList:any=[]
  form5StageDetails:any=[]
  form5StatusForm!: FormGroup
  isLoading:Boolean=false
  isEsignDisable:boolean=true
  fileUrl=environment.fileUrl
  constructor(
    private location: Location,
    private sanitizer: DomSanitizer,
    private youngProfessionalService:YoungProfessionalService,
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private storageService:StorageService,
    private fb: FormBuilder,
    private swalAlert:AlertService,
    private datePipe: DatePipe
  ){}

  ngOnInit(): void {
    this.userDetails=this.storageService.getAcademyDetails();
    this.activatedRoute.params.subscribe(params => {
      this.form5Id = +params['form5Id'];
      this.playerDetailID = +params['playerDetailID']; 
      this.createForm()
       this.getFormFiveTextDetail()
       this.getFormFiveApproverList()
       this.getFormFiveform5StageDetails()
    });
  
  }

  getFormFiveTextDetail(){
    this.isLoading=true
  this.youngProfessionalService.getFormFiveTextDetail(this.form5Id, this.playerDetailID).subscribe({
        next: (res:any) => {
          if(res){
            this.htmlContent = this.sanitizer.bypassSecurityTrustHtml(res[0]?.form5html);
            this.form5TextDeatil=res[0]
            this.isLoading=false
          }
         
        },
        error: (error) => {
          this.isLoading=false
          this.swalAlert.swalPopError('Something Went Wrong. Please Try Again!!')
        },
      });
 } 


 getFormFiveApproverList(){
  this.isLoading=true
  this.youngProfessionalService.getFormFiveApproverList(this.form5Id).subscribe({
        next: (res:any) => {
          if(res){
              this.approverList=res
              this.isLoading=false
          }
         
        },
        error: (error) => {
          this.isLoading=false
          this.swalAlert.swalPopError('Something Went Wrong. Please Try Again!!')
        },
      });
 }

  openDialog() {
    const dialogRef = this.dialog.open(YpCommonPopupComponent, {
      data: {
        type:'rejectPopup',
        nsrsid: this.form5TextDeatil?.nsrsid,
      },
    });

    dialogRef.afterClosed().subscribe(result => {
        if(result?.isRejected){
          this.savePlayerForm5Status('rejected')
        }
    });
  }

  savePlayerForm5Status(type:string){
    this.isLoading=true
    let payLoad:any={
      form5Id: this.form5Id,
      form5Html:this.form5TextDeatil?.form5html,
      place:this.form5StatusForm.value.place,
      approveDate: this.form5TextDeatil?.approvaldate,
      form5_Status: type=='approved'? (+this.form5StatusForm.value.form5_Status) :  (type==='eSign' ? 60:5) ,
      remark: this.form5StatusForm.value.remark,
      userId: this.userDetails?.user_id,
      esignedby: 0,
      form5DocPath: ""
    }

    this.youngProfessionalService.savePlayerForm5Status(payLoad).subscribe({
          next: (res:any) => {
            if(res?.status==1){
              this.isLoading=false
                      if(type ==='rejected'){
                         this.openDilogPopup(type,res?.error)
                      }else{
                        if(type ==='eSign'){
                            this.navigateTo(this.form5TextDeatil?.competitionname,'approved')
                            this.swalAlert.swalPopSuccess(res?.error)
                              
                        }else{
                          this.navigateTo(this.form5TextDeatil?.competitionname,type)
                          this.swalAlert.swalPopSuccess(res?.error)
                        }
                       
                      }
            
            }
          },
          error: (error) => {
            this.isLoading=false
          this.swalAlert.swalPopError('Something Went Wrong. Please Try Again!!')
          },
        });
   }


   eSignForm5(){
    this.isLoading=true
    this.youngProfessionalService.generateEsignPdf(this.form5Id, this.playerDetailID).subscribe({
          next: (res:any) => {
            if(res?.access_token){
                 let urlPath=this.fileUrl+res?.FilePath
                //  this.triggerDownload(urlPath)
                this.initializeDigio(res?.access_token?.entity_id ,res?.signing_parties[0]?.identifier ,res?.access_token?.id);
                //  this.navigateTo(this.form5TextDeatil?.competitionname,'approved')
                this.isLoading=false
            }
            this.isLoading=false
          },
          error: (error) => {
            this.isLoading=false
            this.swalAlert.swalPopError('Something Went Wrong. Please Try Again!!')
          },
        });
   }

   initializeDigio(entityId:string,identifier:string,id:string) {
 
    var options = {
      environment : environment.envDigioType,
      callback : (response:any)=>{
      if(response.hasOwnProperty("error_code")){
       this.swalAlert.swalPopError('Something Went Wrong. Please Try Again!!')
      }else{
                 this.downloadEsignForm(response)
      }
      },
      logo : "https://nsrs.kheloindia.gov.in/assets/images/Logo6.svg", 
      theme : {
      primaryColor : "#1F60AB",
      secondaryColor : "#000000"
      }
      }
      
      var digio = new Digio(options)
      digio.init()
      digio.submit(entityId,identifier,id)
      this.isLoading=true
       
  }




   navigateTo(competitionName:string,type:string){
    // this.router.navigate(['/yp/form5', competitionName,type]);
    this.router.navigate(['/yp/form5',type]);
   }

   createForm(){
   this.form5StatusForm = this.fb.group({
      place: ['', Validators.required],
      remark:  [''],
      form5_Status: ['', Validators.required],
 
    });
    this.toggleRequired()
   }

   toggleRequired() {
    
    const nameControl = this.form5StatusForm.get('form5_Status');
    if (nameControl) {
      if ((nameControl.hasValidator(Validators.required) && this.router.url.includes('reject'))) {
        nameControl.clearValidators(); // Remove required validation
      } else {
        nameControl.setValidators(Validators.required); 
   
      }
      nameControl.updateValueAndValidity(); // Update validity state
    }
  }
   
   getFormFiveform5StageDetails(){
    this.isLoading=true
    this.youngProfessionalService.getFormFiveform5StageDetails(this.form5Id).subscribe({
          next: (res:any) => {
            if(res){
                this.form5StageDetails=res
                this.isLoading=false
            }
          },
          error: (error) => {
            this.isLoading=false
            this.swalAlert.swalPopError('Something Went Wrong. Please Try Again!!')
          },
        });
   }


   goBack(){
    this.location.back();
  }

  openDilogPopup(type:string,msg:string) {
    const dialogRef = this.dialog.open(YpCommonPopupComponent, {
      data: {
        type:'showRejectedMsg',
        msg:msg
      },
    });

    dialogRef.afterClosed().subscribe(result => {
        if(result?.navigateTo === 'rejected'){
          this.navigateTo(this.form5TextDeatil?.competitionname,type)
        }
    });
  }

  placeChange(){
    this.form5StatusForm.value.remark
    if(this.form5StatusForm.value.form5_Status){
         this.isEsignDisable=true
    }else{
      this.isEsignDisable=false
    }
 
  }

  downloadEsignForm(successRes:any){
    this.isLoading=true
    this.youngProfessionalService.downloadEsignPdf(this.form5Id, this.playerDetailID,successRes?.digio_doc_id).subscribe({
          next: (res:any) => {
            if(res?.FilePath){
                 let urlPath=this.fileUrl+res?.FilePath
                 this.triggerDownload(urlPath)
                // this.navigateTo(this.form5TextDeatil?.competitionname,'approved')
                this.isLoading=false
            }
          },
          error: (error) => {
            this.isLoading=false
            this.swalAlert.swalPopError('Something Went Wrong. Please Try Again!!')
          },
        });
  }

  triggerDownload(url: string) {
    this.savePlayerForm5Status('eSign')
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.download = 'downloaded.pdf'; // Set the desired filename
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url); // Clean up the blob URL
  }


}
