import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TournamentService } from '../../../_common/services/innerPagesServices/tournament.service';
import {SharableService} from '../../../_common/services/innerPagesServices/innerpagesSharable.service'
import * as moment from 'moment';
import {MY_DATE_FORMATS} from '../../../_common/models/my_dateFormat'
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { CommonModule, DatePipe } from '@angular/common';
import { AlertService } from '../../../_common/services/common-services/alert.service';
import { StorageService } from '../../../_common/services/common-services/storage.service';
import { MaterialModule } from 'src/app/_common/material.module';
import { LoaderComponent } from '../../loader/loader.component';
import { distinctUntilChanged, map, Observable, startWith, Subscription } from 'rxjs';
import { AutoCompleteService } from 'src/app/_common/services/innerPagesServices/auto-complete.service';
import { YearFormatDirective } from '../../directives/year-format.directive';
import { Moment } from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';

export interface PeriodicElement {
  nsrsid: string;
  name: number;
  discipline: string;
  gender: string;
  mobile: string;
  email: string;
  joiningDate: string;
}

@Component({
  selector: 'app-addTournament',
  templateUrl: './addTournament.component.html',
  styleUrls: ['./addTournament.component.css'],
  standalone:true,
  imports:[CommonModule,ReactiveFormsModule,MaterialModule,LoaderComponent,YearFormatDirective],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    DatePipe
  ]
})

export class AddTournamentComponent implements OnInit, OnDestroy {
  userDetails:any;
  addTournamentForm!:FormGroup;
  editTournamentForm!:FormGroup;
  countryList:any;
  stateList:any;
  cityList:any;
  tournamentCategory:any;
  sportList:any;
  elementRowData:any
  defaultTournamentCategory:any
  defaultTournamentLevel:any
  defaultCountry:any;
  defaultState:any;
  defaultCity:any;
  tournamentSaveRes:any;
  tournamentEditRes:any;
  ManageTournamentDetailData:any;
  tournamentSaveResManageEvent:any;
  tournamentSaveResID:any
  ManageDiscipline:any;
  lengthofManageDiscipline:any
  mappedLengthOfManageDiscipline:any=0
  ManageEventDetails:any;
  addTournamentMinDate:any
  ManageEventDetailsLength:any
  checkedEvents:any
  arrr:any=[]
  eventIdArray:any = []
  distinctEvents:any = []
  minTournamentStartDate:any
  manageTabActive:boolean = false;
  check:Boolean=true
  ageCategoryListRes:any;
  innerLoaderMainData:boolean = false;
  innerLoadersportList:boolean = false;
  innerLoaderCountryList:boolean = false;
  innerLoaderCategoryList:boolean = false;
  filteredCountryList$!: Observable<any>;
  filteredStateList$!: Observable<any>;
  filteredCityList$!: Observable<any>;
  subscription: Subscription = new Subscription();
  yearOfTournament:any

  constructor(public activeModal: NgbActiveModal, private fb:FormBuilder,
    private tournamentService:TournamentService,private alertService:AlertService,
    private sharableService:SharableService,private storageService:StorageService,
    private autoCompleteService: AutoCompleteService) { }

  ngOnInit() {
    this.userDetails=this.storageService.getUserDetails()
    this.setFormaddTournamentForm();
    this.manageEventTournamentForm();
    this.gettournamentCategoryList();
    // this.getSportList();
    this.getCountry();
    this.ageCategoryList()
    // console.log("addTournament Modal ",this.elementRowData)
    if(this.elementRowData!=null){
      //EDIT editing the existing tournament
      this.editAutofilledData();      
    }
    if(this.elementRowData==null){
      //ADD  new tourment created
       this.addTournamentForm.controls['disciplines'].setValidators(Validators.required)     
    }

    this.filteredCountryList$ = this.addTournamentForm.get('country')!.valueChanges.pipe(
      map(value => this.autoCompleteService.autoCompleteFilter(value || '', this.countryList, 'country_name'))
    );
  }

  setFormaddTournamentForm(){
    this.addTournamentForm = this.fb.group({
      tournamentCategoryId:['',Validators.required],
      // tournament_Name:['',Validators.required],
      tournamentEdition:['',Validators.required],
      tournamentYear:['',Validators.required],
      // tournamentLevel:['',Validators.required],
      category:['',Validators.required],
      // ageCategory:['',Validators.required],
      disciplines:this.disciplines,
      startDate:['',Validators.required],
      endDate:['',Validators.required],
      place:['',Validators.required],
      country:['',Validators.required],
      state:['',Validators.required],
      city:['',Validators.required],
      tournament_Name:['',Validators.required],
      cash_Reward:[{ value: '', disabled: this.elementRowData ? true :false },Validators.required]
    })

    this.subscription.add(this.addTournamentForm.get('country')?.statusChanges.pipe(distinctUntilChanged()).subscribe((status: string) => {
      if (status === 'VALID') {
        const countryId = this.countryList.filter((item: any) => item.country_name === this.addTournamentForm.get('country')?.value)?.[0]?.id || null;
        this.onChangeCountry(countryId);
      } else if (status === 'INVALID') {
        this.stateList = [];
        this.cityList = [];
        this.filteredStateList$ = this.addTournamentForm.get('state')!.valueChanges.pipe(
          map(value => this.autoCompleteService.autoCompleteFilter(value || '', this.stateList, 'state_name'))
        );
        this.filteredCityList$ = this.addTournamentForm.get('city')!.valueChanges.pipe(
          map(value => this.autoCompleteService.autoCompleteFilter(value || '', this.cityList, 'city_name'))
        );
        this.addTournamentForm.get('state')?.setValue('');
        this.addTournamentForm.get('city')?.setValue('');
      }
    }));
    
    this.subscription.add(this.addTournamentForm.get('state')?.statusChanges.pipe(distinctUntilChanged()).subscribe((status: string) => {
      if (status === 'VALID') {
        const stateId = this.stateList.filter((item: any) => item.state_name === this.addTournamentForm.get('state')?.value)?.[0]?.id || null;
        this.onChangeState(stateId);
      } else if (status === 'INVALID') {
        this.cityList = [];
        this.filteredCityList$ = this.addTournamentForm.get('city')!.valueChanges.pipe(
          map(value => this.autoCompleteService.autoCompleteFilter(value || '', this.cityList, 'city_name'))
        );
        this.addTournamentForm.get('city')?.setValue('');
      }
    }));
  }

  disciplines = new FormControl('',);

  manageEventTournamentForm(){
    this.editTournamentForm = this.fb.group({
       tournament_Name:['',Validators.required],
      international_game:['',Validators.required],
      period_start:['',Validators.required],
      // international:['',Validators.required],
      senior:['',Validators.required],
      discipline:['',Validators.required],
      //ManageEventCheckArray:this.fb.array([])
      eventCheckboxArray:this.fb.array([]),
      eventUncheckboxArray:this.fb.array([])
    })
  }

  get eventCheckboxArray() : FormArray {
    return this.editTournamentForm.get("eventCheckboxArray") as FormArray
  }
  get eventUncheckboxArray() : FormArray {
    return this.editTournamentForm.get("eventUncheckboxArray") as FormArray
  }

  gettournamentCategoryList(){
    this.innerLoaderMainData = true
    this.tournamentService.tournamentCategoryList().subscribe((res:any)=>{
      this.innerLoaderMainData = false;
      const filterTournamentCategories = res.filter((item:any)=>item.nat_Int_Level !==null)
      // console.log(filterTournamentCategories)
      // this.tournamentCategory = res;
      this.tournamentCategory = filterTournamentCategories;
      if(this.elementRowData!=null){
        //mapping data to tournament category input on ADD TOURNAMENT
        this.defaultTournamentCategory=Number(this.elementRowData.tournament_Category_Id)
      }
    })
  }

  ageCategoryList(){
    this.innerLoaderCategoryList = true
    this.sharableService.ageCatergoryList().subscribe({
      next:(res)=>{
        this.innerLoaderCategoryList = false
        this.ageCategoryListRes=res
        if(this.elementRowData!=null){
          // this.addTournamentForm.controls['ageCategory'].setValue(this.elementRowData.age_group)
        }
      },
      error:()=>{
        console.error('error caught in ageCategory List') 
        this.innerLoaderCategoryList=false
      }
    })
  }

  changeTournamentCategory(tournamentCategoryId:any){
    this.addTournamentForm.get('disciplines')?.reset('');
    let filterData = this.tournamentCategory.filter((item:any)=>item.tournament_category_id==tournamentCategoryId)
    // console.log(filterData)
    this.getSportList(filterData[0].sport_detail_id)
  }
  clickDiscipline(){
    if(this.elementRowData==null && this.addTournamentForm.get('tournamentCategoryId')?.value=='') this.alertService.swalPopWarning('Please select tournament category')
  }
  getSportList(sportDetailId?:number){
    this.sportList = []
    this.innerLoadersportList = true
    this.sharableService.sportList().subscribe({
      next:(res:any)=>{
        this.innerLoadersportList = false
        if(sportDetailId==0){
          this.sportList = res
        }else{
          const filterSportList = res.filter((item:any)=>item.sport_detail_id==sportDetailId);
          // console.log('filterSportList',filterSportList)
          this.sportList = filterSportList
        }
      },
      error:()=>{
        console.error('error caught in sport list')
        this.innerLoadersportList=false
      }
    })
  }

  getCountry(){
    this.innerLoaderCountryList=true
    this.tournamentService.countryMasterList().subscribe({
      next:(res)=>{
        this.countryList = res
        this.innerLoaderCountryList=false
        if(this.elementRowData!=null){
          //mapping data to tournament Country input on ADD TOURNAMENT
          //this.defaultCountry=Number(this.elementRowData.venue_country);
          this.addTournamentForm.controls['country'].setValue(
            this.countryList.filter((item: any) => item.id === this.elementRowData.venue_country)[0].country_name
          );
        }
        this.addTournamentForm.get('country')?.addValidators(
          this.autoCompleteService.autoCompleteValidator(
            this.addTournamentForm.get('country')!, this.countryList, 'country_name', 'country'
          )
        )
        this.addTournamentForm.get('country')?.updateValueAndValidity();
      },
      error:()=>{
        console.error("error caught in Mastercountry List")
        this.innerLoaderCountryList=false
      }
    })
  }

  getState(countryId:number){
    this.innerLoaderMainData = true
    this.tournamentService.stateMasterList(countryId).subscribe({
      next:(res)=>{
        this.innerLoaderMainData = false
        this.stateList = res;
        this.filteredStateList$ = this.addTournamentForm.get('state')!.valueChanges.pipe(
          startWith(''),
          map(value => this.autoCompleteService.autoCompleteFilter(value || '', this.stateList, 'state_name'))
        );
        this.addTournamentForm.get('state')?.setValidators(
          [
            Validators.required,
            this.autoCompleteService.autoCompleteValidator(
              this.addTournamentForm.get('state')!, this.stateList, 'state_name', 'state'
            )
          ]
        )
        this.addTournamentForm.get('state')?.updateValueAndValidity();
        if(this.elementRowData!=null){
          //mapping data to tournament State input on ADD TOURNAMENT
          //this.defaultCountry=Number(this.elementRowData.venue_state);
          this.addTournamentForm.controls['state'].setValue(
            this.stateList.filter((item: any) => item.id === this.elementRowData.venue_state)?.[0]?.state_name || null
          );
        }
      },
      error:()=>{
        console.error('error caught in state list')
        this.innerLoaderMainData=false
      }
    })
  }

  getCity(stateid:any){
    this.innerLoaderMainData = true
    this.tournamentService.cityMasterList(stateid).subscribe({
      next:(res)=>{
        this.innerLoaderMainData = false
        this.cityList = res;
        this.filteredCityList$ = this.addTournamentForm.get('city')!.valueChanges.pipe(
          startWith(''),
          map(value => this.autoCompleteService.autoCompleteFilter(value || '', this.cityList, 'city_name'))
        );
        this.addTournamentForm.get('city')?.setValidators(
          [
            Validators.required,
            this.autoCompleteService.autoCompleteValidator(
              this.addTournamentForm.get('city')!, this.cityList, 'city_name', 'city'
            )
          ]
        )
        this.addTournamentForm.get('city')?.updateValueAndValidity();
        if(this.elementRowData!=null){
          //mapping data to tournament City input on ADD TOURNAMENT
          this.addTournamentForm.controls['city'].setValue(
            this.cityList.filter((item: any) => item.id === this.elementRowData.venue_city)?.[0]?.city_name || null
          )
        }
      },
      error:()=>{
        console.error("error caught in cityMaster list")
        this.innerLoaderMainData = false
      }
    })
  }

  editAutofilledData(){
    // console.log("editAutofilledData",this.elementRowData)
     this.addTournamentForm.controls['tournament_Name'].setValue(this.elementRowData.tournament_Name)
    this.addTournamentForm.controls['tournamentEdition'].setValue(this.elementRowData.tournament_Edition)
    this.addTournamentForm.controls['tournamentYear'].setValue(new Date((this.elementRowData.tournament_Year),0,1));
    this.yearOfTournament = this.elementRowData.tournament_Year
    // this.defaultTournamentLevel=this.elementRowData.tournament_Level;
    // this.addTournamentForm.controls['tournamentLevel'].setValue(this.defaultTournamentLevel)
    this.addTournamentForm.controls['category'].setValue(this.elementRowData.category)
    this.addTournamentForm.controls['place'].setValue(this.elementRowData.venue);
    this.addTournamentForm.controls['cash_Reward'].setValue(this.elementRowData.cash_Reward? "1":"0");
    this.getState(this.elementRowData.venue_country);
    this.getCity(this.elementRowData.venue_state)
    this.addTournamentForm.patchValue({
      startDate: moment(this.elementRowData.from_Date),
      endDate:moment(this.elementRowData.to_date)
    });
    this.setValuesManageEventsAdd(this.elementRowData);
    this.setManageDiscipline(this.elementRowData.tournament_Detail_Id)
  }


  setValuesManageEventsAdd(addTournamentData:any){
    if(this.elementRowData!=null){
      //setting Edit values on tab manage event
      this.editTournamentForm.controls['tournament_Name'].setValue(addTournamentData.tournament_Name);
      this.editTournamentForm.controls['international_game'].setValue(addTournamentData.tournament_Category_Name);
      
     
      var periodDate = moment(addTournamentData.from_Date).format('DD-MM-YYYY')
      var toDate = moment(addTournamentData.to_date).format('DD-MM-YYYY')
      // this.editTournamentForm.
      this.editTournamentForm.patchValue({
        period_start: (periodDate + ' To ' + toDate)
      })
      // this.editTournamentForm.controls['international'].setValue(addTournamentData.tournament_Level);
      this.editTournamentForm.controls['senior'].setValue(addTournamentData.category);

    }else{
    //setting Add values on tab manage event
    if(this.tournamentSaveResID!=''){
       this.editTournamentForm.controls['tournament_Name'].setValue(addTournamentData.tournament_Name);      
      var international_gameData = this.tournamentCategory.filter((data:any)=>{
        if(data.tournament_category_id === addTournamentData.tournamentCategoryId){
          return data;
        }
      })
      this.editTournamentForm.controls['international_game'].setValue(international_gameData[0].tournament_calegory_name);
      var periodDate = moment(addTournamentData.startDate).format('DD-MM-YYYY')
      //this.editTournamentForm.controls['tournament_name'].setValue(addTournamentData.tournament_Name)
      var toDate = moment(addTournamentData.endDate).format('DD-MM-YYYY')
      this.editTournamentForm.patchValue({
        period_start: (periodDate+' To '+toDate)
      })
      // this.editTournamentForm.controls['international'].setValue(addTournamentData.tournamentLevel);
      this.editTournamentForm.controls['senior'].setValue(addTournamentData.category);
    }
  }
    
  }

  setValuesManageEventsEdit(editTournamentData:any){
    this.editTournamentForm.controls['tournament_Name'].setValue(editTournamentData.tournament_Name);
    // var tournament_Category=this.tournamentCategory.filter()
    var tournament_Category = this.tournamentCategory.filter((data:any)=>{
      if(data.tournament_category_id == editTournamentData.tournamentCategoryId){
        return data;
      }
    })
    this.editTournamentForm.controls['international_game'].setValue(tournament_Category[0].tournament_calegory_name);
    var periodDate = moment(editTournamentData.startDate).format('DD-MM-YYYY')
    var toDate = moment(editTournamentData.endDate).format('DD-MM-YYYY')
    this.editTournamentForm.patchValue({
      period_start: (periodDate+' To '+toDate)
    })
    // this.editTournamentForm.controls['international'].setValue(editTournamentData.tournamentLevel);
    this.editTournamentForm.controls['senior'].setValue(editTournamentData.category);
  }

  onChangeCountry(countryid:any){
    if(countryid !== null ){
      this.stateList=[];
      this.addTournamentForm.controls['state'].setValue('');   
      this.addTournamentForm.controls['city'].setValue('');   
      this.getState(countryid)
    }
    
  }
  onChangeState(stateid:any){
    if(stateid !== null){
      this.addTournamentForm.controls['city'].setValue('');
      this.getCity(stateid)
    }
    
  }

  keyPressDenied() {
    return false
  } 

  setManageDiscipline(tournament_detail_id:any){
    this.innerLoaderMainData = true;
    this.tournamentService.getManageDiscipline(tournament_detail_id).subscribe(res=>{
      this.innerLoaderMainData = false;
    this.ManageDiscipline = res;
    this.lengthofManageDiscipline=this.ManageDiscipline?.length
    for(let data of this.ManageDiscipline){
      if(data.isMapped!=0){
        this.mappedLengthOfManageDiscipline++;
      }
    }
    },()=>{
      console.error("error caught in getManagediscipline")
      this.innerLoaderMainData=false
    })
  }
  addTournamentStartDate(startDate:any){
    this.addTournamentMinDate = startDate
  }
  

  manageDisciplineChange(event:any){
    this.eventCheckboxArray.clear()
    this.eventUncheckboxArray.clear()
    this.innerLoaderMainData = true;
    this.tournamentService.GetEventdetailSportwise(event).subscribe(res=>{ 
      this.innerLoaderMainData = false;
      this.ManageEventDetails = res;
      this.ManageEventDetailsLength = this.ManageEventDetails.length
      if(this.elementRowData!=null){
        //edit tournament
        this.eventListMapping(this.elementRowData.tournament_Detail_Id,event)
        
      }else{
        //add tournament
         this.eventListMapping(this.tournamentSaveRes.value,event)
      }
    },(error)=>{
      console.error('error caught in eventdetailsSportWise')
      this.innerLoaderMainData=false
    })
  }

  ditinctEvents(ManageEventDetails:any,checkedEvents:any){
    var distinctEvent:any=[]
    var a = ManageEventDetails
      var b = checkedEvents
      var idsOfA:any = [];
      var idsOfB:any = []
      a.forEach((item:any) => idsOfA.push(item.event_id))
      b.forEach((item:any) => idsOfB.push(item.event_Id))
      
      var filteredArray = idsOfA.filter((e:any) => idsOfB.indexOf(e) < 0);
     
      a.forEach((item:any) => {
        filteredArray.forEach((element:any) => {
          if(item.event_id == element){
            distinctEvent.push(item)
          }
        })
      })
    return distinctEvent
  }

  eventListMapping(tournamentId :any,sportid:any){
    this.distinctEvents = [];
    this.innerLoaderMainData = true;
    this.tournamentService.eventList(tournamentId ,sportid).subscribe(res=>{
      this.innerLoaderMainData = false;
      this.checkedEvents=res
      this.check=true
      this.distinctEvents=this.ditinctEvents(this.ManageEventDetails,this.checkedEvents)
      this.checkedEvents.forEach(()=>this.disableAddCheckBoxes())
      this.distinctEvents.forEach(() =>this.addCheckBoxes())
    }) 
  }
  eventCheckboxChange(itemData:any,id:any){
    if(itemData.value==true){
      this.eventIdArray.push(id)
    }else{
      for(let i in this.eventIdArray){
        if(this.eventIdArray[i]==id){
          delete this.eventIdArray[i];
        }
      }
    }
  }

  private addCheckBoxes(){
     this.eventUncheckboxArray.push(new FormControl(false));
  }

  private disableAddCheckBoxes(){
    this.eventCheckboxArray.push(new FormControl(true));
    this.eventCheckboxArray.disable()
  }
  handleYearSelected(event:Moment,yearEstablish: MatDatepicker<Moment>) {
    // console.log(event.toDate().getFullYear())
    this.yearOfTournament = event.toDate().getFullYear()
    this.addTournamentForm.controls['tournamentYear'].setValue(event)
    if (yearEstablish.opened) {
      yearEstablish.close();
    }
  }

  saveDetail(){
    var appId=1;
    var addTournamentFormData=this.addTournamentForm.value;
    addTournamentFormData.country = this.countryList.filter((item: any) => item.country_name === this.addTournamentForm.get('country')?.value)[0].id;
    addTournamentFormData.state = this.stateList.filter((item: any) => item.state_name === this.addTournamentForm.get('state')?.value)[0].id;
    addTournamentFormData.city = this.cityList.filter((item: any) => item.city_name === this.addTournamentForm.get('city')?.value)[0].id;
    addTournamentFormData.appId=appId;
    addTournamentFormData.userid=this.userDetails.user_id;
    addTournamentFormData.yearOfTournament = this.yearOfTournament
    addTournamentFormData.cash_Reward = this.addTournamentForm.value.cash_Reward==1?true :false
    //checking wheather form is valid or not (means all required feilds are filled or not)
    if(this.addTournamentForm.valid){
      this.manageTabActive = true
      if(this.elementRowData!=null){
        //Edit tournament
        addTournamentFormData.tournamentId = this.elementRowData.tournament_Detail_Id
        this.innerLoaderMainData = true;
        this.tournamentService.saveEditTournament(addTournamentFormData).subscribe(res=>{
          this.innerLoaderMainData = false;
          this.tournamentEditRes = res;
          if(this.tournamentEditRes.status == 1){
            this.alertService.swalPopSuccessTimer("Record Edited Successfully!")
            this.setValuesManageEventsEdit(addTournamentFormData);
          }else{
            this.alertService.swalPopErrorTimer(this.tournamentEditRes.error)
          }
        },()=>{
          console.error('error caught in saveTournament')
          this.innerLoaderMainData=false
        })
      }else{
        //ADD TOURNAMENT
        addTournamentFormData.tournamentId=0;
        var dicipline =this.addTournamentForm.controls['disciplines'].value
        dicipline = dicipline.toString()
        addTournamentFormData.disciplines=dicipline;
        this.innerLoaderMainData = true;
        this.tournamentService.saveEditTournament(addTournamentFormData).subscribe(res=>{
          this.innerLoaderMainData = false;
          this.tournamentSaveRes = res;
          if(this.tournamentSaveRes.status == 1){
            this.alertService.swalPopSuccessTimer("Record added successfully!")
            this.tournamentSaveResID=this.tournamentSaveRes.value
            this.tournamentSaveResManageEvent = addTournamentFormData;
            this.setValuesManageEventsAdd(this.addTournamentForm.value)
            this.setManageDiscipline(this.tournamentSaveRes.value)
          }else{
            this.alertService.swalPopErrorTimer(this.tournamentSaveRes.error)
          }
        },()=>{
          console.error('error caught in saveTournament')
          this.innerLoaderMainData=false
        })
      }
    }else{
      this.addTournamentForm.markAllAsTouched()
    }
  }

  onSaveEvent(){
    var filtered = this.eventIdArray.filter((el:any)=> {
      return el != null;
    });
    var checkedEvents:any=[]
    var checkedDistinctEvents:any=[]
    for(var i of filtered){
      for(var d of this.ManageEventDetails){
        if(i==d.event_id){
          checkedEvents.push({
            age_category:d.age_category,
            event_Type:d.event_type,
            gender_category: d.gender_category,
            sport_Name: d.sport,
            sport_id: d.sport_id,
            event_Id: d.event_id,
            event_Name: d.event_name
          })
        }
      }
    }
    checkedDistinctEvents=this.ditinctEvents(this.distinctEvents,checkedEvents)
    this.eventUncheckboxArray.clear()
    this.eventCheckboxArray.clear()
    this.checkedEvents.forEach(() =>this.disableAddCheckBoxes())
    this.checkedEvents=checkedEvents
    checkedEvents.forEach(() =>this.disableAddCheckBoxes())
    checkedDistinctEvents.forEach(() =>this.addCheckBoxes())
    var selectedCheckbox=filtered.toString()
    if(this.editTournamentForm.valid && this.editTournamentForm.value !== ''  && filtered.length>0){
      if(this.elementRowData!=null){
        //edit api calling
        if(this.ManageEventDetailsLength >0){
          this.innerLoaderMainData = true;
          this.tournamentService.saveEvent(this.elementRowData.tournament_Detail_Id,selectedCheckbox).subscribe(res=>{
            this.innerLoaderMainData = false;
            var resStatus:any
            resStatus = res
            if(resStatus.status == true){
              // this.eventCheckboxArray.clear()
              // this.eventUncheckboxArray.clear()
              // this.activeModal.close();
              this.alertService.swalPopSuccessTimer("Saved Successfully!")
              this.check=false
              filtered=[]
              this.eventIdArray=[]
              // this.editTournamentForm.controls['discipline'].reset();
              this.editTournamentForm.get('discipline')?.setValue('tyhrt')
            }else{
              this.alertService.swalPopErrorTimer(resStatus.error)
            }
          },()=>{
            console.error('error caught in saveEvent')
            this.innerLoaderMainData=false
          })
        }else{
          this.alertService.swalPopErrorTimer("No event maped please add event!")         
        }
        
        
      }else{
        //add api calling
        if(this.ManageEventDetailsLength >0){
          this.innerLoaderMainData = true
          this.tournamentService.saveEvent(this.tournamentSaveRes.value,selectedCheckbox).subscribe(res=>{
            this.innerLoaderMainData = false;
            var resStatus:any
            resStatus = res
            if(resStatus.status == true){
              this.alertService.swalPopSuccessTimer("Saved Successfully!")
              this.check=false
              filtered=[]
              this.eventIdArray=[]
              this.editTournamentForm.controls['discipline']?.setValue('tyhrt')
            }else{
              this.alertService.swalPopErrorTimer(resStatus.error)
            }
          },()=>{
            console.error('error caught in saveEvent')
            this.innerLoaderMainData=false
          })
        }else{
          this.alertService.swalPopErrorTimer("No event maped please add event!")
        }
      }
    }else{
      this.editTournamentForm.markAllAsTouched()
      if(filtered.length==0){
        this.alertService.swalPopWarningTimer("Please Select at Least one Event")
        this.eventCheckboxArray.clear()
        this.eventUncheckboxArray.clear()
        this.check=false
        this.editTournamentForm.controls['discipline'].reset()
      }
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
