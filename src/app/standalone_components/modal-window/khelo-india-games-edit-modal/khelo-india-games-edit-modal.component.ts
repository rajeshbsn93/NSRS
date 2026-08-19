import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from 'src/app/_common/material.module';
import { LoaderComponent } from '../../loader/loader.component';
import { Subject, Subscription, takeUntil} from 'rxjs';
import { StorageService } from 'src/app/_common/services/common-services/storage.service';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { KheloIndiaGamesService } from 'src/app/_common/services/common-services/khelo-india-games.service';

@Component({
  selector: 'app-khelo-india-games-edit-modal',
  templateUrl: './khelo-india-games-edit-modal.component.html',
  styleUrls: ['./khelo-india-games-edit-modal.component.css'],
  standalone:true,
  imports:[CommonModule,MaterialModule,ReactiveFormsModule,LoaderComponent]
})
export class KheloIndiaGamesEditModalComponent implements OnInit, OnDestroy{
  state_univ_form!:FormGroup;
  @ViewChild('insttSearch', {static: false}) insttSearch?: ElementRef<HTMLInputElement>;
  loader:boolean = false;
  loader2:boolean = false;
  subject:Subject<any> = new Subject();
  filter_State_UniListData:any;
  subscription:Subscription = new Subscription();
  insttNameSearch: FormControl = new FormControl(null);
  userDetails:any;
  gamesListData:any;
  stUniListData:any;
  rowData:any;
  // KheloIndiaPlayerData:any;


  constructor(
    public activeModal:NgbActiveModal,
    private fb:FormBuilder,
    private storageService:StorageService, 
    private alertService:AlertService,
    private kheloIndiaGamesService:KheloIndiaGamesService
    ) { }

  ngOnInit() {
    console.log(this.rowData)
    this.userDetails = this.storageService.getUserDetails();
    // console.log(this.userDetails)
    this.getGamesList();
    this.state_univ_form = this.fb.group({
      gametype_id:['',Validators.required],
      part_state_uni:['',Validators.required],
    });
    this.subscription.add(
      this.insttNameSearch.valueChanges.subscribe((value) => {
        if (value && this.stUniListData?.length)
          this.filter_State_UniListData = this.stUniListData.filter(
            (item:any) => item.st_Uni_name?.toLowerCase()?.trim()?.includes(value?.toLowerCase()?.trim())
          );
        else this.filter_State_UniListData = this.stUniListData;
      })
    );
  }

  getGamesList(){
    this.loader = true
    this.kheloIndiaGamesService.getGamesList().pipe(takeUntil(this.subject)).subscribe({
      next:(res:any)=>{
        this.loader = false;
        // console.log(res);
        this.gamesListData = res.filter((items:any)=> items.id !==0)
        if(this.rowData!==null && this.rowData!==undefined){
          this.state_univ_form.get('gametype_id')?.setValue(this.rowData.gameId)
          this.gamesChange(this.rowData.gameId)
        }
      },
      error:(err)=>{
        this.loader = false;
        console.error(err)
      }
    })   
  }
  getStUniList(gameType:number){
    this.loader2 = true
    this.kheloIndiaGamesService.Get_St_UniList(gameType).pipe(takeUntil(this.subject)).subscribe({
      next:(res:any)=>{
        this.loader2 = false;
        // console.log(res)
        this.stUniListData= this.filter_State_UniListData = res
        if(res?.length && this.rowData !==null && !this.state_univ_form.get('gametype_id')?.touched){
          this.state_univ_form.get('part_state_uni')?.setValue(this.rowData.stuniId);
        }
      },
      error:(err)=>{
        this.loader2 = false;
        console.error(err)
      }
    })
  }
  gamesChange(games:any){
    this.state_univ_form.get('part_state_uni')?.setValue(null)
    let gameData = this.gamesListData.filter((data:any)=>{
      if(data.id==games) return data
    })
    // console.log(gameData)
    if(gameData.length) this.getStUniList(gameData[0].gameType)    
  }
  onInsttNameSelectOpen() {
    this.insttSearch?.nativeElement.focus();
  }
  
  onInsttSearchBlur() {
    setTimeout(() => {
      this.insttNameSearch.setValue('');
    }, 400);
  }
  submit(){
    console.log(this.state_univ_form.value)
    if(this.state_univ_form.valid){
      const payload = {
        id:this.rowData==null ? 0 :this.rowData.id,
        roleId:this.userDetails.role_id,
        playerofficialid:this.userDetails.user_id,
        stuniId:this.state_univ_form.get('part_state_uni')?.value,
        gameId:this.state_univ_form.get('gametype_id')?.value,
        isEdit:this.rowData == null ? false : true,
        isVerified:this.rowData == null ? false : this.rowData.isVerified,
        stuniname:'',
        gamename:''
      }
      console.log(payload)
      this.addGameStateUniDetail(payload)
    }
    else{
      this.state_univ_form.markAllAsTouched();
    }
  }
  addGameStateUniDetail(payload:any){
    this.loader = true;
    this.kheloIndiaGamesService.addGameStateUniDetail(payload).pipe(takeUntil(this.subject)).subscribe({
      next:(response:any)=>{
        this.loader = false;
        console.log(response)
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
