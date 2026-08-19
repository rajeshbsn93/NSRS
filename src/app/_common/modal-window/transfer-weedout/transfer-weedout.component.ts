import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { AthleteService } from '../../services/innerPagesServices/athlete.service';
import { AuthenticationService } from '../../services/innerPagesServices/authentication.service';
import {MY_DATE_FORMATS} from '../../models/my_dateFormat'
import * as moment from 'moment';
import { SharableService } from 'src/app/_common/services/innerPagesServices/innerpagesSharable.service';
import { AlertService } from '../../services/common-services/alert.service';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-transfer-weedout',
  templateUrl: './transfer-weedout.component.html',
  styleUrls: ['./transfer-weedout.component.css'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ]
})

export class TransferWeedoutComponent implements OnInit {
  athleteData: any;
  nsrs_id: any;
  userid: any;
  role_id: any;
  athletesports_id: any;
  academylist: any=[];
  academyFilterlist: any;
  editDOJdate:any
  weedoutform!: FormGroup;
  weedoutSubmitted: boolean = false;
  transferForm!: FormGroup;
  editDetails!:FormGroup
  athleteListDropdown!: FormGroup;
  weedOutRes: any;
  weedOutMsg: any;
  transferOutRes: any
  transferOutMsg: any
  selectedTeam = '';
  doj: any;
  transferDate: any;
  joiningDate: any;
  dojPresent: boolean = false;
  progress: any;
  selectedFile: any;
  academyName: boolean = false
  permissionData:any
  transferPermission:any
  weedOutPermission:any
  atheleteAcademyHistory:any
  editCurrentAcademyData:any
  editAcademydetailId:any
  editDetailsSaveApiRes:any
  transferFileUploadRes:any
  transferFileUploadUrl:any;
  staticFileUrl=environment.fileUrl
  innerLoaderMainData:boolean = false;
  innerLoaderSchemeList:boolean = false;
  innerLoaderAcademyHistory:boolean = false;

  constructor(public activeModal: NgbActiveModal, private authenticationService: AuthenticationService,
    private athleteService: AthleteService, private fb: FormBuilder,
    private sharableService:SharableService,private swalAlert:AlertService,
    private datePipe: DatePipe) { }

  ngOnInit() {

    if (this.athleteData.trainingCenter) {
      this.academyName = true;
    } else {
      this.academyName = false
    }

    this.athletesports_id = this.athleteData.sport_id;
    if (this.athleteData.date_of_joining) {
      this.dojPresent = true;
      this.doj = this.athleteData.date_of_joining
      this.doj = this.doj.split('T')[0]
      //console.log(this.doj)
    } else {
      this.dojPresent = false;
    }

    this.GetAcademyList();

    this.weedoutform = this.fb.group({
      weedOutDate: ['', Validators.required],
      weedOutReason: ['', Validators.required]
    })
    
    this.editDetails = this.fb.group({
      editNsrsid: [''],
      editAthleteName: [''],
      editSport: [''],
      editTrainingCenterName: ['',Validators.required],
      editDOJ: ['',Validators.required],
      editValidUpto: ['']
    })

    this.transferForm = this.fb.group({
      centerTypeList: ['', Validators.required],
      tranferDate: ['', Validators.required],
      joiningDate: ['', Validators.required],
      periodUpto: [''],
      athleteType: ['', Validators.required],
      joiningStatus: ['', Validators.required],
      transferDocument: ['',Validators.required]

    })
    // this.schemeList();
    this.academyHistory()
    this.setEditAcademyInput()
    // this.getPermission()
    
  }

  setEditAcademyInput(){
    this.editDetails.controls['editNsrsid'].setValue(this.athleteData.nsrsId)
    this.editDetails.controls['editAthleteName'].setValue(this.athleteData.ath_Name);
    this.innerLoaderMainData = true;
    this.athleteService.getAthleteCurrentAcademy(this.athleteData.player_detail_id).subscribe(res=>{
      // this.athleteService.getAthleteCurrentAcademy(137962).subscribe(res=>{
      this.innerLoaderMainData = false;
      //console.log(res)
      this.editCurrentAcademyData=res
      this.editDetails.controls['editSport'].setValue(this.athleteData.sport_name)
      this.editDetails.controls['editTrainingCenterName'].setValue(this.athleteData.trainingCenter)
      if(this.editCurrentAcademyData!='' && this.editCurrentAcademyData.date_of_joining!=null){
        this.editDetails.patchValue({
          editDOJ:this.editCurrentAcademyData.date_of_joining,
        })
      }
      if(this.editCurrentAcademyData!='' && this.editCurrentAcademyData.valid_upto!=null){
        this.editDetails.patchValue({
          editValidUpto:this.editCurrentAcademyData.valid_upto
        })
      }                                               
    },(error)=>{
      console.error("error caught in athlete current academy")
      this.innerLoaderMainData=false
    })

  }

  transferEditfromDate(date:any){
    this.editDOJdate=date;
    //console.log(this.editDetails.value.editDOJ)
    this.editDetails.get('editDOJ')?.setValue(this.editDetails.value.editDOJ.utc('dd-MM-yyyy'))
    //console.log(this.editDetails.value.editDOJ)
  }
  transferEditValidUpto(date:any){
    this.editDetails.get('editValidUpto')?.setValue(this.editDetails.value.editValidUpto.utc('dd-MM-yyyy'))
    //console.log(this.editDetails.value.editDOJ)
  }

  editDetailsSave(){
    //console.log(this.editDetails.value)
    //console.log(this.editDetails)
    if(this.editDetails.valid){
      this.innerLoaderMainData = true;
      this.athleteService.updateAthleteAcademy(this.editDetails.value.editDOJ,this.editDetails.value.editValidUpto,this.editCurrentAcademyData.academy_athelete_detail_id)
      .subscribe({
        next:(res)=>{
          this.innerLoaderMainData = false; 
        //console.log(res)
        this.editDetailsSaveApiRes=res
        if(this.editDetailsSaveApiRes==true){
          Swal.fire({
            position: 'center',
            icon: 'success',
            text: 'Edited Successfully',
            showConfirmButton: true,
          });
          this.activeModal.close()
        }else{
          Swal.fire({
            position: 'center',
            icon: 'success',
            text: 'Try Again!',
            showConfirmButton: true,
          });
          this.activeModal.close()
        }
        },error:(error)=>{
          console.error("error caught in update athlete academy")
          this.innerLoaderMainData=false
        }
      })
    }else{
      this.editDetails.markAllAsTouched()
    }
 
  }

  academyHistory(){
    this.innerLoaderAcademyHistory = true;
    this.athleteService.athleteHistory(this.athleteData.player_detail_id).subscribe(res=>{
      this.innerLoaderAcademyHistory = false;
      this.atheleteAcademyHistory=res
    },(error)=>{
      console.error("error caught in academy history")
      this.innerLoaderAcademyHistory=false
    })
  }

  get weedoutFormControl() {
    return this.weedoutform.controls;
  }

  GetAcademyList() {
    if (this.authenticationService.isLoggedIn()) {
      var userdetails: any = localStorage.getItem('loginUserdata')
      var userData = JSON.parse(userdetails)
      this.userid = userData.user_id
      this.role_id = userData.role_id
      this.innerLoaderMainData = true;
      this.athleteService.AcademyList(this.userid, this.role_id, this.athletesports_id).subscribe(result => {
        this.innerLoaderMainData = false;
        //console.log(this.athleteData.trainingCenter)
        this.academyFilterlist = result;
        for(let i of this.academyFilterlist){
          // console.log(i.academy_name)
          if(i.academy_name==this.athleteData.trainingCenter){

          }else{
            this.academylist.push(i)
          }
        }
      },(error)=>{
        console.error("error caught in academy list")
        this.innerLoaderMainData=false
      })
    }
  }

  weedOut() {
    this.weedoutSubmitted = true;
    if(this.weedoutform.valid){
      this.innerLoaderMainData = true;
      this.athleteService.weedOutPlayer(this.athleteData.player_detail_id, this.userid, this.role_id, this.weedoutform.value).subscribe({
        next:(res)=>{
          this.innerLoaderMainData = false;
          //console.log("athelete service data")
          //console.log(res)
          this.weedOutRes = res
          var nsrsId: any;
          for (var i = 0; i < this.academylist.length; i++) {
            if (this.academylist[i].academy_id == this.selectedTeam) {
              nsrsId = this.academylist[i].academy_nsrs_id
            }
          }
          if (this.weedOutRes.isWeedOut == true) {
            this.swalAlert.swalPopSuccess(this.weedOutRes.weedoutMsg)
            this.activeModal.close(nsrsId)
          } else {
            this.swalAlert.swalPopError(this.weedOutRes.weedoutMsg)
            this.activeModal.close()
          }
        },
        error:()=>{
          console.error('error caught in weeding player')
          this.innerLoaderMainData=false
        }
      })
    }else{
      this.weedoutform.markAllAsTouched()
    }
  }

  funcTransferDate(transDate: any) {
    //console.log("date changed")
    //console.log(transDate)
    this.transferDate = transDate
  }

  funcJoiningDate(joining: any) {
    this.joiningDate = joining
  }

  onSelected(value: string) {
    this.selectedTeam = value;
    //console.log(this.selectedTeam)
  }

  verifyDocumentFileExtension(files:any){
    var fileIndex = files[0].name.lastIndexOf(".") + 1;
    var extFile = files[0].name.substr(fileIndex, files[0].name.length).toLowerCase();
    return extFile 
  }



  transferFileUpload(files: any) {
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
          formData.append("path","documents\\UploadJoining")
          var d=3
          formData.append("uploadType","3")
          // formData.append("academy_detail_id",this.academy_detail_id)
        }
        //serivce calling
        this.innerLoaderMainData = true;
        this.sharableService.uploadFile(formData).subscribe(res=>{
          this.innerLoaderMainData = false;
          //console.log(res)
          this.transferFileUploadRes=res;
          if(this.transferFileUploadRes.isUploaded==true){
            this.swalFileUploadSuccess()
            // this.transferForm.controls['transferDocument'].setValue=this.transferFileUploadRes.filedataList[0].filePath
            //console.log(this.transferForm.value)
            this.transferFileUploadUrl=this.staticFileUrl+this.transferFileUploadRes.filedataList[0].filePath
            //console.log(this.transferFileUploadUrl)
          }else{
            var errMsg
            if(this.transferFileUploadRes.errorMsg){
              errMsg=this.transferFileUploadRes.errorMsg
            }else{
              errMsg='Failed Please Try Again!'
            }
            this.swalFileUploadError(errMsg)
          }
        },(error)=>{
          console.error("error caught in upload file")
          this.innerLoaderMainData=false
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



  pRoleId: any = 1;
  pRemark: any = "";
  transfer() {
    if(this.transferForm.valid){
      this.innerLoaderMainData = true;
      this.athleteService.transferPlayer(this.athleteData.player_detail_id, this.userid, this.role_id, this.athleteData.nsrsId, Number(this.selectedTeam), this.transferForm.value, this.transferFileUploadRes.filedataList[0].filePath).subscribe(res => {
        this.innerLoaderMainData = false;
        this.transferOutRes = res;
        //console.log("transferOutRes response")
        //console.log(this.transferOutRes)
        if (this.transferOutRes.isTransfer == true) {
          //console.log("athlate data");
          //console.log(this.athleteData);
          this.activeModal.close(this.athleteData.nsrsId)
          Swal.fire({
            position: 'center',
            icon: 'success',
            text: 'Transfered',
            showConfirmButton: true,
            //timer: 1500
          });
        } else {
          this.transferOutMsg = this.transferOutRes.transferMsg
          Swal.fire({
            position: 'center',
            icon: 'error',
            text: "Not Transfered",
            showConfirmButton: false,
            timer: 1500
          });
        }
  
      },(error)=>{
        console.error("error caught in transfer player")
        this.innerLoaderMainData=false
      })

    }else{
      this.transferForm.markAllAsTouched()
    }
  }
  // schemeListData: any = []

  // schemeList() {
  //   this.innerLoaderSchemeList = true
  //   this.athleteService.getScheme().subscribe(res => {
  //     this.innerLoaderSchemeList = false
  //     console.log("my response", res)
  //     this.schemeListData = res;
  //   },(error)=>{
  //     console.error("error caught in scheme list")
  //     this.innerLoaderSchemeList=false
  //   })
  // }
}
