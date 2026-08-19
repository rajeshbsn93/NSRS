import { SelectionModel } from '@angular/cdk/collections';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelectChange } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { first, Observable, of } from 'rxjs';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { StorageService } from 'src/app/_common/services/common-services/storage.service';
import { AcademySharableService } from 'src/app/_common/services/role-inner-pages-services/academy-services/academySharable.service';
import { AthleteDelegate, CoachDelegate, CoachEntity, DelegateMappingEntity, DelegateMappingService } from 'src/app/_common/services/role-inner-pages-services/academy-services/delegate-mapping.service';
import { SportscientistDetailListService } from 'src/app/_common/services/role-inner-pages-services/academy-services/sportscientist-detail-list.service';

@Component({
  selector: 'app-delegate-mapping',
  templateUrl: './delegate-mapping.component.html',
  styleUrls: ['./delegate-mapping.component.css']
})
export class DelegateMappingComponent implements OnInit {
  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  @ViewChildren(MatSort) sort = new QueryList<MatSort>();
  @ViewChild('coachSearch') coachSearch!: ElementRef<HTMLInputElement>;
  @ViewChild('athleteSearch') athleteSearch!: ElementRef<HTMLInputElement>;
  isLoading: boolean = false;
  coachData = new MatTableDataSource<CoachDelegate>();
  athleteData = new MatTableDataSource<AthleteDelegate>();
  coachSelection = new SelectionModel<CoachDelegate>(true, []);
  athleteSelection = new SelectionModel<AthleteDelegate>(true, []);
  coachList$!: Observable<CoachEntity[]>; 
  sportsList$!: Observable<any>;
  coachTableColumns: string[] = ['isMapped', 'nsrsId', 'coachName', 'sports'];
  athleteTableColumns: string[] = ['isMapped', 'nsrsId', 'athleteName', 'sports'];
  mappingTypeControl: FormControl = new FormControl(null, Validators.required);
  disciplineControl: FormControl = new FormControl(null, Validators.required);
  mainCoachControl: FormControl = new FormControl(null, Validators.required);
  academyDetails:any


  constructor(
    private storageService: StorageService,
    private delegateMappingService: DelegateMappingService,
    private alertService: AlertService,
    private sportsDisciplineService: SportscientistDetailListService,
    private academySharableService: AcademySharableService
  ) {}

  ngOnInit() {
    this.academyDetails=this.storageService.getAcademyDetails()
  }

  isAllSelectedMapAthlete(table: 'COACH' | 'ATHLETE') {
    const numSelected = table === 'COACH' ? this.coachSelection.selected.length : this.athleteSelection.selected.length;
    const numRows = table === 'COACH' ?  this.coachData.data.length : this.athleteData.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggleMapAthlete(task: 'COACH' | 'ATHLETE') {
    if (this.isAllSelectedMapAthlete(task)) {
      if (task === 'COACH') {
        this.coachSelection.clear();
      }
      else {
        this.athleteSelection.clear();
      }
    } else {
      if (task === 'COACH') {
        this.coachData.data.forEach(row => this.coachSelection.select(row));
      }
      else {
        this.athleteData.data.forEach(row => this.athleteSelection.select(row));
      }
    }
    //console.log(this.coachSelection.selected, this.athleteSelection.selected);
  }

  onMainCoachChange(event: MatSelectChange) {
    this.isLoading = true;
    this.coachSelection.clear();
    this.athleteSelection.clear();
    this.coachSearch.nativeElement.value = '';
    this.athleteSearch.nativeElement.value = '';
    this.delegateMappingService.getDataForDelegateMapping(this.storageService.getUserDetails().user_id, event.value)
    .pipe(first()).subscribe({
      next: (response: DelegateMappingEntity) => {
      this.isLoading = false;
      this.coachData = new MatTableDataSource<CoachDelegate>(response.coach_delegate_mapping);
      this.athleteData = new MatTableDataSource<AthleteDelegate>(response.athlete_delegate_mapping);
      this.coachSelection.setSelection(...response.coach_delegate_mapping.filter((item: CoachDelegate) => item.isMapped));
      this.athleteSelection.setSelection(...response.athlete_delegate_mapping.filter((item: AthleteDelegate) => item.isMapped));
      setTimeout(() => {
        this.coachData.paginator=this.paginator.toArray()[0];
        this.athleteData.paginator=this.paginator.toArray()[1];
        this.coachData.sort = this.sort.toArray()[0];
        this.athleteData.sort = this.sort.toArray()[1];
      }, 200);
    },
    error: (errorResponse: HttpErrorResponse) => {
      this.isLoading = false;
      console.error('Delegate Mapping Data Error: ', errorResponse.error);
    }
  })
  }

  changeMapType(event: MatSelectChange) {
    this.disciplineControl.reset();
    this.mainCoachControl.reset();
    this.coachList$ = of([]);
    if(event.value == 2) {
      this.sportsList$ = this.academySharableService.getAcademySportsDiscipline(this.academyDetails.user_id).pipe(first());
    }
    if(event.value == 103) {
      this.sportsList$ = this.academySharableService.ssCatList().pipe(first());
    }
  }

  onDisciplineChange(event: MatSelectChange) {
    this.mainCoachControl.reset();
    this.coachList$ = this.delegateMappingService.getCoachList(
      this.storageService.getUserDetails().user_id,
      this.mappingTypeControl.value,
      this.disciplineControl.value
      );
  }

  onSave() {
    if (!this.coachSelection.selected.length || !this.athleteSelection.selected.length) {
      this.alertService.swalPopWarning('Please select atleast one Coach and one Athlete!');
      return;
    }
    this.isLoading = true;
    let coaches: string = this.coachSelection.selected.map((item: CoachDelegate) => item.official_detail_id).join(',');
    let athletes: string = this.athleteSelection.selected.map((item: AthleteDelegate) => item.player_detail_id).join(',');
    this.delegateMappingService.saveDelegationMappingData(
      this.mainCoachControl.value,
      this.storageService.getUserDetails()?.user_id,
      coaches,
      athletes
      ).subscribe({
        next: (response: any) => {
          this.onMainCoachChange({value: this.mainCoachControl.value} as MatSelectChange);
          this.alertService.swalPopSuccessTimer('Update Successful!');
        },
        error: (errorResponse: HttpErrorResponse) => {
          this.isLoading = false;
          console.error('Error in saving Delegate Mapping data', errorResponse.error);
          this.alertService.swalPopErrorTimer('Update Failed! Please try again');
        }
      });
  }

  onDropDownClick(dropDownType: 'DISCIPLINE' | 'COACH') {
    if (dropDownType === 'DISCIPLINE' && !this.mappingTypeControl.value)
      this.disciplineControl.markAsTouched(); 
    else if (dropDownType === 'COACH' && !this.disciplineControl.value)
      this.mainCoachControl.markAsTouched(); 
  }

  applyFilter(filterValue: string, table: 'COACH' | 'ATHLETE') {
    if (table === 'COACH')
      this.coachData.filter = filterValue ? filterValue.trim().toLowerCase() : filterValue;
    else
      this.athleteData.filter = filterValue ? filterValue.trim().toLowerCase() : filterValue;
  }
}
