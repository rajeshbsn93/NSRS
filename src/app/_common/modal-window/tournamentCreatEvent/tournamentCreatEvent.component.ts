import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { SharableService } from '../../services/innerPagesServices/innerpagesSharable.service';
import { TournamentService } from '../../services/innerPagesServices/tournament.service';

@Component({
  selector: 'app-tournamentCreatEvent',
  templateUrl: './tournamentCreatEvent.component.html',
  styleUrls: ['./tournamentCreatEvent.component.css']
})
export class TournamentCreatEventComponent implements OnInit {
  creatEventForm!:FormGroup;
  sportList:any;
  userid:any;
  innerLoaderMainData:boolean = false;


  constructor(public activeModal: NgbActiveModal, private fb:FormBuilder,private sharableService:SharableService,
    private TournamentService:TournamentService) { }

  ngOnInit() {
    var temp: any = localStorage.getItem('loginUserdata');
    var tempData = JSON.parse(temp);
    this.userid = tempData.user_id;
    //console.log(this.userid);
    this.setcreatEventForm()
    this.getSportList()
  }
setcreatEventForm(){
  this.creatEventForm = this.fb.group({
    event_name:['',Validators.required],
    sport_id:['',Validators.required],
    gender_category:['',Validators.required],
    // age_category:['',Validators.required],
    eventtype:['',Validators.required]
  })
}

getSportList(){
  this.innerLoaderMainData = true;
  this.sharableService.sportList().subscribe(res=>{
    this.innerLoaderMainData = false;
    // console.log('getSportList',res);
    this.sportList = res
  },(error)=>{
    console.error("error caught in sport list")
    this.innerLoaderMainData=false
  })
}

saveEvent(){

  var appId=1
  //console.log(this.creatEventForm.value)
  
  var createEventFormData=this.creatEventForm.value;
  createEventFormData.created_by = this.userid
  //createEventFormData.appId=appId
  //console.log(createEventFormData)
  if(this.creatEventForm.valid){
    this.innerLoaderMainData = true;
    this.TournamentService.CreateTournamentEvent(createEventFormData).subscribe(res=>{
      this.innerLoaderMainData = false;
      //console.log(res)
      this.activeModal.close()
      if(res){
        Swal.fire({
          position: 'center',
          icon: 'success',
          text: 'Record Added Successfully!',
          showConfirmButton: true,
          //timer: 3000
        });
      }else{
        Swal.fire({
          position: 'center',
          icon: 'error',
          text: 'Failed!',
          showConfirmButton: true,
          //timer: 3000
        });
      }
    },(error)=>{
      console.error("error caught in save event")
      this.innerLoaderMainData=false
    })
  }else{
    this.creatEventForm.markAllAsTouched();
  }
}


}
