import {AfterViewInit, Component,OnInit,ViewChild} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AthleteService } from 'src/app/_common/services/innerPagesServices/athlete.service';
import { SharableService } from 'src/app/_common/services/innerPagesServices/innerpagesSharable.service';
import { StorageService } from 'src/app/_common/services/common-services/storage.service';
import { Observable, Subscription} from 'rxjs';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { PopupAthleteProfileComponent } from 'src/app/standalone_components/modal-window/popup-athlete-profile/popup-athlete-profile.component';
import { NadaAtheleteListDataRootEntity, NadaAtheleteListEntity, NadaService } from 'src/app/_common/services/nada-service/nada.service';
import { NadaAthleteSanctionedComponent } from 'src/app/standalone_components/modal-window/nada-modal/nada-athlete-sanctioned/nada-athlete-sanctioned.component';

@Component({
  selector: 'app-nada-athlete',
  templateUrl: './nada-athlete.component.html',
  styleUrls: ['./nada-athlete.component.css']
})
export class NadaAthleteComponent implements OnInit, AfterViewInit {
innerLoader:boolean = false;
  innerLoaderSportList:boolean = false;
  innerLoaderMainData:boolean = false;
  getSchemeListLoader:boolean = false;
  userDetails:any
  atheleteListData: any = [];
  displayedColumns: string[] = ['nsrsId','NAME','TrainingCenter','kia','tops','insurance','sanction_banned','financial','kiaa'];
  dataSource: any;
  sportListData: any = [];
  schemeListData: any = [];
  searchFilter!: FormGroup;
  menuData$: Observable<any> = new Observable()
  athleteMenuData: any
  athleteMenuDataMenuId: any
  hideRoleID:number=173;

  private athleteListSubscription: Subscription | undefined;
  getSchemeListData:any = []
  academyListData:any = []
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  totalLength:number = 0;

  constructor(
    private athleteService: AthleteService, private modal: NgbModal,
    private fb: FormBuilder,
    public dialog: MatDialog, private _storageService: StorageService,
    private _sharableService: SharableService,
    private swalAlert:AlertService,
    private nadaService:NadaService
  ) { }

  ngOnInit(): void {
    //Form for the filters 
    this.searchFilter = this.fb.group({
      nsrsid: [''],
      name: [''],
      discipline: [''],
      scheme: [0],
      gender: [''],
      academy_type:[0],
      academy:[0]
    });

    this.userDetails=this._storageService.getUserDetails()
    this.sportList();
    this.schemeList();
    this.athleteMenuData = this._storageService.newGetState();
    this.getSchemeListAcademy();
     //calling the athlete list
    this.getAtheleteList();
  }
  ngAfterViewInit(): void {
    // //calling the athlete list
    // this.getAtheleteList();
    
  }

  //function to call api for athlete data and mapping to Mat-Table
  getAtheleteList(
    Kitd:string = '',
    AthName:string = '',
    discipline:string =  '',
    scheme:number = 0,
    Academy_type:number = 0,
    academy_detail_id:number = 0,
    gender:string = '',
    page_indx:number = 0,
  ) {
    const payload = {
      userId:this.userDetails.user_id,
      AllAth: 'U',
      Kitd: Kitd,
      AthName: AthName,
      Gender: gender,
      Discipline: discipline,
      Scheme: scheme,
      Academy_type: Academy_type,
      academy_detail_id: academy_detail_id,
      page_indx: page_indx+1
    }
    this.innerLoaderMainData=true
    this.dataSource = []
    this.totalLength = 0
    this.athleteListSubscription=this.nadaService.get_Nada_AtheleteList(payload).pipe()
      .subscribe({
        next:(result:NadaAtheleteListDataRootEntity | any) => {
          this.innerLoaderMainData=false
          this.atheleteListData = result.data.nada_AtheleteList;
          this.totalLength = result.data.dataCount
          // this.dataSource = new MatTableDataSource<NadaAtheleteListEntity>(result.data.nada_AtheleteList);
          this.dataSource  = result.data.nada_AtheleteList;
          // this.dataSource.sort = this.sort;
            if (this.dataSource.paginator) {
              this.dataSource.paginator.firstPage();
            }          
        },
        error:()=>{
          console.error('error caught in athlete list')
          this.innerLoaderMainData = false;
        }
      });
  }



  //function for filtering data according to filters
  search() {
    this.getAtheleteList(
      this.searchFilter.value.nsrsid,
      this.searchFilter.value.name,
      String(this.searchFilter.value.discipline),
      this.searchFilter.value.scheme,
      this.searchFilter.value.academy_type,
      this.searchFilter.value.academy,
      this.searchFilter.value.gender,
      0      
    )
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
    this.searchFilter.get('academy')?.reset(0);
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
    if(this.searchFilter.get('academy_type')?.value ==0){      
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



  openAthleteProfile(rowData:any){
    const modalRef = this.modal.open(PopupAthleteProfileComponent,{size:'xl', centered:true, scrollable:true, modalDialogClass:'customModalSizeLarge',
      backdrop:'static',keyboard:false})
      modalRef.componentInstance.playerId = rowData.player_detail_id
  }
  openSanctionModal(elementData:NadaAtheleteListEntity){
    const modalRef = this.modal.open(
      NadaAthleteSanctionedComponent,
      {
        size:'xl',
        centered:true,
      }
    )
    modalRef.componentInstance.elementRowData = {
      elementData:elementData,
      userDetail:this.userDetails
    }
    modalRef.result
    .then(res=>{
      if(res){
        // calling getAtheleteList Api after save
      } 
    })
    .catch((err)=>{
      console.log(err)
    })
  }
  paginationClick(event:PageEvent){
    this.getAtheleteList(
      this.searchFilter.value.nsrsid,
      this.searchFilter.value.name,
      String(this.searchFilter.value.discipline),
      this.searchFilter.value.scheme,
      this.searchFilter.value.academy_type,
      this.searchFilter.value.academy,
      this.searchFilter.value.gender,
      event.pageIndex      
    )
  }
  ngOnDestroy(){
    this.athleteListSubscription?.unsubscribe()
    this.modal.dismissAll()
  }
}
