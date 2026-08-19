import {Component,ElementRef,OnInit,ViewChild} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatTableDataSource } from '@angular/material/table';
import { AuthenticationService } from '../../_common/services/innerPagesServices/authentication.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TransferWeedoutComponent } from '../../_common/modal-window/transfer-weedout/transfer-weedout.component';
import { Router } from '@angular/router';
import { AthleteInsuranceSuccessComponent } from 'src/app/standalone_components/modal-window/athleteInsuranceSuccess/athleteInsuranceSuccess.component';
import { AthleteInsuranceComponent } from 'src/app/standalone_components/modal-window/athlete-insurance/athlete-insurance.component';
import { MatDialog } from '@angular/material/dialog';
import { AthleteService } from 'src/app/_common/services/innerPagesServices/athlete.service';
import { SharableService } from 'src/app/_common/services/innerPagesServices/innerpagesSharable.service';
import { Athelete_insuranceService } from 'src/app/_common/services/innerPagesServices/athelete_insurance.service';
import { FinanialModalComponent } from 'src/app/_common/modal-window/finanial-modal/finanial-modal.component';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AddFinancialAthleteComponent } from 'src/app/_common/modal-window/addFinancialAthlete/addFinancialAthlete.component';
import { AddInsuranceAthleteComponent } from 'src/app/_common/modal-window/addInsuranceAthlete/addInsuranceAthlete.component';
import { StorageService } from 'src/app/_common/services/common-services/storage.service';
import { Observable, Subscription} from 'rxjs';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { PopupAthleteProfileComponent } from 'src/app/standalone_components/modal-window/popup-athlete-profile/popup-athlete-profile.component';
import { error } from 'highcharts';


export interface PeriodicElement {
  id: number;
  ath_Name: string;
  gender: string;
  is_Insured: boolean;
  is_KIAA: number;
  is_PDU: boolean;
  is_Tops: boolean;
  iS_TIDC:boolean,
  is_kia: number;
  nsrsId: string;
  player_detail_id: string;
  scholarship_type: string;
  sport_id: number;
  sport_name: string;
  trainingCenter: string;
}

@Component({
  selector: 'app-athlete',
  templateUrl: './athlete.component.html',
  styleUrls: ['./athlete.component.css'],
})

export class AthleteComponent implements OnInit {
  innerLoader:boolean = false;
  innerLoaderSportList:boolean = false;
  innerLoaderMainData:boolean = false;
  getSchemeListLoader:boolean = false;
  userDetails:any
  atheleteListData: any = [];
  selectedAtheleteListData: any = [];
  displayedColumns: string[] = ['nsrsId','NAME','Discipline','TrainingCenter','TIDC','kia','tops','insurance','financial',/*'pduw',*/'kiaa'];
  dataSource: any;
  sportListData: any = [];
  schemeListData: any = [];
  searchFilter!: FormGroup;
  nsrsidweedout: any;
  nsrsidInsurancePopup: any;
  insuranceModal: any;
  expiredinsuranceModal: any;
  submitDetailInsuranceModal: any;
  insurance_id: any = {};
  athleteInsuranceData: any = [];
  popupData: any;
  selectedPlayerData: any;
  docType: string = 'Export';
  schemeForm!: FormGroup;
  addAthleteData: any;
  menuData$: Observable<any> = new Observable()
  athleteMenuData: any
  athleteMenuDataMenuId: any
  permissionData: any
  insurancePermission:boolean =true;
  hideRoleID:number=173;
  deleteInsuranceModal:any

  private athleteListSubscription: Subscription | undefined;
  getSchemeListData:any = []
  academyListData:any = []
  

  @ViewChild('exporter') exporter: any
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;

  @ViewChild('content') insurancePopup: any;
  @ViewChild('expiredInsurance') expiredInsurancePopup: any;
  @ViewChild('delete') deleteInsurancePop: any;
  @ViewChild('SubmitTagcontent') submitDetailConfirmPopup: any;
  @ViewChild('input') searchField!: ElementRef<HTMLInputElement>;

  constructor(private authenticationService: AuthenticationService,
    private athleteService: AthleteService,
    private atheleteInsuranceService: Athelete_insuranceService, private modal: NgbModal,
    private fb: FormBuilder, private router: Router,
    public dialog: MatDialog, private _storageService: StorageService,
    private _sharableService: SharableService,
    private swalAlert:AlertService
  ) { }

  ngOnInit(): void {
    //Form for the filters 
    this.searchFilter = this.fb.group({
      nsrsid: [''],
      name: [''],
      discipline: [''],
      scheme: [''],
      gender: [''],
      academy_type:[''],
      academy:['']
    });

    this.schemeForm = this.fb.group({
      selectedScheme: ['']
    })

    this.userDetails=this._storageService.getUserDetails()
    this.sportList();
    this.schemeList();
    //calling the athlete list
    this.atheleteList();
    this.athleteMenuData = this._storageService.newGetState();
    this.getSchemeListAcademy();
  }

  //function to call api for athlete data and mapping to Mat-Table
  atheleteList() {
    this.innerLoaderMainData=true
    this.athleteListSubscription=this.athleteService.athleteList(this.userDetails.user_id,"","","",0,"")
      .subscribe({
        next:(result) => {
          this.innerLoaderMainData=false
          this.atheleteListData = result;
          this.search();
          // this.selectedAtheleteListData = this.atheleteListData
          // const ELEMENT_DATA: PeriodicElement[] = this.atheleteListData;
          // this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
          // this.dataSource.paginator = this.paginator;
          // this.dataSource.sort = this.sort;
        },
        error:()=>{
          console.error('error caught in athlete list')
          this.innerLoaderMainData = false;
        }
      });
  }

  ngOnDestroy(){
    this.athleteListSubscription?.unsubscribe()
    this.modal.dismissAll()
  }

  //function for filtering data according to filters
  search() {
    this.selectedAtheleteListData = this.atheleteListData
    if (this.searchFilter.value.nsrsid != '') {
      this.selectedAtheleteListData = this.selectedAtheleteListData.filter((data: any) => {
        if (data.nsrsId.toLowerCase() == this.searchFilter.value.nsrsid.toLowerCase()) {
          return data;
        }
      });
    }

    if (this.searchFilter.value.name != '') {
      this.selectedAtheleteListData = this.selectedAtheleteListData.filter((data: any) => {
        if (data.ath_Name.toLowerCase().includes(this.searchFilter.value.name.toLowerCase())) {
          return data
        }
      });
    }

    if (this.searchFilter.value.discipline != '') {
      this.selectedAtheleteListData = this.selectedAtheleteListData.filter((data: any) => {
        if (data.sport_name.toLowerCase() == this.searchFilter.value.discipline.toLowerCase()) {
          return data;
        }
      });
    }
    if (this.searchFilter.value.scheme != '') {
      this.selectedAtheleteListData = this.selectedAtheleteListData.filter((data: any) => {
        if (data.scholarship_type.toLowerCase() == this.searchFilter.value.scheme.toLowerCase()) {
          return data;
        }
      });
    }
    if (this.searchFilter.value.gender != '') {
      this.selectedAtheleteListData = this.selectedAtheleteListData.filter((data: any) => {
        if (data.gender == this.searchFilter.value.gender) {
          return data;
        }
      });
    }
    if(this.searchFilter.value.academy_type !=''){
      this.selectedAtheleteListData = this.selectedAtheleteListData.filter((data:any)=>{
        if(data.academy_scheme_id== +this.searchFilter.value.academy_type){
          return data
        }
      })   
    }
    if(this.searchFilter.value.academy !=''){
      this.selectedAtheleteListData = this.selectedAtheleteListData.filter((data:any)=>{
        if(data.academy_detail_id== +this.searchFilter.value.academy){
          return data
        }
      })  
    }

    if (this.searchFilter.value.nsrsid == '' && this.searchFilter.value.name == '' && this.searchFilter.value.discipline == '' && this.searchFilter.value.scheme == '' && this.searchFilter.value.gender == '' && this.searchFilter.value.academy_type =='' && this.searchFilter.value.academy =='') {
      this.selectedAtheleteListData = this.atheleteListData
    }

    this.dataSource = this.selectedAtheleteListData;
    this.dataSource = new MatTableDataSource<PeriodicElement>(this.selectedAtheleteListData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    if (this.searchField.nativeElement.value) this.applyFilter({target: {value: this.searchField.nativeElement.value}} as unknown as Event);
  }
  getSchemeListAcademy(){
    this.getSchemeListLoader = true
    this._sharableService.schemeList().subscribe({
      next:(res)=>{
        this.getSchemeListLoader = false;
        this.getSchemeListData = res
      },
      error:(error)=>{
        this.getSchemeListLoader = false;
        console.error(error)
      }
    })
  }
  changeAcademyType(event:any){
    this.searchFilter.get('academy')?.reset('');
    if(event.target.value!=='')this.getUserAcademyMappingReport()
  }
  getUserAcademyMappingReport(){
    this.innerLoader = true;
    this.athleteService.getUserAcademyMappingReport(
      this.userDetails.user_id,
      this.userDetails.role_id,
      this.searchFilter.get('academy_type')?.value
    ).subscribe({
      next:(response)=>{
        this.innerLoader = false;
        this.academyListData = response
      },
      error:(error)=>{
        this.innerLoader = false;
        console.error(error)
      }
    })
  }
  checkAcademyType(){
    if(this.searchFilter.get('academy_type')?.value ==''){      
      this.swalAlert.swalPopWarning('Please select academy type!')
      return
    }    
  }

  //mapping of discipline(sports List) for filters
  sportList() {
    this.innerLoaderSportList=true
    this._sharableService.sportList().subscribe({
      next:(res)=>{
        this.innerLoaderSportList=false
        this.sportListData = res;
      },
      error:()=>{
        console.error('error caught in sport list')
        this.innerLoaderSportList = false;
      }
    })
  }

  //mapping of schemes in filters
  schemeList() {
    this.innerLoader=true
    this.athleteService.getScheme().subscribe({
      next:(res)=>{
        this.schemeListData = res;
        this.innerLoader=false
      },
      error:()=>{
        console.error('error caught in scheme list')
        this.innerLoader = false;
      }
    })
  }


  //opens function for TranferWeedout component
  openTransferComponent(elementData: string) {

    if(this.userDetails.role_id !=173){
  if (this.authenticationService.isLoggedIn()) {
      var athleteData = elementData
      const modalRef = this.modal.open(TransferWeedoutComponent, {
        size: 'xl',
        centered: true,
        backdrop: 'static',
        keyboard: false
      });
      modalRef.componentInstance.athleteData = athleteData;
      modalRef.componentInstance.permissionData = this.permissionData
      // modalRef.componentInstance.permissionData=false
      modalRef.result.then((event) => {
        this.nsrsidweedout = event;
        this.dataSource.filter = event;
        this.atheleteList();
      });
    } else {
      this.router.navigate(['login']);
    }
    }
  
  }

  noInsurance(nsrs_id: any, elmenentData: any) {
    this.nsrsidInsurancePopup = nsrs_id;
    this.popupData = elmenentData
    if (this.insurancePermission) {
      this.insuranceModal = this.modal.open(this.insurancePopup, {
        size: 'md',
        centered: true,
      });
    } else {
      this.swalAlert.swalPopError("You are not authorized for this operation!")
    }
  }

  confirmInsuranceTag() {
    if (this.nsrsidInsurancePopup) {
      this.insuranceModal.close();
      var athleteData = this.atheleteListData.filter((data: any) => {
        if (data.nsrsId == this.nsrsidInsurancePopup) {
          return data;
        }
      });
      this.selectedPlayerData = athleteData[0];
      if (this.selectedPlayerData.insurance_status == '0') {
        this.innerLoader=true
        this.atheleteInsuranceService.athleteInsuranceTagging(this.selectedPlayerData.player_detail_id,
          this.userDetails.user_id,this.userDetails.role_id,1,"").subscribe({
            next:(res)=>{
              this.innerLoader=false
              if (res) {
                this.swalAlert.swalPopSuccessTimer("Player Tagged Successfully!")
                var data = this.atheleteListData.filter((data: any) => {
                  if (data.nsrsId == this.nsrsidInsurancePopup) {
                    data.is_Insured = true
                    data.insurance_status = 'P'
                    data.insured_by = this.userDetails.user_id
                    return data
                  }
                });
                this.submitDetailInsuranceModal = this.modal.open(this.submitDetailConfirmPopup, { size: 'md', centered: true });

              } else {
                this.swalAlert.swalPopErrorTimer("Can Not Insure the Athlete")
              }
            },
            error:()=>{
              console.error('error caught in insurance tagging')
              this.innerLoader = false;
            }
          })
      }
    }
  }

  athleteInsuranceDetails() {
    this.submitDetailInsuranceModal.close()
    const modalRef = this.modal.open(AthleteInsuranceComponent, { size: 'xl', centered: true, backdrop: 'static', keyboard: false, });
    modalRef.componentInstance.athleteData = this.selectedPlayerData;
    modalRef.componentInstance.menuName = 'athlete'
    modalRef.componentInstance.insurancePermissionData = this.insurancePermission
    modalRef.result
    .then(() => this.atheleteList())
    .catch(() => {});
  }

  athletePendingInsurance(elementRowData: any) {
    // var athleteData = this.atheleteListData.filter((data: any) => {
    //   if (data.nsrsId == nsrsid) {
    //     return data;
    //   }
    // });
    if (elementRowData.insurance_status == 'P') { 
      if (this.insurancePermission) {
        const modalRef = this.modal.open(AthleteInsuranceComponent, { size: 'xl', centered: true, backdrop: 'static', keyboard: false });
        modalRef.componentInstance.athleteData = elementRowData;
        modalRef.componentInstance.menuName = 'athlete'
        modalRef.componentInstance.insurancePermissionData = this.insurancePermission

        modalRef.result
          .then(() => this.atheleteList())
          .catch(() => {});
      } else {
        this.swalAlert.swalPopError("You are not authorized for this operation!")
      }

    }
  }

  athleteSuccessInsurace(elementRowData: any) {
    if (elementRowData.insurance_status == 'S') {
      const modalRef = this.modal.open(AthleteInsuranceSuccessComponent, {size: 'xl',centered: true,backdrop: 'static',keyboard: false});
      modalRef.componentInstance.athleteData = elementRowData;
      modalRef.componentInstance.menuName = 'athlete'
      modalRef.componentInstance.insurancePermissionData = this.insurancePermission
      // modalRef.componentInstance.insurancePermissionData=false
      modalRef.result
        .then(() => this.atheleteList())
        .catch(() => {});
    }else {
      this.swalAlert.swalPopError("Internal Server Error occured in geting insurance details")
    }
  }

  athleteExpiredInsurance(elementRowData: any) {
    this.popupData=elementRowData
    this.expiredinsuranceModal = this.modal.open(this.expiredInsurancePopup, {
      size: 'md',
      centered: true,
    });
    // this.innerLoader=true
    // this.atheleteInsuranceService.athleteInsuranceTagging(elementRowData.player_detail_id,this.userDetails.user_id,
    //   this.userDetails.role_id,1,'').subscribe({
    //     next:(res)=>{
    //       this.innerLoader=false
    //       if(res){
    //         elementRowData.insurance_status='P'
    //         this.swalAlert.swalPopSuccess('Tagged Successfully!')
    //       }else{
    //         this.swalAlert.swalPopError('Something Went Wrong')
    //       }
    //     },
    //     error:()=>{
    //       console.error('error caught in tagging expired athlete')
    //       this.innerLoader=false
    //     }
    //   })
  }

  confirmExpiredInsuranceTag(){
    this.expiredinsuranceModal.close()
    if (this.popupData.insurance_status == 'E') {
      const modalRef = this.modal.open(AthleteInsuranceComponent, {size: 'xl',centered: true,backdrop: 'static',keyboard: false});
      modalRef.componentInstance.athleteData = this.popupData;
      modalRef.componentInstance.menuName = 'athlete'
      modalRef.componentInstance.insurancePermissionData = this.insurancePermission
      // modalRef.componentInstance.insurancePermissionData=false
      modalRef.result
        .then(() => this.atheleteList())
        .catch(() => {});
    }else {
      this.swalAlert.swalPopError("Internal Server Error occured in geting insurance details")
    }
  }

  deleteInsuranceData:any

  deleteInsurance(elementData:any){
    this.deleteInsuranceData=elementData
    this.deleteInsuranceModal = this.modal.open(this.deleteInsurancePop, {
      size: 'md',
      centered: true,
    });
  }

  confirmDeleteInsurance(){
    this.deleteInsuranceModal.close()
    this.innerLoader=true;
    this.athleteService.deleteAthleteInsurance(this.deleteInsuranceData.player_detail_id, this.userDetails.user_id)
    .subscribe({
      next:(res)=>{
        this.innerLoader=false
        if(res){
          this.swalAlert.swalPopSuccess("Athlete insurance deleted successfully!")
          this.atheleteList()
        }else{
          this.swalAlert.swalPopError("Athlete insurance can't delete!")
        }
      },
      error:()=>{
        console.error('error caught in deleting insurance')
        this.innerLoader = false;
      }
    })
    this.deleteInsuranceModal.close()
  }

  menuIdForFinancialModal: any;

  athleteObj: any
  openFinancialModel(event: any, element: any) {
    let componentName = "financial-modal";
    // this.innerLoader=true;
    // this._sharableService.getDashbordMenuRoleid(componentName)
    //   .subscribe(res => {
    //     this.innerLoader=false
    //     this.menuIdForFinancialModal = res;

        let elementData = element;
        console.log(elementData);
        const modalRef = this.modal.open(FinanialModalComponent, { size: 'xl', centered: true, backdrop: 'static', keyboard: false })
        modalRef.componentInstance.athleteData = elementData;
        modalRef.componentInstance.menuIdForFinancialModal = this.menuIdForFinancialModal;
        modalRef.result.then(() => {
          this.atheleteList();
        });
      // },
      // (error)=>{
      //   // console.error('error caught in scheme list')
      //   // this.errorMessage = error;
      //   this.innerLoader = false;
      // });

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  exportToExcelPdfChange(event: any) {
    // for (var i of this.permissionData) {
      // if (i.action_name == 'Export') {
        // if (i.isactive) {
          if (event == 'excel') {
            this.exporter.exportTable('xlsx', { fileName: 'athlete', sheet: 'sheet_name', Props: { Author: 'NSRS' } })
          } else if (event == 'pdf') {
            this.getPdf()
          }
  }

  getPdf() {
    const doc = new jsPDF();
    var img = new Image();
    img.src = '../assets/images/NSRS.png';
    const temp = new jsPDF()
    autoTable(temp, { html: '#athleteTable' });
    for (let pageNumber = 1; pageNumber <= temp.getNumberOfPages(); pageNumber++) {
      doc.addImage(img, 'png', 0, 0, 200, 250);
      doc.addPage();
    }
    doc.setPage(1);
    autoTable(doc, { html: '#athleteTable', headStyles: { valign: 'middle', fillColor: '#1F60AB', fontSize: 5 }, theme: 'grid', bodyStyles: { fontSize: 7, fillColor: false, textColor: '#000' } });
    doc.deletePage(temp.getNumberOfPages() + 1);
    doc.save('athlete.pdf');
  }

  AddAthleteModal() {
    var schemeValue = this.schemeForm.controls['selectedScheme'].value;
    var userData = {
      userid: this.userDetails.user_id,
      roleid: this.userDetails.role_id,
    }
    if (schemeValue == 'financial') {
      const modalRefFinancial = this.modal.open(AddFinancialAthleteComponent, { size: 'xl', centered: true, keyboard: false });
      modalRefFinancial.componentInstance.addAthleteData = userData;
      modalRefFinancial.result.then(() => {
        this.atheleteList()
       })
    } else if (schemeValue == 'insurance') {
      const modalRefInsurance = this.modal.open(AddInsuranceAthleteComponent, { size: 'xl', centered: true, keyboard: false });
      modalRefInsurance.componentInstance.addAthleteData = userData;
      modalRefInsurance.result.then(() => {
        this.atheleteList()
       })
    }
  }

  openAthleteProfile(rowData:any){
    const modalRef = this.modal.open(PopupAthleteProfileComponent,{size:'xl', centered:true, scrollable:true, modalDialogClass:'customModalSizeLarge',
  backdrop:'static',keyboard:false})
  modalRef.componentInstance.playerId = rowData.player_detail_id
  }

}