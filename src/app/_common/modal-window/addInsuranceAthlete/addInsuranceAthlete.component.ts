import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MY_DATE_FORMATS } from '../../models/my_dateFormat';
import { AddInsuranceAthleteServiceService } from '../../services/innerPagesServices/addInsuranceAthleteService.service';
import { AlertService } from '../../services/common-services/alert.service';

@Component({
  selector: 'app-addInsuranceAthlete',
  templateUrl: './addInsuranceAthlete.component.html',
  styleUrls: ['./addInsuranceAthlete.component.css'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ]
})
export class AddInsuranceAthleteComponent implements OnInit {
  addAthleteForm!:FormGroup;
  addAthleteData:any;
  userid: any = '';
  addInsuranceData:any;
  innerLoaderMainData:boolean = false;
  constructor(public activeModal: NgbActiveModal, private fb:FormBuilder, 
    private addInsuranceService:AddInsuranceAthleteServiceService,
    private alertService:AlertService) { }

  ngOnInit() {
    this.addAthleteForm = this.fb.group({
      addAthleteArray:this.fb.array([]),
    })

    this.addAthleteArray.push(this.newAddAthleteArray());    
    ////console.log('userData', this.addAthleteData)
    this.userid = this.addAthleteData.userid;
    ////console.log('user id',this.userid)
  }

  
 
  get addAthleteArray() : FormArray {
    return this.addAthleteForm.get("addAthleteArray") as FormArray
  }

  newAddAthleteArray(): FormGroup {
    return this.fb.group({
      nsrsid:['',Validators.required],      
      athleteName:[''],
      dob:[''],
      sport:[''],
      academy:[''],
      playerID:[''],
      insTagID:[''],
    })
  }

  addAthlete(){
    this.addAthleteArray.push(this.newAddAthleteArray());
  }
  removeAthlete(index:any){
    this.addAthleteArray.removeAt(index)
  }

  onBlurNsrsid(event:any,index:number){
    //console.log(event)
    var nsrsId = event.target.value;
    //console.log(nsrsId)
    if(event.target.value !==''){
      this.innerLoaderMainData = true
      this.addInsuranceService.getAddInsuranceData(nsrsId,this.userid,2).subscribe(data=>{
        this.innerLoaderMainData = false
        //console.log(data);
        this.addInsuranceData = data;
        if(this.addInsuranceData.isExist){ 
          this.addAthleteArray.at(index).patchValue({
            athleteName:this.addInsuranceData.name,
            dob:this.addInsuranceData.date_of_birth,
            sport:this.addInsuranceData.sport_name,
            academy:this.addInsuranceData.training_center_name,
            playerID:this.addInsuranceData.detailId,
            insTagID:this.addInsuranceData.insTagId,
          });
          this.disableField(index,"athleteName",true)     
          this.disableField(index,"dob",true)     
          this.disableField(index,"sport",true)     
          this.disableField(index,"academy",true)     
        }else{
          this.alertService.swalPopError("this.addInsuranceData.reason")
          this.addAthleteArray.controls[index].get('nsrsid')?.reset();
        }
        
      },()=>{
        console.error('error caught in getAddInsuranceData')
        this.innerLoaderMainData=false
      })
    }  
  }

  private disableField(index:number,formControlName:string,disableVal?:boolean){
    this.addAthleteArray.controls[index].get(formControlName)?.disable({onlySelf:disableVal})
  }

  saveInsurance(){
    var formData=this.addAthleteForm.value.addAthleteArray;
    //console.log(formData);
    this.innerLoaderMainData = true
    this.addInsuranceService.athleteInsuranceMultitag(this.addAthleteData,formData).subscribe(res=>{
      this.innerLoaderMainData = false

    })
  }

}
