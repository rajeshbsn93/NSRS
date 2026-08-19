import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { AthleteService } from '../../services/innerPagesServices/athlete.service';
import { AuthenticationService } from '../../services/innerPagesServices/authentication.service';
import { FinancialService } from '../../services/innerPagesServices/financial.service';
import { MY_DATE_FORMATS } from '../../models/my_dateFormat'
import { SharableService } from '../../services/innerPagesServices/innerpagesSharable.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-coach-academy',
  templateUrl: './coach-academy.component.html',
  styleUrls: ['./coach-academy.component.css'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ]
})
export class CoachAcademyComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal,
    private athleteService: AthleteService,
    private fb: FormBuilder,
    private authenticationService: AuthenticationService,
    private _coachSscShareableService: SharableService,) { }

  coachData: any;
  sportsScientistData: any;
  transferCoachSportsScientistForm!: FormGroup;
  WeedoutCoachSportsScientistForm!: FormGroup;
  menuName: any;
  userid: any;
  role_id: any;
  coachSportsId: any;
  sportsScientistSportId: any;
  designationsList: any;
  academylist: any=[];
  academyListLength:any
  transfer_pRoleId: any;
  transfer_pNSRS_Id: any;
  transfer_pUserId: any;
  weedOut_pRoleId: any;
  weedOut_pUserId: any;
  coachPermissionData: any;
  sscPermissionData: any
  coachAcademyHistory:any
  coachInsuranceFileUrl:any
  coachInsuranceFileRes:any
  menuNameforotherCoach:any;
  innerLoaderMainData:boolean = false;
  innerLoaderDesignation:boolean = false;
  innerLoaderInsuranceHistory:boolean = false;
  staticFileUrl=environment.fileUrl;
  coachForeignExposureData: any=[];
  transferPopupDetail:any

  ngOnInit() {
    //console.log("my element data from coach component", this.coachData)
    //console.log("my element data from sports scientist component", this.sportsScientistData)
    // if (this.menuName == "coachAcademy") {
    //   console.log("coach permission data", this.coachPermissionData)
    // }
    // if (this.menuName == "sportsScientistAcademy") {
    //   console.log("sports scientist  permission data", this.sscPermissionData)
    // }

    this.transferCoachSportsScientistForm = this.fb.group({
      sportsTrainingCenterTypeId: ['', Validators.required],
      transferDate: ['', Validators.required],
      dateOfJoining: ['',],
      designation: [''],
      document: ['', Validators.required]
    })
    if (this.menuName === 'coachAcademy')
      this.transferCoachSportsScientistForm.get('designation')?.setValidators(Validators.required);
    this.WeedoutCoachSportsScientistForm = this.fb.group({
      weedoutDate: ['', Validators.required],
      weedoutReason: ['', Validators.required]
    });

    this.GetAcademyList();
    if (this.menuName === 'coachAcademy') this.getDesignationsList();
    this.coachInsuranceHistory()
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

  public coachInsuranceFileUpload=(files:any)=>{
    if (files.length === 0){
      this.transferCoachSportsScientistForm.get('document')?.setValue('')
      return;
    }else{
      var extFile=this.verifyDocumentFileExtension(files)
      if (extFile == "jpg" || extFile == "jpeg" || extFile == "png" || extFile == "pdf") {
      // if (extFile == "pdf") {
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
          formData.append("file",files[i], files[i].name);
          formData.append("path","documents\\InsuranceDoc_officials")
          formData.append("uploadType","3")
        }
        //serivce calling
        this.innerLoaderMainData = true;
        this._coachSscShareableService.uploadFile(formData).subscribe(res=>{
          this.innerLoaderMainData = false;
          //console.log(res)
          this.coachInsuranceFileRes=res;
          if(this.coachInsuranceFileRes.isUploaded==true){
            this.swalFileUploadSuccess()
            // this.transferCoachSportsScientistForm.controls['document'].setValue=this.coachInsuranceFileRes.filedataList[0].filePath
            this.coachInsuranceFileUrl=this.staticFileUrl+this.coachInsuranceFileRes.filedataList[0].filePath
            //console.log(this.coachInsuranceFileUrl)
          }else{
            var errMsg
            if(this.coachInsuranceFileRes.errorMsg){
              errMsg=this.coachInsuranceFileRes.errorMsg
            }else{
              errMsg='Failed Please Try Again!'
            }
            this.swalFileUploadError(errMsg)
            this.transferCoachSportsScientistForm.get('document')?.setValue('')
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
        this.transferCoachSportsScientistForm.get('document')?.setValue('')
      }
      
      
    }
  }
  
  menuRoleId:any
  coachInsuranceHistory(){
   
    
    if (this.menuName == 'coachAcademy') {
      this.innerLoaderInsuranceHistory = true;
      this._coachSscShareableService.getCoachSportScientistHistory(this.coachData.official_detail_id,2).subscribe(res=>{
        this.innerLoaderInsuranceHistory = false;
        //console.log(res)
        this.coachAcademyHistory = res;
      },(error)=>{
        console.error("error caught in coach sportscientist history")
        this.innerLoaderInsuranceHistory=false
      })
    }
    if (this.menuName == 'sportsScientistAcademy') {
      this.innerLoaderInsuranceHistory = true;
      this._coachSscShareableService.getCoachSportScientistHistory(this.sportsScientistData.official_detail_id,103).subscribe(res=>{
        this.innerLoaderInsuranceHistory = false;
        //console.log(res)
        this.coachAcademyHistory = res;
      },(error)=>{
        //console.log("error caught in coach sportscientist history")
        this.innerLoaderInsuranceHistory=false
      })
    }
    if (this.menuName == 'otherCoach') {
      this.innerLoaderInsuranceHistory = true;
      this._coachSscShareableService.getCoachSportScientistHistory(this.coachData.official_detail_id,2).subscribe(res=>{
        this.innerLoaderInsuranceHistory = false;
        //console.log(res)
        this.coachAcademyHistory = res;
      },(error)=>{
        console.error("error caught in coach sportscientist history")
        this.innerLoaderInsuranceHistory=false
      })
    }
    // if (this.menuName == 'otherCoach') {
    //   this.menuRoleId=2
    // }

    
  }
  //dont let user type anything in input (input type="date")

  getDesignationsList() {
    let value = "coach";
    this.innerLoaderDesignation = true;
    this._coachSscShareableService.getDesignation(value)
      .subscribe(res => {
        this.innerLoaderDesignation = false;
        this.designationsList = res;
        //console.log("Designations List", this.designationsList);
      })
  }

  filterTransferTrainingCenter(list:any,academyName:any){
    var filteredAcademyList:any=[]
    for(let i of list){
      if(i.academy_name==academyName){

      }else{
        filteredAcademyList.push(i)
      }
    }
    return filteredAcademyList
  }

  GetAcademyList() {
    if (this.authenticationService.isLoggedIn()) {
      var userdetails: any = localStorage.getItem('loginUserdata');
      var userData = JSON.parse(userdetails);
      this.userid = userData.user_id;
      this.role_id = userData.role_id;

      if (this.menuName == 'coachAcademy') {
        //console.log(this.coachData)
        this.coachSportsId = this.coachData.sport_id;
        this.innerLoaderMainData = true;
        this.athleteService.AcademyList(this.userid, this.role_id, this.coachSportsId).subscribe(result => {
          this.innerLoaderMainData = false;
          this.academylist=this.filterTransferTrainingCenter(result,this.coachData.academy_name);
          this.academyListLength=this.academylist.length
          //console.log(this.academyListLength)
        },(error)=>{
          console.error("error caught in academy list")
          this.innerLoaderMainData=false
        })
      } 
      if (this.menuName == 'sportsScientistAcademy') {
        this.sportsScientistSportId = 0;
        this.innerLoaderMainData = true;
        this.athleteService.AcademyList(this.userid, this.role_id, this.sportsScientistSportId).subscribe(result => {
          this.innerLoaderMainData = false;
          this.academylist=this.filterTransferTrainingCenter(result,this.sportsScientistData.academy_name);
          this.academyListLength=this.academylist.length
        },(error)=>{
          console.error("error caught in academy list")
          this.innerLoaderMainData=false
        })
      }

      if (this.menuName == 'otherCoach') {
        //console.log("otherCoach")
        this.coachSportsId = this.coachData.sport_id;
        this.innerLoaderMainData = true;
        this.athleteService.AcademyList(this.userid, this.role_id, this.coachSportsId).subscribe(result => {
          this.innerLoaderMainData = false;
          this.academylist=this.filterTransferTrainingCenter(result,this.coachData.academy_name);
          this.academyListLength=this.academylist.length
        },(error)=>{
          console.error("error caught in academy list")
          this.innerLoaderMainData=false
        })
      } 
    }
  }

  transferRes: any
  //tranfer coach and sports scientist academy
  transferCoachAndSportsScientistAcademy() {
    if(this.transferCoachSportsScientistForm.valid){
      if (this.menuName == 'coachAcademy' || this.menuName=="otherCoach") {
        this.transfer_pRoleId = 2;
        this.transfer_pNSRS_Id = this.coachData.kitd_unique_id;
        this.transfer_pUserId = this.coachData.official_detail_id;
      }
      if (this.menuName == 'sportsScientistAcademy') {
        this.transfer_pRoleId = 103;
        this.transfer_pNSRS_Id = this.sportsScientistData.kitd_unique_id;
        this.transfer_pUserId = this.sportsScientistData.official_detail_id;
      }
      let pStakeHolderUserId = this.userid;
      let pStakeHolderRoleId = this.role_id
      let pTo_academyid = this.transferCoachSportsScientistForm.value.sportsTrainingCenterTypeId;
      let pTransfer_date = this.transferCoachSportsScientistForm.value.transferDate.utc('dd-MM-YYYY');
      let pDate_of_joining = this.transferCoachSportsScientistForm?.value?.dateOfJoining !=="" ? this.transferCoachSportsScientistForm.value.dateOfJoining.utc('dd-MM-YYYY') : null;
      let pStatus = "";
      let pJoin_status = 0
      let pDoc = this.coachInsuranceFileRes.filedataList[0].filePath;
      let pPeriod_upto = null;
      let pRemark = "";
      let pDesignation = this.transferCoachSportsScientistForm.value.designation;
      this.innerLoaderMainData = true;
      this._coachSscShareableService.coachSportsscientistTransfer(
        this.transfer_pUserId,
        this.transfer_pRoleId,
        pStakeHolderUserId,
        pStakeHolderRoleId,
        this.transfer_pNSRS_Id,
        pTo_academyid,
        pTransfer_date,
        pDate_of_joining,
        pStatus,
        pJoin_status,
        pDoc,
        pPeriod_upto,
        pRemark,
        pDesignation
      )
        .subscribe(res => {
          this.innerLoaderMainData = false;
          this.transferRes = res
          //console.log("transferRes", this.transferRes);
          if (this.transferRes.isTransfer === true) {
            this.activeModal.close();
            Swal.fire({
              position: 'center',
              icon: 'success',
              text: `TRANSFERRED SUCCESFULLY`,
              showConfirmButton: true
            });
          } else {
            this.activeModal.close();
            Swal.fire({
              position: 'center',
              icon: 'error',
              text: "SOMETHING WENT WRONG!! PLEASE TRY AGAIN",
              showConfirmButton: true
            });
          }
        },(error)=>{
          console.error("error caught in coach sportscientist transfer")
          this.innerLoaderMainData=false
        })
    }else{
      this.transferCoachSportsScientistForm.markAllAsTouched()
    }
  }

  weedOutResponse: any
  //weed-out for coach and sports scientist academy
  weedOutCoachAndSportsScientistAcademy() {
    if(this.WeedoutCoachSportsScientistForm.valid){
      if (this.menuName == 'coachAcademy' || this.menuName=="otherCoach") {
        this.weedOut_pRoleId = 2;
        this.weedOut_pUserId = this.coachData.official_detail_id;
      }
      if (this.menuName == 'sportsScientistAcademy') {
        this.weedOut_pRoleId = 103;
        this.weedOut_pUserId = this.sportsScientistData.official_detail_id;
      }
      let pStakeHolderUserId = this.userid;
      let pStakeHolderRoleId = this.role_id;
      let pWeedOutDate = this.WeedoutCoachSportsScientistForm.value.weedoutDate.utc('dd-MM-YYYY');
      let pWeedOutRemark = this.WeedoutCoachSportsScientistForm.value.weedoutReason;
      this.innerLoaderMainData = true;
      this._coachSscShareableService.coachSportsscientistWeedOut(
        this.weedOut_pUserId,
        this.weedOut_pRoleId,
        pStakeHolderUserId,
        pStakeHolderRoleId,
        pWeedOutDate,
        pWeedOutRemark
      )
        .subscribe(res => {
          this.innerLoaderMainData = false;
          this.weedOutResponse = res;
          // this.weedOutresMessage = this.weedOutResponse.weedoutMsg
          //console.log(this.weedOutResponse);
          if (this.weedOutResponse.isWeedOut === true) {
            this.activeModal.close();
            Swal.fire({
              position: 'center',
              icon: 'success',
              text: this.coachData.full_name+' Weeded Out',
              showConfirmButton: true
            });
          } else {
            this.activeModal.close();
            Swal.fire({
              position: 'center',
              icon: 'error',
              text: "SOMETHING WENT WRONG!! PLEASE TRY AGAIN",
              showConfirmButton: true
            });
          }
        },(error)=>{
          console.error("error caught in coach sportscientist weedout")
          this.innerLoaderMainData=false
        })
    }else{
      this.WeedoutCoachSportsScientistForm.markAllAsTouched()
    }

    
  }

  getHistoryData(){
    this.innerLoaderMainData =true
    this._coachSscShareableService.getCoachForeignExposure(this.coachData.official_detail_id).subscribe(result => {
           this.coachForeignExposureData=result
           this.innerLoaderMainData =false
    },
    (error)=>{
      this.activeModal.close();
      Swal.fire({
        position: 'center',
        icon: 'error',
        text: "SOMETHING WENT WRONG!! PLEASE TRY AGAIN",
        showConfirmButton: true
      });
      this.innerLoaderMainData = false;
    })
  }
}
