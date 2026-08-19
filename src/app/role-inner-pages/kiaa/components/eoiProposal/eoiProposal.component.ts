import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from 'src/app/_common/material.module';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { StorageService } from 'src/app/_common/services/common-services/storage.service';
import { SharableService } from 'src/app/_common/services/innerPagesServices/innerpagesSharable.service';
import { KIAAProposalService } from 'src/app/_common/services/role-inner-pages-services/kiaaproposalservice/kiaaproposal.service';
import { LoaderComponent } from 'src/app/standalone_components/loader/loader.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-eoiProposal',
  templateUrl: './eoiProposal.component.html',
  styleUrls: ['./eoiProposal.component.css'],
  standalone:true,
  imports:[CommonModule,MaterialModule,ReactiveFormsModule,LoaderComponent]
})
export class EoiProposalComponent implements OnInit {
  
  eoiProposalData:any;
  disciplineForm!:FormGroup;
  documentsForm!:FormGroup;
  loader:Boolean=false;
  fileBaseUrl=environment.fileUrl;
  userDetails:any;
  // resdentialOptions:any=[];
  resdentialOptions:any=[
    {key:"Residential",value:"Residential"},
    {key:"Non-Residential",value:"Non-Residential"}
  ];
  mainLoader:Boolean=false;

  constructor(public _activeModal:NgbActiveModal,private _fb:FormBuilder,private _kiaaService:KIAAProposalService,
    private _sharableService:SharableService,private _alertService:AlertService,private _storageService:StorageService) { }

  ngOnInit() {
    this.userDetails=this._storageService.getUserDetails();

    this.getDisciplineByAcademy()
   
    this.disciplineForm=this._fb.group({
      disciplineItems:this._fb.array([])
    })

    this.documentsForm=this._fb.group({
      documentsItems:this._fb.array([])
    })
    // this.newAddMultiTagArray();
  }

  prefilledData:any
  getPrefilledData(){
    this.mainLoader=true;
    this._kiaaService.getEOIData(this.eoiProposalData.id).subscribe({
      next:(response:any)=>{
        
        this.prefilledData=response
        for(let i of response[0].kiaa_academydocdetail){
          this.newAddDocumentMultiTagArray(i)
        }

        // let k=0;
        for(let j of response[0].kiaa_academysportsdetail){
          this.newAddMultiTagArray(j)
          // this.sportIdChange(j.sport_detail_id,k)
          // this.resTypeChange(j.sport_detail_id,j.residential_type,k)
          // k++;
        }

        if(response[0].kiaa_academysportsdetail.length==0){
          this.newAddMultiTagArray()
          
        }
        this.mainLoader=false;
        // 
      },
      error:()=>{
        this.mainLoader=false;
      }
    })
  }

  get addMultiTagArray(): FormArray{
    return this.disciplineForm.get('disciplineItems') as FormArray
  }

  get addDocumentMultiTagArray(): FormArray{
    return this.documentsForm.get('documentsItems') as FormArray
  }

  addDisciplineForm(data:any){
    return this._fb.group({
      kiaa_sportsId: [data==undefined ? 0 : data.kiaa_sportsId=='' ? 0 : data.kiaa_sportsId,Validators.required],
      kiaaId: [data==undefined ? 0 : data.kiaaId=='' ? 0 : data.kiaaId,Validators.required],
      sport_detail_id: [data==undefined ? '' : data.sport_detail_id ,Validators.required],
      is_tops: [data==undefined ? '' : data.is_tops==true ? "1" : "0" ,Validators.required],
      ncoe_type:[data==undefined ? '' : data.ncoe_type ,Validators.required],
      academy_type: [''],
      residential_type:[data==undefined ? '' : data.residential_type ,Validators.required],
      from_date: [null],
      to_date: [null],
      approval_status: ['Pending'],
      approval_Date: [null],
      remarks: [data==undefined ? '' : data.remarks ],
      is_weededout: [false],
      weededOut_Date: [null]
    })
  }


  addDocumentsForm(data:any){
    return this._fb.group({
      kiaadocId: [data.kiaadocId],
      kiaaId: [data.kiaaId],
      doctype: [data.doctype],
      docpath: [data.docpath],
      doc_Description: [data.doc_Description],
      sortOrder: [data.sortOrder]
    })
  }

  newAddMultiTagArray(data?:any){
    if(data==undefined){
      if(this.disciplineForm.valid){
        this.addMultiTagArray.push(this.addDisciplineForm(data))
      }else{
        this.disciplineForm.markAllAsTouched();
      }

    }else{
      this.addMultiTagArray.push(this.addDisciplineForm(data))
    }
    // this.addMultiTagArray.push(this.addDisciplineForm(data))
  }

  removeAddMultiTagArray(index:any){
    this.addMultiTagArray.removeAt(index)
  }

  newAddDocumentMultiTagArray(data?:any){
    this.addDocumentMultiTagArray.push(this.addDocumentsForm(data))
  }

  removeAddDocumentMultiMultiTagArray(index:any){
    this.addDocumentMultiTagArray.removeAt(index)
  }

  disciplineArray:any=[];
  disciplineSet=new Set();
  disciplineWithTypeData:any;
  copyDisciplineWithTypeData:any=[]

  getDisciplineByAcademy(){
    this.mainLoader=false;
    this._kiaaService.getDisciplineOnAcademyId(this.eoiProposalData.academy_Detail_id,0).subscribe({
      next:(res:any)=>{
        this.disciplineWithTypeData=res
        this.copyDisciplineWithTypeData=this.disciplineWithTypeData;
        this.getPrefilledData();
        
        res.filter((sport:any)=>{
          this.disciplineSet.add(sport.sport_name)
        })
        // this.disciplineArray=Array.from(this.disciplineSet)
        for(let i of this.disciplineSet){
          for(let sp of res){
            if(sp.sport_name.toLowerCase().trim()==String(i).toLowerCase().trim()){
              this.disciplineArray.push({sport_detail_id:sp.sport_detail_id,sport_name:sp.sport_name})
              break;
            }
          }
        }
        this.mainLoader=false
      },
      error:(err:any)=>{ 
        this.mainLoader=false;
      }
    })
  }

  verifyDocumentFileExtension(files:any){
    var fileIndex = files[0].name.lastIndexOf(".") + 1;
    var extFile = files[0].name.substr(fileIndex, files[0].name.length).toLowerCase();
    return extFile 
  }
  
  verifyFileSize(files:any){
    var fileSize = files[0].size
    return fileSize
  }

  public uploadDocuments=(files:any,index:any)=>{
    if (files.length === 0){
      return;
    }else{
      var extFile=this.verifyDocumentFileExtension(files);
      if (extFile == "jpg" || extFile == "jpeg" || extFile == "png" || extFile == "pdf") {
        var fileSize=this.verifyFileSize(files);

        if(fileSize<=5242880){
          const formData = new FormData();
          for (let i = 0; i < files.length; i++) {
            formData.append("file",files[i], files[i].name);
            formData.append("path",'data/Tempimage')
            formData.append("uploadType",'3')
          }
          this.loader = true
          this._sharableService.uploadFile(formData).subscribe({
            next: (res:any) => {
              this.loader = false
              if(res.isUploaded==true) {
                this._alertService.swalPopSuccess('File Uploaded')
                this.addDocumentMultiTagArray.controls[index].get('docpath')?.setValue(res.filedataList[0].filePath);
              } else {
                this._alertService.swalPopError(res.errorMsg || 'Upload Failed! Please Try Again.');
              }
            },
            error: () => {
              this.loader=false;
            }
          })
        }else{
          this._alertService.swalPopError('File size must not be more than 5mb')
        }
      }
      else {
        this._alertService.swalPopWarning('Only jpg, jpeg, png, pdf file is allowed!')
      }
    }
  }


  // resTypeChange(sportId:any,resType:any,index:any){
  //   this.copyDisciplineWithTypeData=this.copyDisciplineWithTypeData.filter((respo:any)=>{
  //     if(respo.sport_detail_id==sportId && respo.rType==resType){
  //       // respo.rType=="Residential"
  //     }else{
  //       return respo
  //     }
  //   })
  // }



  
  // sportIdChange(sportId:any,index:any){
  //   var sportData:any=[]
    
  //   this.copyDisciplineWithTypeData.filter((res:any)=>{
  //     if(res.sport_detail_id==sportId){
  //       sportData.push(res)
  //     }
  //   })
  //   // this.copyDisciplineWithTypeData=this.copyDisciplineWithTypeData.filter((respo:any)=>respo.sport_detail_id!=sportId)
  //   if(sportData.length==2){
  //     this.resdentialOptions[index]=[
  //       {key:"Residential",value:"Residential"},
  //       {key:"Non-Residential",value:"Non-Residential"}
  //     ]
  //   }else if(sportData.length==1){
  //     if(sportData.rType=="Residential"){
  //       this.resdentialOptions[index]=[
  //         {key:"Residential",value:"Residential"},
  //       ]
  //     }else{
  //       this.resdentialOptions[index]=[
  //         {key:"Non-Residential",value:"Non-Residential"}
  //       ]
  //     }

  //   }else if(sportData.length==0){
  //     this.resdentialOptions[index]=[]
  //     this._alertService.swalPopError('Discipline Can Not Be Mapped.')
  //   }
  // }


  resdentialChange(toAddRow?:any){
    var length=this.addMultiTagArray.length;
    var indexToCheck=length-1;
    if(indexToCheck>-1){  
      if(this.disciplineForm.valid){
        if(this.addMultiTagArray.controls[indexToCheck].get('sport_detail_id')?.value==''){
          this._alertService.swalPopWarning('Please Select Discipline First.');
          return
        }
        var check=false;
        for(let i=0;i<indexToCheck;i++){
          if(this.addMultiTagArray.controls[i].get('residential_type')?.value==this.addMultiTagArray.controls[indexToCheck].get('residential_type')?.value && this.addMultiTagArray.controls[i].get('sport_detail_id')?.value==this.addMultiTagArray.controls[indexToCheck].get('sport_detail_id')?.value){
            this._alertService.swalPopWarning('Already Mapped.')
          
            this.addMultiTagArray.controls[indexToCheck].get('residential_type')?.setValue('')
            this.addMultiTagArray.markAllAsTouched();
            check=true;
            break;
          }
        }
        if(indexToCheck==0 ){
          this.newAddMultiTagArray();
        }
        if(check==false){
          this.newAddMultiTagArray();
        }
      }
    }
    // debugger
    // this.copyDisciplineWithTypeData=this.copyDisciplineWithTypeData.filter((respo:any)=>{
    //   console.log(respo)
    //   if(respo.sport_detail_id==sportId && respo.rType==resdentialStatus && respo.kiaa_SportsId==0 ){

    //   }else{
    //     this._alertService.swalPopWarning('Already Mapped')
    //     return respo
    //   }
    // })
  }

  submit(){

  if(this.disciplineForm.valid && this.documentsForm.valid){
     var payload={
      "kiaaId": this.prefilledData[0].kiaaId,
      "proposal_id": this.prefilledData[0].proposal_id,
      "proposal_No": this.prefilledData[0].proposal_No,
      "academy_id": this.prefilledData[0].academy_id,
      "userId": this.userDetails.user_id,
      "is_draft": false,
      "kiaa_academysportsdetail": this.disciplineForm.value.disciplineItems ,
      "kiaa_academydocdetail": this.documentsForm.value.documentsItems
    }

    for(let item of payload.kiaa_academysportsdetail){
      if(item.is_tops=='1') item.is_tops=true
      if(item.is_tops=='0') item.is_tops=false
    }
    this.mainLoader=true;
    this._kiaaService.saveEOI(payload).subscribe({
      next:(res:any)=>{
        this.mainLoader=false;
        this._activeModal.close({
          result:true
        })

      },
      error:(err:any)=>{
        this.mainLoader=false;
      }
    })
    }else{
      this.disciplineForm.markAllAsTouched();
      this.documentsForm.markAllAsTouched();
    }
  }


  saveAsDraft(){
    console.log(this.documentsForm.value.documentsItems)
    this.documentsForm.value.documentsItems.forEach((res:any)=>{
      if(res.doctype=='PD' && res.docpath==''){
        this._alertService.swalPopWarning('Proposal Document Required')
        // this.proposalDocumnet
      }
    })
    

    if(this.documentsForm.value.documentsItems)
    if(this.disciplineForm.valid && this.documentsForm.valid){
      var payload={
        "kiaaId": this.prefilledData[0].kiaaId,
        "proposal_id": this.prefilledData[0].proposal_id,
        "proposal_No": this.prefilledData[0].proposal_No,
        "academy_id": this.prefilledData[0].academy_id,
        "userId": this.userDetails.user_id,
        "is_draft": true,
        "kiaa_academysportsdetail": this.disciplineForm.value.disciplineItems ,
        "kiaa_academydocdetail": this.documentsForm.value.documentsItems
      }
  
      for(let item of payload.kiaa_academysportsdetail){
        if(item.is_tops=='1') item.is_tops=true
        if(item.is_tops=='0') item.is_tops=false
      }
      this.mainLoader=true;
      this._kiaaService.saveEOI(payload).subscribe({
        next:(res:any)=>{
          this.mainLoader=false;
          if(res.status){
            this._activeModal.close({
              result:true
            })
          }  
        },
        error:(err:any)=>{
          this.mainLoader=false;
        }
      })
    }else{
      this.disciplineForm.markAllAsTouched();
      this.documentsForm.markAllAsTouched();
    }
  }

}
