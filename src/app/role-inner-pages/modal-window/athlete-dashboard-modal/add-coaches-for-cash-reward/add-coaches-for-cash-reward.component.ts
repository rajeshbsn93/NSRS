import { CommonModule, DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { MaterialModule } from 'src/app/_common/material.module';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { AthleteCoachACTCService } from 'src/app/_common/services/common-services/athlete-coach-Actc.service';
import { LoaderComponent } from 'src/app/standalone_components/loader/loader.component';

@Component({
  selector: 'app-add-coaches-for-cash-reward',
  templateUrl: './add-coaches-for-cash-reward.component.html',
  styleUrls: ['./add-coaches-for-cash-reward.component.css'],
  standalone:true,
  imports:[CommonModule,MaterialModule,ReactiveFormsModule,LoaderComponent],
  providers:[DatePipe]
})
export class AddCoachesForCashRewardComponent implements OnInit {
  addCoachForm!:FormGroup;
  @ViewChild('insttSearch', {static: false}) insttSearch?: ElementRef<HTMLInputElement>;
  loader:boolean = false;
  subject:Subject<any> = new Subject();
  filterAthleteACTCCoachData:any;
  subscription:Subscription = new Subscription();
  insttNameSearch: FormControl = new FormControl(null);
  userDetails:any;
  AthleteACTCCoachListData:any;
  rowData:any;
  filterNSRSIDChangeData:any;


  constructor(
    public activeModal:NgbActiveModal,
    private fb:FormBuilder,
    // private storageService:StorageService, 
    private alertService:AlertService,
    private athleteCoachActcService:AthleteCoachACTCService,
    private datePipe:DatePipe
    ) { }

  ngOnInit() {
    // console.log(this.rowData)
    // this.userDetails = this.storageService.getUserDetails();
    this.addCoachForm = this.fb.group({
      nsrs_id:['',Validators.required],
      coach:[{value:'', disabled:true},Validators.required],
      period:[{value:'', disabled:true},Validators.required],
      level:[{value:'', disabled:true},Validators.required],
      mapping_type:[{value:'', disabled:true},Validators.required],
    });
    this.subscription.add(
      this.insttNameSearch.valueChanges.subscribe((value) => {
        if (value && this.AthleteACTCCoachListData?.length)
          this.filterAthleteACTCCoachData = this.AthleteACTCCoachListData.filter(
            (item:any) => item.coachName?.toLowerCase()?.trim()?.includes(value?.toLowerCase()?.trim()) || item.coach_kitd_unique_id?.toLowerCase()?.trim()?.includes(value?.toLowerCase()?.trim())
          );
        else this.filterAthleteACTCCoachData = this.AthleteACTCCoachListData;
      })
    );
    this.getAtheleteACTCCoachDetail()
  }
  getAtheleteACTCCoachDetail(){
    this.loader = true
    this.athleteCoachActcService.getAtheleteACTCCoachDetail(
      this.rowData.Player_Detail_id,
      this.rowData.proposal_Id,
      this.rowData.event_id
    ).pipe(takeUntil(this.subject)).subscribe({
      next:(res:any)=>{
        this.loader = false;
        this.AthleteACTCCoachListData= this.filterAthleteACTCCoachData = res.data
      },
      error:(err)=>{
        this.loader = false;
        console.error(err)
      }
    })
  }
  onInsttNameSelectOpen() {
    this.insttSearch?.nativeElement.focus();
  }
  
  onInsttSearchBlur() {
    setTimeout(() => {
      this.insttNameSearch.setValue('');
    }, 400);
  }
  nsrsidChange(event:any){
    this.filterNSRSIDChangeData = []
    if(event){
      this.filterNSRSIDChangeData = this.AthleteACTCCoachListData.filter((item:any)=>item.srNo==event)
      this.addCoachForm.patchValue({
        coach:this.filterNSRSIDChangeData[0].coachName,        
        period:typeof(this.filterNSRSIDChangeData[0].toDate)!='object' ? this.datePipe.transform(this.filterNSRSIDChangeData[0].fromDate,'dd/MM/yyyy') + ' - '+this.datePipe.transform(this.filterNSRSIDChangeData[0].toDate,'dd/MM/yyyy'): this.datePipe.transform(this.filterNSRSIDChangeData[0].fromDate,'dd/MM/yyyy') + ' - '+ 'Present',      
        level:this.filterNSRSIDChangeData[0].trainingLevel,        
        mapping_type:this.filterNSRSIDChangeData[0].mappedByType ==1 || this.filterNSRSIDChangeData[0].mappedByType ==2 ?'Manual' : 'Academy',        
      })
    }   
  }
  submit(){
    // console.log(this.addCoachForm.getRawValue())
    if(this.addCoachForm.valid){
      this.filterNSRSIDChangeData[0].proposal_Id = this.rowData.proposal_Id
      this.filterNSRSIDChangeData[0].eventId = this.rowData.event_id
      this.addCashAwardTrainingDetails(this.filterNSRSIDChangeData[0])
    }
    else{
      this.addCoachForm.markAllAsTouched();
    }
  }
  addCashAwardTrainingDetails(payload:any){
    this.loader = true;
    this.athleteCoachActcService.addCashAwardTrainingDetails(payload).pipe(takeUntil(this.subject)).subscribe({
      next:(response:any)=>{
        this.loader = false;
        // console.log(response)
        if(response.status){
          this.alertService.swalPopSuccess(response.error)
          this.activeModal.close(response.status)
        }else{
          this.alertService.swalPopError(response.error)
        }
      },
      error:(err)=>{
        this.loader = false;
        console.error(err)
      }
    })
  }

  ngOnDestroy(): void {
    this.subject.unsubscribe();
    this.subscription.unsubscribe();
  }

}
