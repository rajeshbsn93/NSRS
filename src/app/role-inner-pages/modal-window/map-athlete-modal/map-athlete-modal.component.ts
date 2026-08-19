import { CommonModule, DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { first, map } from 'rxjs';
import { LoaderComponent } from 'src/app/standalone_components/loader/loader.component';
import { MaterialModule } from 'src/app/_common/material.module';
import { MY_DATE_FORMATS } from 'src/app/_common/models/my_dateFormat';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { AcademyMappedAthletesEntity, AcademySharableService } from 'src/app/_common/services/role-inner-pages-services/academy-services/academySharable.service';
import { AcademyOfficialAthleteMappingEntity, DelegateMappingService } from 'src/app/_common/services/role-inner-pages-services/academy-services/delegate-mapping.service';
import { AthleteOfficialInfoService } from 'src/app/_common/services/role-inner-pages-services/athlete-services/athlete-official-info.service';


export interface AthleteMapEntity {
  player_detail_id: number,
  nsrsId: string,
  name: string,
  academy_date_of_joining: string,
  coach_fromDate: null,
  coach_toDate: null,
  isMapped: boolean,
  trainingLevel_id:number
}


@Component({
  selector: 'app-map-athlete-modal',
  templateUrl: './map-athlete-modal.component.html',
  styleUrls: ['./map-athlete-modal.component.css'],
  standalone:true,
  imports:[CommonModule,MaterialModule,ReactiveFormsModule,LoaderComponent],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter},
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS},
    // DelegateMappingService,
    DatePipe
  ]
})
export class MapAthleteModalComponent implements OnInit {

  form:FormGroup = this._fb.group({
    items: this._fb.array([])
  });
  displayedColumnsCoach: string[] = ['select', 'nsrsId','name', 'academy_date_of_joining','coach_fromDate','coach_toDate','trainingLevel_id','PA_Permissions'];
  displayedColumnsSportScientist: string[] = ['select', 'nsrsId','name', 'academy_date_of_joining','coach_fromDate','coach_toDate','PA_Permissions'];
  dataSource:any;
  compInstanceDataGet:any;
  iscoachOptionLoader:boolean = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  trainingLevelLoader:boolean = false;
  trainingLevelData:any;
  formGroupSchema = {
    isMapped: null,
    academy_date_of_joining: null,
    coach_fromDate: [{value: null, disabled: true}, Validators.required],
    coach_toDate: {value: null, disabled: true},
    paPermission: {value: 'ALL', disabled: true},
    name: null,
    nsrsId: null,
    player_detail_id: null
  }
  
  constructor(
    public activeModal: NgbActiveModal,
    private academySharableService: AcademySharableService,
    private _fb:FormBuilder,
    private delegateMappingService: DelegateMappingService,
    private datePipe: DatePipe,
    private alertService: AlertService,
    private athleteOfficialInfoService:AthleteOfficialInfoService
  ) {}

  ngOnInit() {
    this.dataSource = new MatTableDataSource<AcademyMappedAthletesEntity>([]);
    this.getTrainingLevelMaster();
    this.fetchTableData() 
  }

  getTrainingLevelMaster(){
    this.trainingLevelLoader = true;
    this.trainingLevelData = []
    this.athleteOfficialInfoService.getTrainingLevelMaster(this.compInstanceDataGet.role_id).subscribe({
      next:(res:any)=>{
        this.trainingLevelLoader = false
        this.trainingLevelData = res
      },
      error:(err)=>{
        this.trainingLevelLoader = false;
        console.error(err)
      }
    })
  }



  get itemsFormArray(): FormArray {
    return this.form.get('items') as FormArray;
  }

  patchFormGroup(record: AcademyMappedAthletesEntity) {
    return this._fb.group({
      isMapped: record.isMapped,
      academy_date_of_joining: record.academy_date_of_joining ? this.datePipe.transform(record.academy_date_of_joining, 'dd-MM-yyyy') : null,
      coach_fromDate: [{value: null, disabled: true}, Validators.required],
      coach_toDate: {value: null, disabled: true},
      paPermission: {value: 'ALL', disabled: true},
      name: record.name,
      nsrsId: record.nsrsId,
      player_detail_id: record.player_detail_id,
      trainingLevel:[{value:null, disabled: true}, this.compInstanceDataGet.mappingTypeCode==2 ? Validators.required : Validators.nullValidator]

    })
  }
  
  fetchTableData(){
    const academy_detail_id = this.compInstanceDataGet.academy_detail_id;
    const official_detail_id = this.compInstanceDataGet.official_detail_id;
    const sportId = this.compInstanceDataGet.sportId;
    this.iscoachOptionLoader = true;
    this.itemsFormArray.clear();
    this.academySharableService.get_Academy_Mapped_Athletes(academy_detail_id,official_detail_id,sportId)
   .pipe(first(),map((res:AcademyMappedAthletesEntity[]) => {
      const newRes = res.filter((item) => !item.isMapped).map((item) => {
        return {...item, pa_permissions: 'ALL'};
      });
      return newRes;
    })).subscribe({
      next: (response: AcademyMappedAthletesEntity[]) => {
        response.forEach((item: AcademyMappedAthletesEntity) => this.itemsFormArray.push(this.patchFormGroup(item)));
        this.iscoachOptionLoader = false;
        this.dataSource.data = this.itemsFormArray.controls;
        this.dataSource.paginator = this.paginator;

        this.dataSource.sortingDataAccessor = (item: AbstractControl, property: string) => {
          switch (property) {
            case 'name': case 'nsrsId':
              return item.value?.[property]?.toLowerCase();
            case 'academy_date_of_joining':
              return new Date(item.value[property].split('-').reverse().join('-'));
            default:
              return item.value[property].value;
            }
        };
        this.dataSource.filterPredicate = (data: AbstractControl, filter: string) => {
          return data.value.name?.toLowerCase().includes(filter) || 
            data.value.nsrsId?.toLowerCase().includes(filter) ||
            data.value.academy_date_of_joining.includes(filter);
        }
        this.dataSource.sort = this.sort;
      },
      error: () => {
        this.iscoachOptionLoader = false;
        this.alertService.swalPopErrorTimer('Something went wrong! Please try again');
      }
    })
  }

  isAllSelectedMapAthlete() {
    return this.itemsFormArray.getRawValue().every((item: any) => item.isMapped);
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggleMapAthlete(event: MatCheckboxChange) {
    if (!event.checked) {
      this.itemsFormArray.controls.forEach((formGroup: AbstractControl) => {
        formGroup.get('coach_fromDate')?.disable();
        formGroup.get('coach_fromDate')?.setValue(null);
        formGroup.get('coach_toDate')?.disable();
        formGroup.get('coach_toDate')?.setValue(null);
        formGroup.get('paPermission')?.disable();
        formGroup.get('paPermission')?.setValue('ALL');
        formGroup.get('isMapped')?.setValue(false);
        formGroup.get('trainingLevel')?.disable();
        formGroup.get('trainingLevel')?.setValue(null);
      });
      
    } else {
      this.itemsFormArray.enable();
      this.itemsFormArray.controls.forEach((formGroup:any) => formGroup.get('isMapped')?.setValue(true));
    }
  }

  onCheckboxClick(event: MatCheckboxChange, formGroup: AbstractControl) {
    if (event.checked) formGroup.enable();
    else {
      formGroup.get('coach_fromDate')?.disable();
      formGroup.get('coach_fromDate')?.setValue(null);
      formGroup.get('coach_toDate')?.disable();
      formGroup.get('coach_toDate')?.setValue(null);
      formGroup.get('paPermission')?.disable();
      formGroup.get('paPermission')?.setValue('ALL');
      formGroup.get('trainingLevel')?.disable();
      formGroup.get('trainingLevel')?.setValue(null);
    }
  }

  save(){
    if (!this.itemsFormArray.controls.some((item: AbstractControl) => item.value.isMapped)) {
      this.alertService.swalPopWarning('Please select an athlete to proceed!');
      return;
    }

    let dataToSend: AcademyOfficialAthleteMappingEntity[] = [];
    this.dataSource.data.filter((item: AbstractControl) => item.value.isMapped).forEach((item: any) => {
      dataToSend.push({
        athleteid: item.value.player_detail_id,
        fromdate: this.datePipe.transform(item.value.coach_fromDate, 'yyyy-MM-dd')!,
        todate: item.value.coach_toDate ? this.datePipe.transform(item.value.coach_toDate, 'yyyy-MM-dd') : null,
        pa_permission: item.value.paPermission,
        trainingLevel_id: item.value.trainingLevel ? item.value.trainingLevel : 0
      });
    });
    this.delegateMappingService.saveAcademyOfficialAthleteMapping(
      dataToSend,
      this.compInstanceDataGet.academy_detail_id,
      this.compInstanceDataGet.coachList.official_detail_id,
      this.compInstanceDataGet.role_id
      ).pipe(first()).subscribe({
        next: (response: any) => {
          if (response) {
            this.activeModal.close();
            this.alertService.swalPopSuccessTimer('Athlete Mapping Successful!');
          } else {
            this.alertService.swalPopError('Something went wrong! Please try again');
          }
        },
        error: (errorResponse: HttpErrorResponse) => {
          this.alertService.swalPopError('Something went wrong! Please try again');
        }
      });
  }

  getMinDate(formGroup: AbstractControl) {
    return this.compInstanceDataGet.coachList.date_of_joining && formGroup.value.academy_date_of_joining
    ? new Date(Math.max.apply(
      null,
      [
        new Date(this.compInstanceDataGet.coachList.date_of_joining).getTime(),
        new Date(formGroup.value.academy_date_of_joining.split('-').reverse().join('-')).getTime()
      ]
    ))
    : null;
  }

  isIndeterminateCheck() {
    return this.dataSource.data.some((formGroup: AbstractControl) => formGroup.value.isMapped) &&
    !this.dataSource.data.every((formGroup: AbstractControl) => formGroup.value.isMapped);
  }

  isAllSelectedCheck() {
    return this.dataSource.data.every((formGroup: AbstractControl) => formGroup.value.isMapped);
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue ? filterValue.trim().toLowerCase() : filterValue;
  }
}
