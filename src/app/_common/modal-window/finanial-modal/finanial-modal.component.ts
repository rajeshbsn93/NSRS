import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { AlertService } from '../../services/common-services/alert.service';
import { AthleteService } from '../../services/innerPagesServices/athlete.service';
import { FinancialService } from '../../services/innerPagesServices/financial.service';
import { SharableService } from '../../services/innerPagesServices/innerpagesSharable.service';
import { StorageService } from '../../services/common-services/storage.service';
import { environment } from 'src/environments/environment';


export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  },
};

export interface PeriodicElement {
  scholorType: string;
  periodTo: string;
  periodFrom: string;
  transfterDate: string;
  status: string;
  remark: string;
  document: string
}

// const ELEMENT_DATA: PeriodicElement[] = [
//   { scholorType: 'Developmental', periodTo: '13-10-2022', periodFrom: '15-10-2022', transfterDate: '15-10-2022', status: 'transfer', remark: 'uguu kljkjl', document: 'hjgfffhg' },
// ];
// const ELEMENT_DATA2: PeriodicElement[] = [
//   { scholorType: 'Developmental', periodTo: '13-10-2022', periodFrom: '15-10-2022', transfterDate: '15-10-2022', status: 'transfer', remark: 'uguu kljkjl', document: 'hjgfffhg' },
// ];


@Component({
  selector: 'app-finanial-modal',
  templateUrl: './finanial-modal.component.html',
  styleUrls: ['./finanial-modal.component.css'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ]
})
export class FinanialModalComponent implements OnInit {
  scholorTypeDefaultVal: any;
  EditNominatedByDefaultVal: any
  athleteData: any;
  userDetails:any
  athletesports_id: any;
  weedoutform!: FormGroup;
  TranferScholarTypeForm!: FormGroup;
  transferOutRes: any
  // academyName: boolean = false;
  // todayDate: Date = new Date;
  addDetailsForm!: FormGroup;
  // disabledScholarType: boolean = false;
  player_detail_id: any;
  scholarship_type_id: any;
  editScholarType!: FormGroup;
  schemeListData: any;
  indexOfSelectedItem: any;
  financialModalPermissionData: any;
  editPermission: any;
  transferPermission: any;
  weedOutPermission: any;
  viewHistoryPermission: any;
  addPermission: any;
  menuIdForFinancialModal: any;
  finanicialTransferFileUrl:any
  finanicialUploadTransferFileRes:any
  // EditfinanicialFileUrl:any
  staticFileUrl=environment.fileUrl
  EditfinanicialFileRes:any;
  innerLoaderMainData:boolean = false;
  innerLoaderSchemeList:boolean = false;
  innerLoaderFinancialHistory:boolean = false;

  constructor(public activeModal: NgbActiveModal,private athleteService: AthleteService,
    private fb: FormBuilder,private financialService: FinancialService,private _sharableService: SharableService,
    private alertService:AlertService,private storageService:StorageService) { }

  ngOnInit() {
    //console.log("menuIdForFinancialModal", this.menuIdForFinancialModal);
    // get userData from localStorage
    // this.editScholarType.controls['nominatedBy'].patchValue("hello")
    this.userDetails=this.storageService.getUserDetails()

    this.player_detail_id = this.athleteData.player_detail_id;
    this.athletesports_id = this.athleteData.sport_id;

    this.weedoutReactiveForm()
    this.editScholarForm()
    this.addDetailsReactiveForm()   

    //Tranfer ScholarType form details
    this.TranferScholarTypeForm = this.fb.group({
      TnominatedBy: ['', Validators.required],
      TscholorshipType: ['', Validators.required],
      Tamount: ['', Validators.required],
      TfromDate: ['', Validators.required],
      TtoDate: [null],
      Tdocument: ['', Validators.required]
    })
    this.schemeList();
    this.nominatedListNew();
    this.financialHistory();

    this.scholorTypeDefaultVal = this.athleteData.scholarship_type;
    ////console.log("dropdownOption", this.dropdownOption);
    // this.financialComponentPermission();
  }

  editScholarForm(){
    this.editScholarType = this.fb.group({
      nominatedBy: ['', Validators.required],
      scholorshipType: ['', Validators.required],
      amount: ['', Validators.required],
      fromDate: ['', Validators.required],
      toDate: [null],
      // transferDocument: ['', Validators.required]
    })
  }

  //add Details form details
  addDetailsReactiveForm(){
    this.addDetailsForm = this.fb.group({
      ADnominatedBy: ['', Validators.required],
      ADscholorshipType: ['', Validators.required],
      ADamount: [''],
      ADfromDate: [null, Validators.required],
      ADtoDate: [null],
      ADdocument: ['']
    })
  }

  //weedout form details
  weedoutReactiveForm(){
    this.weedoutform = this.fb.group({
      weedOutDate: ['', Validators.required],
      weedOutReason: ['', Validators.required]
    })
  }

  get weedoutFormControl() {
    return this.weedoutform.controls;
  }
  get fromDateFormControl() {
    return this.addDetailsForm.controls
  }




  //get scholarship type list
  schemeList() {
    this.innerLoaderSchemeList = true;
    this.athleteService.getScheme().subscribe({
      next:(res)=>{
        //console.log(res);
        //console.log('nazim testing schemalist');
        this.innerLoaderSchemeList = false;
        this.schemeListData = res;
      },
      error:()=>{
        console.error("error caught in scheme list")
        this.innerLoaderSchemeList=false
      }
    })
  }

  // financialComponentPermission() {
  //   this._sharableService.getpermission(this.role_id, this.menuIdForFinancialModal)
  //     .subscribe(res => {
  //       this.financialModalPermissionData = res;
  //       //console.log("financialModalPermissionData", this.financialModalPermissionData);
  //       for (let i of this.financialModalPermissionData) {
  //         if (i.action_name == 'Create') {
  //           this.addPermission = i.isactive;
  //           // this.addPermission=false;
  //           //console.log("addPermission", this.addPermission);
  //         }
  //         if (i.action_name == 'Edit') {
  //           this.editPermission = i.isactive;
  //           // this.editPermission=false;
  //           //console.log("editPermission", this.editPermission);
  //         }
  //         if (i.action_name == 'Transfer') {
  //           this.transferPermission = i.isactive;
  //           // this.transferPermission=false;
  //           //console.log("transferPermission", this.transferPermission);
  //         }
  //         if (i.action_name == 'Weed Out') {
  //           this.weedOutPermission = i.isactive;
  //           // this.weedOutPermission=false;
  //           ////console.log("weedOutPermission", this.weedOutPermission);
  //         }
  //         if (i.action_name == 'History View') {
  //           this.viewHistoryPermission=i.isactive;
  //           // this.viewHistoryPermission = false;
  //           //console.log("viewHistoryPermission", this.viewHistoryPermission);
  //         }
  //       }
  //     });

  // }

  //set amount according to scholorship type scheme on add section
  schemeListchangeFuncAddScholar(event: any) {
    //console.log(event.value);
    //console.log("schemelistchangefuncaddScholar")
    this.scholarship_type_id = event.value;
    if(this.scholarship_type_id==1){
      this.addDetailsForm.controls["ADamount"].setValue(50000);


    }else if(this.scholarship_type_id==2){
      this.addDetailsForm.controls["ADamount"].setValue(25000);

    }else if(this.scholarship_type_id==3){
      this.addDetailsForm.controls["ADamount"].setValue(10000);
    }else if(this.scholarship_type_id==4){
      this.addDetailsForm.controls["ADamount"].setValue(2500);
    }
    else{
      //console.log("value null");
    }
    //  this.addDetailsForm.controls["ADamount"].setValue(event.value.amount);
  };

  //set amount according to scholorship type scheme on transfer section
  schemeListchangeFuncTransferScholar(event: any) {
    this.scholarship_type_id = event.value;
    const selectedScheme = this.schemeListData.filter((item: any) => item.id === event.value)[0]
    this.TranferScholarTypeForm.controls["Tamount"].setValue(selectedScheme.amount);
    if (selectedScheme.scholarship_type == this.athleteData.scholarship_type) {
      this.alertService.swalPopError("Can not transfer to same scholarship type!")
      this.TranferScholarTypeForm.controls["TscholorshipType"].reset();
      this.TranferScholarTypeForm.controls["Tamount"].reset();
    }
  };

  //set amount according to scholorship type scheme on edit section
  schemeListchangeFuncEditScholar(event: any) {
    this.scholarship_type_id = event.value;
    if(this.scholarship_type_id==1){
      this.editScholarType.controls["amount"].setValue(50000);


    }else if(this.scholarship_type_id==2){
      this.editScholarType.controls["amount"].setValue(25000);

    }else if(this.scholarship_type_id==3){
      this.editScholarType.controls["amount"].setValue(10000);
    }else if(this.scholarship_type_id==4){
      this.editScholarType.controls["amount"].setValue(2500);
    }
    else{
      //console.log("value null");
    }
    // this.editScholarType.controls["amount"].setValue(event.value.amount);
  };

  setScholarshipTypeId() {
    // this.indexOfSelectedItem = event.target["selectedIndex"] - 1;
    // this.addDetailsForm.controls["ADamount"].setValue(this.schemeListData[this.indexOfSelectedItem].amount);
    // ////console.log("index (id)", this.indexOfSelectedItem);
    // ////console.log("id (id)", this.schemeListData[this.indexOfSelectedItem].id);
    this.scholarship_type_id = 3;
    // ////console.log("scholarship_type_id (id)",this.scholarship_type_id);
  };

  // set value to scholarshit type and amount if user select TIDC as nominated by
  AddScholarTypeDefaultVal: any
  nomminatedbyChngFuncAdd(event :any) {
    //console.log(event);
    //console.log("event nazim");
    if (this.addDetailsForm.controls['ADnominatedBy'].value == '1') {
      // this.setScholarshipTypeId();
      this.AddScholarTypeDefaultVal = this.schemeListData[0];
      this.addDetailsForm.controls["ADamount"].setValue(this.schemeListData[0].amount);
        this.addDetailsForm.controls["ADscholorshipType"].setValue(this.schemeListData[0].id);
        this.scholarship_type_id=this.schemeListData[0].id;
      
    }
    else if (this.addDetailsForm.controls['ADnominatedBy'].value == '2') {
      // this.setScholarshipTypeId();
      this.AddScholarTypeDefaultVal = this.schemeListData[2];
      this.addDetailsForm.controls["ADamount"].setValue(this.schemeListData[2].amount);
        this.addDetailsForm.controls["ADscholorshipType"].setValue(this.schemeListData[2].id);
        this.scholarship_type_id=this.schemeListData[2].id;
      
    }else if (this.addDetailsForm.controls['ADnominatedBy'].value == '3') {
      // this.setScholarshipTypeId();
      this.AddScholarTypeDefaultVal = this.schemeListData[1];
      this.addDetailsForm.controls["ADamount"].setValue(this.schemeListData[1].amount);
        this.addDetailsForm.controls["ADscholorshipType"].setValue(this.schemeListData[1].id);
        this.scholarship_type_id=this.schemeListData[1].id;
      
    }
    else {
      this.addDetailsForm.controls["ADscholorshipType"].reset();
      this.addDetailsForm.controls["ADamount"].reset();
    }
  }
  nomminatedbyChngFuncEdit(event :any) {
    if (this.editScholarType.controls['nominatedBy'].value == '1') {
      // this.setScholarshipTypeId();
      this.AddScholarTypeDefaultVal = this.schemeListData[0];
      this.editScholarType.controls["amount"].setValue(this.schemeListData[0].amount);
      this.editScholarType.controls["scholorshipType"].setValue(this.schemeListData[0].id);
      this.scholarship_type_id=this.schemeListData[0].id
      
    }
    else if (this.editScholarType.controls['nominatedBy'].value == '2') {
      // this.setScholarshipTypeId();
      this.AddScholarTypeDefaultVal = this.schemeListData[2];
      this.editScholarType.controls["amount"].setValue(this.schemeListData[2].amount);
      this.editScholarType.controls["scholorshipType"].setValue(this.schemeListData[2].id);
      this.scholarship_type_id=this.schemeListData[2].id
      
    }else if (this.editScholarType.controls['nominatedBy'].value == '3') {
      // this.setScholarshipTypeId();
      this.AddScholarTypeDefaultVal = this.schemeListData[1];
      this.editScholarType.controls["amount"].setValue(this.schemeListData[1].amount);
      this.editScholarType.controls["scholorshipType"].setValue(this.schemeListData[1].id);
      this.scholarship_type_id=this.schemeListData[1].id
      
    }else if (this.editScholarType.controls['nominatedBy'].value == '4') {
      // this.setScholarshipTypeId();
      this.AddScholarTypeDefaultVal = this.schemeListData[3];
      this.editScholarType.controls["amount"].setValue(this.schemeListData[3].amount);
      this.editScholarType.controls["scholorshipType"].setValue(this.schemeListData[3].id);
      this.scholarship_type_id=this.schemeListData[3].id
    }
    else {
      this.editScholarType.controls["scholorshipType"].reset();
      this.editScholarType.controls["amount"].reset();
    }
  }

  transferNominatedByChange(event :any) {
    if (this.TranferScholarTypeForm.controls['TnominatedBy'].value == '1') {
      // this.setScholarshipTypeId();
      this.AddScholarTypeDefaultVal = this.schemeListData[0];
      this.TranferScholarTypeForm.controls['Tamount'].setValue(this.schemeListData[0].amount);
      this.TranferScholarTypeForm.controls['TscholorshipType'].setValue(this.schemeListData[0].id);
      this.scholarship_type_id=this.schemeListData[0].id; 
    }
    else if (this.TranferScholarTypeForm.controls['TnominatedBy'].value == '2') {
      // this.setScholarshipTypeId();
      this.AddScholarTypeDefaultVal = this.schemeListData[2];
      this.TranferScholarTypeForm.controls['Tamount'].setValue(this.schemeListData[2].amount);
      this.TranferScholarTypeForm.controls['TscholorshipType'].setValue(this.schemeListData[2].id);
      this.scholarship_type_id=this.schemeListData[2].id;
      
    }else if (this.TranferScholarTypeForm.controls['TnominatedBy'].value == '3') {
      // this.setScholarshipTypeId();
      this.AddScholarTypeDefaultVal = this.schemeListData[1];
      this.TranferScholarTypeForm.controls['Tamount'].setValue(this.schemeListData[1].amount);
      this.TranferScholarTypeForm.controls['TscholorshipType'].setValue(this.schemeListData[1].id);
      this.scholarship_type_id=this.schemeListData[1].id;
      
    }else if (this.TranferScholarTypeForm.controls['TnominatedBy'].value == '4') {
      // this.setScholarshipTypeId();
      this.AddScholarTypeDefaultVal = this.schemeListData[3];
      this.TranferScholarTypeForm.controls['Tamount'].setValue(this.schemeListData[3].amount);
      this.TranferScholarTypeForm.controls['TscholorshipType'].setValue(this.schemeListData[3].id);
      this.scholarship_type_id=this.schemeListData[3].id;
    }
    else {
      this.TranferScholarTypeForm.controls['TscholorshipType'].reset();
      this.TranferScholarTypeForm.controls['Tamount'].reset();
    }
    const selectedScheme = this.schemeListData.filter((item: any) => item.id === this.scholarship_type_id)[0];
    if (selectedScheme.scholarship_type == this.athleteData.scholarship_type) {
      this.alertService.swalPopError("Can not transfer to same scholarship type!")
      this.TranferScholarTypeForm.controls["TscholorshipType"].reset();
      this.TranferScholarTypeForm.controls["Tamount"].reset();
    }
  }

  getLookUpItemsArray: any;
  nomnatedByNewArray: Array<any> = [];
  nominatedListNew() {
    this.innerLoaderMainData = true;
    this.athleteService.getLookUpItems().subscribe({
      next:(res:any)=>{
        //console.log(res);
    // ((res: any) => {
      this.innerLoaderMainData = false;
      this.getLookUpItemsArray = res;
      // //console.log("getLookUpItemsArray",this.getLookUpItemsArray);
      for (let i = 0; i < res.length; i++) {
        if (res[i].lookup_name == "Nominated_By") {
          this.nomnatedByNewArray.push(this.getLookUpItemsArray[i]);
          // //console.log(res[i]);
        };
      }
    },
    error:(error)=>{
      // console.error("error caught in nominated list")
      this.innerLoaderMainData=false
    }
  });
}

  EditScholarTypeDefaultVal: any
  setDefaultInputValues() {
    //console.log(this.currentHistoryObject)

    if (this.currentHistoryObject)
      this.editScholarType.controls['amount']?.patchValue(this.currentHistoryObject.amount);
 

    if (this.financialHistoryResponse.length > 0) {
      this.editScholarType.patchValue({
        fromDate: moment(this.currentHistoryObject.start_date),
        toDate: this.currentHistoryObject.end_date? moment(this.currentHistoryObject.end_date):null

        // scholorshipType:moment(this.currentHistoryObject.scholarship_type),
        // amount:moment(this.currentHistoryObject.amount),
        // nominatedBy:moment(this.currentHistoryObject.nominated_by_id),
      });

      // //console.log(this.currentHistoryObject.scholarship_type);
      // //console.log(this.schemeListData);
      for (var i of this.schemeListData) {
        // //console.log(i.id);
        //console.log('setValue', i)
        if (i.scholarship_type == this.currentHistoryObject.scholarship_type) {
          this.EditScholarTypeDefaultVal = i;
          //console.log(this.EditScholarTypeDefaultVal);
          this.editScholarType.get('nominatedBy')?.setValue(this.currentHistoryObject.nominated_by_id?.toString());
          this.editScholarType.get('scholorshipType')?.setValue(this.currentHistoryObject.scholoship_type_id);
          // console.log(this.editScholarType.get('scholorshipType'));
          //  console.log(this.nomnatedByNewArray);  
          //  console.log(this.athleteData)
      //  if(this.athleteData)  
      //     this.nomminatedbyChngFuncEdit({value:this.athleteData.scholarship_Id});
        
          // //console.log(this.EditScholarTypeDefaultVal);
        }
      };
      // //console.log(this.nomnatedByNewArray);
      for (var i of this.nomnatedByNewArray) {
        // //console.log(i.id);
        if (i.lookup_value == this.currentHistoryObject.nominated_by_id) {
          // this.EditNominatedByDefaultVal = i.lookup_value;
          // this.editScholarType.controls['nominatedBy'].patchValue()
          // //console.log(this.EditNominatedByDefaultVal);
        }
      }
    }
  }


  //function for add ascolar on NO button
  AddNewScholarType() {
    let opt_Type = 1;
    let weedout_date = null;
    let weedout_reason = null;
    let fileNotRequired = "";
    let nominated_by_id = Number(this.addDetailsForm.controls["ADnominatedBy"].value);
    var ADfromDate=this.addDetailsForm.controls["ADfromDate"].value
    ADfromDate=ADfromDate.utc('dd-MM-YYYY')
    var ADtodate=this.addDetailsForm.controls["ADtoDate"].value;
    if(this.addDetailsForm.controls["ADtoDate"].value != null || ''){
      ADtodate=ADtodate.utc('dd-MM-YYYY')
    }
    var ADamount=this.addDetailsForm.controls["ADamount"].value
    //ADamount=ADamount.utc('dd-MM-YYYY')
    if(this.addDetailsForm.valid){
      this.innerLoaderMainData = true;
      this.financialService.addTransferWeedoutFinancialAssistance(this.userDetails.user_id,opt_Type,this.player_detail_id,
        this.scholarship_type_id,ADfromDate,ADtodate,ADamount,fileNotRequired,nominated_by_id,
        weedout_date,weedout_reason,
      ).subscribe({
        next:(res)=>{
          this.innerLoaderMainData = false;
          this.transferOutRes = res;
          ////console.log(this.transferOutRes)
          if (this.transferOutRes == true) {
            this.activeModal.close();
            this.alertService.swalPopSuccess(`ADDED SUCCESFULLY ( ${this.athleteData.nsrsId} )`)
          }else {
            this.alertService.swalPopErrorTimer('SOMETHING WENT WRONG!! PLEASE TRY AGAIN')
          }
          this.activeModal.close();
        },
        error:()=>{
          console.error("error caught in add new scholar type")
          this.innerLoaderMainData=false
        }
      })
    }else{
      this.addDetailsForm.markAllAsTouched()
      //console.log(this.addDetailsForm)
    }
  }
  changeTransferfromDate(date:any){
    this.TranferScholarTypeForm.get('TfromDate')?.setValue(this.TranferScholarTypeForm.value.TfromDate.utc('dd-MM-yyyy'))
  }
  changeTransferTtoDate(date:any){
    this.TranferScholarTypeForm.get('TtoDate')?.setValue(this.TranferScholarTypeForm.value.TtoDate.utc('dd-MM-yyyy'))
  }

  //function for transfer scholar type
  transferScholarType() {
    let opt_Type = 2;
    let weedout_date = null;
    let weedout_reason = null;
    let nominated_by_id = Number(this.TranferScholarTypeForm.controls["TnominatedBy"].value);
    //console.log(this.finanicialUploadTransferFileRes.filedataList[0].filePath)
    var fromDate=this.TranferScholarTypeForm.controls["TfromDate"].value
    //fromDate=fromDate.utc('dd-MM-YYYY')
    var toDate=this.TranferScholarTypeForm.controls["TtoDate"].value
    //toDate=toDate.utc('dd-MM-YYYY')
    if(this.TranferScholarTypeForm.valid){
      this.innerLoaderMainData = true;
      

      this.financialService.addTransferWeedoutFinancialAssistance(this.userDetails.user_id,opt_Type,
        this.player_detail_id,this.scholarship_type_id,fromDate,toDate,this.TranferScholarTypeForm.controls["Tamount"].value,
        this.finanicialUploadTransferFileRes.filedataList[0].filePath,nominated_by_id,weedout_date,
        weedout_reason).subscribe({
          next:(res)=>{
            this.innerLoaderMainData = false;
            this.transferOutRes = res;
            ////console.log(this.transferOutRes)
            if (this.transferOutRes == true) {
              this.alertService.swalPopSuccess(`TRANSFERRED SUCCESFULLY ( ${this.athleteData.nsrsId} )`)         
            } else {
              this.alertService.swalPopErrorTimer("SOMETHING WENT WRONG!! PLEASE TRY AGAIN")
            }
            this.activeModal.close();
          },
          error:()=>{
            console.error("error caught in transfer scholar type")
            this.innerLoaderMainData=false
          }
        })
    }else{
      this.TranferScholarTypeForm.markAllAsTouched()
      //console.log(this.TranferScholarTypeForm)
    }
  }

  //function for weed out from financial assistance
  weedOutScholarType() {
    let opt_Type = 3;
    let weedout_date = this.weedoutform.value.weedOutDate;
    weedout_date=weedout_date.utc('dd-MM-YYYY')
    let weedout_reason = this.weedoutform.value.weedOutReason;
    let fileNotRequired = null;
    let nominated_by_id = 0;
    let scholarship_type_id = 0
    let start_date = null;
    let end_date = null;
    let amount = 0;
    if(this.weedoutform.valid){
      this.innerLoaderMainData = true;
      this.financialService.addTransferWeedoutFinancialAssistance(this.userDetails.user_id,opt_Type,
        this.player_detail_id,scholarship_type_id,start_date,end_date,amount,fileNotRequired,nominated_by_id,
        weedout_date,weedout_reason).subscribe({
          next:(res)=>{
            this.innerLoaderMainData = false;
            this.transferOutRes = res;
            ////console.log(this.transferOutRes);
            if (this.transferOutRes == true) {
              this.alertService.swalPopSuccessTimer(`WEED-OUT SUCCESSFULLY ( ${this.athleteData.nsrsId} )`)
              this.activeModal.close();
            } else {
              this.alertService.swalPopErrorTimer("SOMETHING WENT WRONG!! PLEASE TRY AGAIN")
              this.activeModal.close();
            }
          },
          error:()=>{
            console.error("error caught in weedout scholar")
            this.innerLoaderMainData=false
          }
        })
    }else{
      this.weedoutform.markAllAsTouched()
      //console.log(this.weedoutform)
    }    
  }

  editRes: any
  editFinancialAssistance() {
    let nominated_by_id = Number(this.editScholarType.controls["nominatedBy"].value)
    var fromDate=this.editScholarType.controls["fromDate"].value
    fromDate=fromDate.utc('dd-MM-YYYY')
    var toDate=this.editScholarType.controls["toDate"].value
    
    toDate=toDate ? toDate.utc('dd-MM-YYYY'):null;

    if(this.editScholarType.valid){


this.scholarship_type_id=this.editScholarType.controls['scholorshipType'].value;
      this.innerLoaderMainData = true;
      this.financialService.EditFinancialAssistance(this.player_detail_id,this.scholarship_type_id,
        fromDate,toDate,this.editScholarType.controls["amount"].value,nominated_by_id,
        this.currentHistoryObject.scholorship_givenby_id,
      ).subscribe({
        next:(res)=>{
          this.innerLoaderMainData = false;
          this.editRes = res;
          if (this.editRes == true) {
            this.activeModal.close(this.athleteData.nsrsId)
            this.alertService.swalPopSuccess(`EDITED SUCCESFULLY ( ${this.athleteData.nsrsId} )`)
          } else {
            this.alertService.swalPopErrorTimer(`SOMETHING WENT WRONG!! PLEASE TRY AGAIN`)
            this.activeModal.close();
          }
        },
        error:()=>{
          console.error("error caught in edit financial assistance")
          this.innerLoaderMainData=false
        }
      })
    }else{
      this.editScholarType.markAllAsTouched()
      //console.log(this.editScholarType)
    }
  }

  financialHistoryResponse: any;
  financialHistoryArrayLength: any;
  financialHistoryNewArray: any;
  financialHistoryNewArrayLength: any;
  currentHistoryObject: any
  financialHistory() {
    this.innerLoaderFinancialHistory = true;
    this.financialService.getFinancialAssitanceHistory(this.player_detail_id).subscribe({
      next:(res)=>{
        this.innerLoaderFinancialHistory = false;
        this.financialHistoryResponse = res;
         //console.log("financialHistoryResponse",this.financialHistoryResponse);
        this.financialHistoryArrayLength = this.financialHistoryResponse.length;
        this.financialHistoryNewArray = this.financialHistoryResponse.slice().splice(1);
        this.financialHistoryNewArrayLength = this.financialHistoryNewArray.length;
        // //console.log("financialHistoryNewArray",this.financialHistoryNewArray);
        this.currentHistoryObject = this.financialHistoryResponse[0];
        // //console.log("currentHistoryObject", this.currentHistoryObject);

        // const ELEMENT_DATA: PeriodicElement[] = this.financialHistoryNewArray;
        // this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
        // const ELEMENT_DATA2: PeriodicElement[] = this.financialHistoryResponse;
        // this.dataSource2 = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA2);
        this.setDefaultInputValues();
      },
      error:()=>{
        console.error("error caught in financial history")
        this.innerLoaderFinancialHistory=false
      }
    })
  }

  verifyDocumentFileExtension(files:any){
    var fileIndex = files[0].name.lastIndexOf(".") + 1;
    var extFile = files[0].name.substr(fileIndex, files[0].name.length).toLowerCase();
    return extFile 
  }

  public uploadEditFile = (files: any) => {
    if (files.length === 0){
      return;
    }else{
      var extFile=this.verifyDocumentFileExtension(files)    
      //   if (extFile == "jpg" || extFile == "jpeg" || extFile == "png" || extFile == "pdf") {
      if (extFile == "pdf") {
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
          formData.append("file",files[i], files[i].name);
          formData.append("path",'documents/ScholarshipTransfer')
          formData.append("uploadType",'3')
        }
        this.innerLoaderMainData = true;
        this._sharableService.uploadFile(formData).subscribe(res=>{
          this.innerLoaderMainData = false;
          //console.log(res)
          this.EditfinanicialFileRes=res;
          if(this.EditfinanicialFileRes.isUploaded==true){
          }else{
            var errMsg
            if(this.EditfinanicialFileRes.errorMsg){
              errMsg=this.EditfinanicialFileRes.errorMsg
            }else{
              errMsg='Failed Please Try Again!'
            }
            this.alertService.swalPopError(errMsg)
          }
        },()=>{
          console.error("error caught in file upload")
          this.innerLoaderMainData=false
        })
      } 
      else {
        this.alertService.swalPopError('Only PDF file is allowed!')
      }
    }
  }

  public uploadTransferFile = (files: any) => {
    if (files.length === 0){
      return;
    }else{
      //console.log("files",files)
      var extFile=this.verifyDocumentFileExtension(files)    
        if (extFile == "jpg" || extFile == "jpeg" || extFile == "png" || extFile == "pdf") {
      // if (extFile == "pdf") {
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
          formData.append("file",files[i], files[i].name);
          formData.append("path",'documents/ScholarshipTransfer')
          formData.append("uploadType",'3')
          // formData.append("academy_detail_id","fhhd")
        }
        this.innerLoaderMainData = true;
        this._sharableService.uploadFile(formData).subscribe({
          next:(res)=>{
            this.innerLoaderMainData = false;
            this.finanicialUploadTransferFileRes=res;
            if(this.finanicialUploadTransferFileRes.isUploaded==true){
              this.alertService.swalPopSuccessTimer("File Uploaded")
              this.TranferScholarTypeForm.controls['Tdocument'].setValue=this.finanicialUploadTransferFileRes.filedataList[0].filePath
              this.finanicialTransferFileUrl=this.staticFileUrl+this.finanicialUploadTransferFileRes.filedataList[0].filePath
              //console.log(this.finanicialTransferFileUrl)
            }else{
              var errMsg
              if(this.finanicialUploadTransferFileRes.errorMsg){
                errMsg=this.finanicialUploadTransferFileRes.errorMsg
              }else{
                errMsg='Failed Please Try Again!'
              }
              this.alertService.swalPopErrorTimer(errMsg)
            }
          },
          error:()=>{
            console.error("error caught in file upload")
            this.innerLoaderMainData=false
          }
        })
      } 
      else {
        this.alertService.swalPopErrorTimer('Only PDF file is allowed!')
      }
    }
  }
  
}
