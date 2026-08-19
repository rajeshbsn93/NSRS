import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { catchError, EMPTY, first, map, Observable, of, tap } from 'rxjs';
import { StorageService } from 'src/app/_common/services/common-services/storage.service';
import { AcademySharableService } from 'src/app/_common/services/role-inner-pages-services/academy-services/academySharable.service';
import { CoachEntity, DelegateMappingService } from 'src/app/_common/services/role-inner-pages-services/academy-services/delegate-mapping.service';
import { SportscientistDetailListService } from 'src/app/_common/services/role-inner-pages-services/academy-services/sportscientist-detail-list.service';
import { MapAthleteModalComponent } from '../../modal-window/map-athlete-modal/map-athlete-modal.component';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { EditAthleteOfficialMappingDateComponent } from '../../modal-window/edit-athlete-official-mapping-date/edit-athlete-official-mapping-date.component';
export interface AthleteMapEntity {
  player_detail_id: number,
  nsrsId: string,
  name: string,
  academy_date_of_joining: string,
  coach_fromDate: null,
  coach_toDate: null,
  isMapped: boolean
}

@Component({
  selector: 'app-map-athlete',
  templateUrl: './map-athlete.component.html',
  styleUrls: ['./map-athlete.component.css']
})
export class MapAthleteComponent implements OnInit {
  tableColumns: string[] = ['nsrsId','name', 'academy_date_of_joining', 'coach_fromDate', 'action'];
  
  dataSource:any;
  sportsList$!:Observable<any>;
  coachList$!: Observable<CoachEntity[]>;
  coachList!: CoachEntity[];
  tableDataList!: any;

  mapathleteForm!:FormGroup;
  academyDetails:any
  onChangeSportId:any;
  iscoachOptionLoader:boolean = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private modalService:NgbModal,private fb:FormBuilder,private sportsDisciplineService:SportscientistDetailListService,
   private academySharableService:AcademySharableService,private delegateMappingService:DelegateMappingService,
   private storageService:StorageService,private datePipe:DatePipe, private alertService:AlertService) { }

  ngOnInit() {
    this.academyDetails=this.storageService.getAcademyDetails()
    this.setMapAthleteFormControl()
  }

  setMapAthleteFormControl(){
    this.mapathleteForm = this.fb.group({
      map_type:['',Validators.required],
      sport:['', Validators.required],
      coach:['', Validators.required],
    })    
  }
  changeMapType(event:any){
    this.mapathleteForm.get('sport')?.reset();
    this.mapathleteForm.get('coach')?.reset();
    this.coachList$ = of([]);
    this.coachList = [];
    if(event.value == 2){
      this.getSport()
      if(!this.tableColumns.includes('trainingLevel')){
        this.tableColumns.splice(2,0,'trainingLevel')
      }
    }
    if(event.value == 103){
      this.getSportScienceList()
      if(this.tableColumns.includes('trainingLevel')){
        this.tableColumns.splice(2,1)
      }
    }
  }
  changeSports(event:any){
    this.mapathleteForm.get('coach')?.reset(); 
    this.onChangeSportId = event.value
    this.coachList$ = this.delegateMappingService.getCoachList(
      this.storageService.getUserDetails().user_id,
      this.mapathleteForm.get('map_type')?.value,
      this.mapathleteForm.get('sport')?.value
      ).pipe(first(), tap((coachList: CoachEntity[]) => this.coachList = coachList),map((mapRes)=>{
        //console.log(mapRes,mapRes.length,this.mapathleteForm.controls['map_type']?.value)
        if(mapRes.length == 0){
          if(this.mapathleteForm.controls['map_type'].value == 2){
            this.alertService.swalPopWarning('Coach List Not Available!')
          }else if(this.mapathleteForm.controls['map_type'].value == 103){
            this.alertService.swalPopWarning('Sport Scientist List Not Available!')
          }
        }
        
        return mapRes
      }));
  }
  changeCoach(selectVal:any){
    this.iscoachOptionLoader = true
   this.tableDataList = this.academySharableService.get_Academy_Mapped_Athletes(
    this.academyDetails.user_id,
    selectVal,this.onChangeSportId)
   .pipe(first(),map((res:any)=>{
    let newRes = res.filter((item:any)=>item.isMapped).map((item:any)=>{
      return {...item,academy_date_of_joining:item.academy_date_of_joining
         ? this.datePipe.transform(item.academy_date_of_joining,'dd/MM/yyyy')
         : item.academy_date_of_joining,
         coach_fromDate:item.coach_fromDate ? this.datePipe.transform(item.coach_fromDate,'dd/MM/yyyy') : item.coach_fromDate,
         coach_toDate:item.coach_toDate ? this.datePipe.transform(item.coach_toDate, 'dd/MM/yyyy') : item.coach_toDate }
    })
    this.iscoachOptionLoader = false
      const ELEMENT_DATA: AthleteMapEntity[] = newRes
      this.dataSource = new MatTableDataSource<AthleteMapEntity>(ELEMENT_DATA);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort
      //return newRes
    }),
    catchError(()=>{
      this.iscoachOptionLoader = false;
      return EMPTY
    })).subscribe()
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getSport(){
   this.sportsList$ = this.academySharableService.getAcademySportsDiscipline(this.academyDetails.user_id).pipe(first())
  }
  getSportScienceList(){
   this.sportsList$ = this.academySharableService.ssCatList().pipe(first())
  }

  openMapAthlete(){
    if(this.mapathleteForm.valid){
      const modalRef = this.modalService.open(MapAthleteModalComponent,
        { size:'xl', centered: true, backdrop: 'static', keyboard: false });
      const compInstanceData = {
        academy_detail_id: this.academyDetails.user_id,
        official_detail_id: this.mapathleteForm.get('coach')?.value,
        sportId:this.onChangeSportId,
        coachList: this.coachList.filter((item) => item.official_detail_id === this.mapathleteForm.get('coach')?.value)[0],
        role_id: this.storageService.getUserDetails().role_id,
        mappingTypeCode:this.mapathleteForm.get('map_type')?.value
      };
      modalRef.componentInstance.compInstanceDataGet = compInstanceData;
      modalRef.result
      .then(() => this.changeCoach(this.mapathleteForm.get('coach')?.value))
      // .catch(() => this.changeCoach({value: this.mapathleteForm.get('coach')?.value}));
      .catch(() => this.changeCoach(this.mapathleteForm.get('coach')?.value));
    }else{
      this.mapathleteForm.markAllAsTouched()
    }
    
  }
  
  onDropDownClick(dropDownType: 'DISCIPLINE' | 'COACH') {
    if (dropDownType === 'DISCIPLINE' && !this.mapathleteForm.get('map_type')?.value)
      this.mapathleteForm.get('sport')?.markAsTouched(); 
    else if (dropDownType === 'COACH' && !this.mapathleteForm.get('sport')?.value)
      this.mapathleteForm.get('coach')?.markAsTouched(); 
  }

  editEndDate(elementRowData:any){
    elementRowData.roleId = this.mapathleteForm.value.map_type
    const modalRef =  this.modalService.open(EditAthleteOfficialMappingDateComponent,{size:'lg',centered:true});
    modalRef.componentInstance.rowData = elementRowData;
    modalRef.result.then((thenRes)=>{
      if(thenRes){
        this.changeCoach(this.mapathleteForm.get('coach')?.value)
      }
    })
    .catch((catchRes)=>console.log(catchRes))
    }
  
}
