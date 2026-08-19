import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SportscientistService } from 'src/app/_common/services/innerPagesServices/sportscientist.service';
import { SharableService } from 'src/app/_common/services/innerPagesServices/innerpagesSharable.service';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import { AthleteInsuranceComponent } from 'src/app/standalone_components/modal-window/athlete-insurance/athlete-insurance.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CoachAcademyComponent } from 'src/app/_common/modal-window/coach-academy/coach-academy.component';
import { StorageService } from 'src/app/_common/services/common-services/storage.service';
import Swal from 'sweetalert2';
import { CoachInsuranceService } from 'src/app/_common/services/innerPagesServices/coach-insurance.service';
import { AthleteInsuranceSuccessComponent } from 'src/app/standalone_components/modal-window/athleteInsuranceSuccess/athleteInsuranceSuccess.component';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { PopupOfficialProfileComponent } from 'src/app/standalone_components/modal-window/popup-official-profile/popup-official-profile.component';

export interface PeriodicElement{
  academy_detail_id:number;
  academy_name:string;
  category:string;
  date_of_joining:string
  full_name:string;
  gender:string;
  is_Insured:boolean;
  is_KIAA:boolean;
  is_PDU:boolean;
  kitd_unique_id:string;
  mobile_number:Number;
  official_detail_id:Number;  
  ssType:string;
  state_id:number;
  state_name:string;
}

@Component({
  selector: 'app-sports-scientist',
  templateUrl: './sports-scientist.component.html',
  styleUrls: ['./sports-scientist.component.css']
})

export class SportsScientistComponent implements OnInit {
  searchFilter!:FormGroup;
  innerLoader:boolean = false;
  innerLoaderMainData:boolean = false;
  userid: any = "";
  nsrs_id: any = "";
  name: any = "";
  sport_id: any = "";
  scheme_id: any = 0;
  gender: any = "";
  catListData: any = [];
  sportScientistListData: any = [];
  isloading:boolean=true;
  displayedColumns: string[] = ['kitd_unique_id', 'full_name', 'category', 'academy_name', 'insured', 'kiaa'];
  dataSource: any;
  docType:string ='Export';
  sportsScientistMenuData:any
  insuranceModal: any;
  nsrsidInsurancePopup:any;
  submitDetailInsuranceModal: any;
  official_detail_id:any;
  popupData:any;
  selectedPlayerData:any;
  searchedSportsScientistListData:any=[];
  sscPermissionData:any;
  roleid:any;
  hideRoleID:number=173

  @ViewChild('exporter') exporter:any

  constructor(private fb:FormBuilder,
    private ssService:SportscientistService,
    private modal: NgbModal,
    private _storageService:StorageService,
    private coachInsuraceService:CoachInsuranceService,
    private _alertService:AlertService) { }
    
    deleteInsuranceData:any
    deleteInsuranceModalRef:any

  @ViewChild(MatPaginator) paginator!: MatPaginator;
 
  @ViewChild(MatSort) sort!: MatSort;

  @ViewChild('content') insurancePopup: any;
  @ViewChild('SubmitTagcontent') submitDetailConfirmPopup: any;
  @ViewChild('deleteinsurance') deleteinsurancePopup: any;

  ngOnInit() {
    this.searchFilter = this.fb.group({
      nsrsid: [''],
      name: [''],
      category: [''],
      gender: ['']
    })

    var temp: any = localStorage.getItem('loginUserdata')
    var tempData = JSON.parse(temp);
    this.userid = tempData.user_id;
    this.roleid = tempData.role_id;
    this.sportScientistList();
    this.getCatList() 

    // this.sportsScientistMenuData = this._storageService.menuData$;
    // console.log("response from sidebar component to sports scientist", this.sportsScientistMenuData.source._value);
    this.sportsScientistMenuData = this._storageService.newGetState();
    // console.log("sports scientist menu data",this.sportsScientistMenuData);
   
  }

  ngOnDestroy(){
    this.modal.dismissAll()
  }

  sportScientistList(){
    this.innerLoaderMainData=true
    this.ssService.ssList(this.userid, this.nsrs_id, this.name,
      this.sport_id, this.scheme_id, this.gender).subscribe(result => {
        this.innerLoaderMainData=false     
        this.sportScientistListData = result;
        // console.log(result);
        const ELEMENT_DATA: PeriodicElement[] = this.sportScientistListData
        this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

      },(error)=>{
        console.error('error caught in list')
        // this.errorMessage = error;
        this.innerLoaderMainData = false;
      })
  }

  getCatList() {
    this.innerLoader=true
    this.ssService.ssCatList().subscribe(res => {
      this.catListData = res
      this.innerLoader=false
      //console.log('catListData',this.catListData)
    })
  }

  search() {
    this.searchedSportsScientistListData=this.sportScientistListData
    
    if(this.searchFilter.value.nsrsid!=''){
      this.searchedSportsScientistListData = this.searchedSportsScientistListData.filter((data: any) => {
        if (data.kitd_unique_id.toLowerCase() == this.searchFilter.value.nsrsid.toLowerCase()) {
          return data;
        }
      });
    }
    if(this.searchFilter.value.name!=''){
      this.searchedSportsScientistListData = this.searchedSportsScientistListData.filter((data: any) => {
        if(data.full_name.toLowerCase().includes(this.searchFilter.value.name.toLowerCase())){
          return data
        }
      });
    }
    if(this.searchFilter.value.category!=''){
      this.searchedSportsScientistListData = this.searchedSportsScientistListData.filter((data: any) => {
        // if (data.ssType.toLowerCase() == this.searchFilter.value.category.toLowerCase()) {
        //   return data;
        // }
        if(data.ssType.toLowerCase().includes(this.searchFilter.value.category.toLowerCase())){
          return data
        }
      });
    }
    
    if(this.searchFilter.value.gender!=''){
      this.searchedSportsScientistListData = this.searchedSportsScientistListData.filter((data: any) => {
        if(data.gender.toLowerCase() == this.searchFilter.value.gender.toLowerCase()) {      
          return data;
        }
    });

    // console.log(this.searchedSportsScientistListData)
    }
    
    if(this.searchFilter.value.nsrsid=='' && this.searchFilter.value.name=='' && this.searchFilter.value.category=='' && this.searchFilter.value.scheme=='' && this.searchFilter.value.gender==''){
      this.searchedSportsScientistListData=this.sportScientistListData
    }
    

    this.dataSource = this.searchedSportsScientistListData;
        this.dataSource = new MatTableDataSource<PeriodicElement>(
          this.searchedSportsScientistListData
        );

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort=this.sort
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  selectChange(event:any){
    // console.log(event) 
    if(event == 'excel'){
     this.exporter.exportTable('xlsx', {fileName:'sportScientist', sheet: 'sheet_name', Props: {Author: 'NSRS'}})
    }else if(event == 'pdf'){
     this.getPdf()
   
    }
   }
   getPdf(){
    const doc = new jsPDF();
    var img= new Image();
      img.src='../assets/images/NSRS.png';
      const temp = new jsPDF() 
      autoTable(temp, { html: '#ssTable'});
     for (let pageNumber = 1; pageNumber <= temp.getNumberOfPages(); pageNumber++) {
        doc.addImage(img,'png',0,0,200,250);
        doc.addPage();
      }
      doc.setPage(1);
      autoTable(doc, { html: '#ssTable',headStyles:{valign:'middle',fillColor:'#1F60AB',fontSize:5},theme:'grid',bodyStyles:{fontSize:7,fillColor:false,textColor:'#000'}});
      doc.deletePage(temp.getNumberOfPages()+1);
      doc.save('sportsScientist.pdf');
  }


  openCoachAcademyWindow(event:any,elementData:any){
    if(this.roleid !=this.hideRoleID){
    const modalRef = this.modal.open(CoachAcademyComponent, { size: 'xl', centered: true, backdrop: 'static', keyboard: false });
    // console.log("modalref data of sports scientist",modalRef);
    modalRef.componentInstance.sportsScientistData = elementData;
    modalRef.componentInstance.menuName='sportsScientistAcademy';
    modalRef.componentInstance.sscPermissionData=this.sscPermissionData;
    modalRef.result.then((event) => {
      this.sportScientistList();
    });
    }

  }

  open(elementData:any){
    this.nsrsidInsurancePopup = elementData.kitd_unique_id;
    this.popupData = elementData
    this.insuranceModal = this.modal.open(this.insurancePopup, {
      size: 'md',
      centered: true,
    });
  }

  confirm(){
    if (this.nsrsidInsurancePopup) {
      this.insuranceModal.close();
      // console.log("nsrsid "+this.nsrsidInsurancePopup);
      var athleteData = this.sportScientistListData.filter((data: any) => {
        if (data.kitd_unique_id == this.nsrsidInsurancePopup) {
          // console.log(data);
          return data;
        }
      });
      this.selectedPlayerData = athleteData;
      // console.log("this athlete data"+ this.selectedPlayerData[0])
      if (this.selectedPlayerData[0].insurance_Status == 'No') {
        // console.log("official_detail_id " +this.selectedPlayerData[0].official_detail_id)
        // console.log("userid  "+this.userid)
        this.innerLoader=true
        this.coachInsuraceService.coachInsuranceTagging(this.selectedPlayerData[0].official_detail_id,this.userid).subscribe(res=>{
          // console.log("insurance api response ")
          // console.log(res)
          this.innerLoader=false
          if(res!=-1){
            this._alertService.swalPopSuccessTimer('Sport Scientist Tagged Successfully!')
            var data = this.sportScientistListData.filter((data: any) => {
              if (data.kitd_unique_id == this.nsrsidInsurancePopup) {
                data.insurance_Status = 'Pending'
                data.taggedby_id=this.userid 
                data.insurance_tagId=res        
                return data
              }
            });
            // this.selectedPlayerData[0].taggedby_id = this.insurance_id;
            this.submitDetailInsuranceModal = this.modal.open(this.submitDetailConfirmPopup, { size: 'md', centered: true });

          }else{
            this._alertService.swalPopErrorTimer('Can Not Insure the Sports Scientist')
          }
        },(error)=>{
          console.error('error caught in tagging insurance')
          // this.errorMessage = error;
          this.innerLoader = false;
        })
      }
    }
  }


  sportsScientistInsurance(){
    this.submitDetailInsuranceModal.close()
    const modalRef=this.modal.open(AthleteInsuranceComponent,{ size: 'xl', centered: true, backdrop: 'static', keyboard: false })
    modalRef.componentInstance.coachData=this.selectedPlayerData[0]
    modalRef.componentInstance.menuName='coach'
    modalRef.result.then((event) => {
      this.sportScientistList()
    });

  }

  sportScientistPending(elementData:any){
    if(elementData.insurance_Status=="Pending"){
      const modalRef = this.modal.open(AthleteInsuranceComponent, { size: 'xl', centered: true, backdrop: 'static', keyboard: false });
      modalRef.componentInstance.coachData=elementData
      modalRef.componentInstance.menuName='coach'
    }

  }

  sportScientistInsured(elementData:any){
    this.innerLoader=true
    this.coachInsuraceService.coachGetData(elementData.official_detail_id,elementData.insurance_tagId).subscribe(res=>{
      this.innerLoader=false
      if (res) {
        // console.log(res)
        var resData:any=res
        // console.log("coach get data")
        // console.log(res)
        const modalRef = this.modal.open(AthleteInsuranceSuccessComponent, { size: 'xl', centered: true, backdrop: 'static', keyboard: false });
        modalRef.componentInstance.coachData = elementData
        modalRef.componentInstance.coachGetData=resData
        modalRef.componentInstance.menuName='coach'
   
      } else {
        this._alertService.swalPopWarning('Internal Server Error')
      }
    },(error)=>{
      console.error('error caught in scheme list')
      // this.errorMessage = error;
      this.innerLoader = false;
    }
    )
  }

  sportsScientistExpired(elementData:any){
    {
      // console.log(elementData)
      this.innerLoader=true
      this.coachInsuraceService.coachInsuranceTagging(elementData.official_detail_id,this.userid).subscribe(res=>{
        // console.log(res)
        this.innerLoader=false
        if (res != false) {
          const modalRef = this.modal.open(AthleteInsuranceComponent, {
            size: 'xl',
            centered: true,
            backdrop: 'static',
            keyboard: false,
          });
          modalRef.componentInstance.coachData = elementData
          modalRef.componentInstance.menuName='coach'
          modalRef.result.then((event) => {
            this.sportScientistListData();
          });
        } else {
          this._alertService.swalPopErrorTimer('Can Not Insure the Sport Scientist')
        }
      },
      (error)=>{
        console.error('error caught in scheme list')
        // this.errorMessage = error;
        this.innerLoader = false;
      })
  
      
    }
  }
  deleteInsurance(elementData:any){
    
    this.deleteInsuranceData = elementData
    this.deleteInsuranceModalRef = this.modal.open(this.deleteinsurancePopup,{size: 'md', centered: true,})

  }
  confirmDelete(){
    this.innerLoader=true
    this.ssService.deleteInsurance(this.deleteInsuranceData.insurance_tagId,this.userid).subscribe(res=>{
      this.innerLoader=false
      // console.log(res)
      if(res){
        this._alertService.swalPopSuccess('Delete officialInsurance successfully!')
        this.sportScientistList()
      }else{
        this._alertService.swalPopError("OfficialInsurance can't delete!")
      }
    },
    (error)=>{
      console.error('error caught in scheme list')
      // this.errorMessage = error;
      this.innerLoader = false;
    })
    
    this.deleteInsuranceModalRef.close();
  }
  openSportScientistPopupProfile(rowData:any){
    const modalRef = this.modal.open(PopupOfficialProfileComponent,{size:'xl', centered:true, scrollable:true, modalDialogClass:'customModalSizeLarge',
  backdrop:'static',keyboard:false})
  let officialRowData = {official_detail_id:rowData.official_detail_id,role_Id:103}
  modalRef.componentInstance.officialInstanceData = officialRowData
  }

}
