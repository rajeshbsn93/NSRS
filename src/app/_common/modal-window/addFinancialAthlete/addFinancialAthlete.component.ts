import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MY_DATE_FORMATS } from '../../models/my_dateFormat';
import { AddInsuranceAthleteServiceService } from '../../services/innerPagesServices/addInsuranceAthleteService.service';
import { AlertService } from '../../services/common-services/alert.service';
import { AthleteService } from "../../services/innerPagesServices/athlete.service"
import { FinancialService } from '../../services/innerPagesServices/financial.service';
@Component({
  selector: 'app-addFinancialAthlete',
  templateUrl: './addFinancialAthlete.component.html',
  styleUrls: ['./addFinancialAthlete.component.css'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ]
})
export class AddFinancialAthleteComponent implements OnInit {
  addAthleteForm!:FormGroup;
  addAthleteData:any;
  addInsuranceData:any;
  nsrsId:any = '';
  schemeListData:any;
  nominateListData:Array<any> = [];
  scholarship_type_id:any;
  minDate:any;
  innerLoaderMainData:boolean = false;
  innerLoaderschemeList:boolean = false;
  innerLoadernominatedList:boolean = false;
  test1: any;
  scholarship_id: any;

  constructor(public activeModal: NgbActiveModal, private fb:FormBuilder, private addInsuranceService:AddInsuranceAthleteServiceService,
    private athleteService:AthleteService,private financialService:FinancialService,
    private alertService:AlertService) { }

 
  ngOnInit() {
    //this.minDate = new Date();
    this.addAthleteForm = this.fb.group({
      addAthleteArray:this.fb.array([]),
    })

    this.addAthleteArray.push(this.newAddAthleteArray())
    // this.userid = this.addAthleteData.userid;
    this.schemeList();
    this.nominatedList();

    
  }

  schemeList() {
    this.innerLoaderschemeList = true
    this.athleteService.getScheme()
      .subscribe({
        next:(res)=>{
        this.innerLoaderschemeList = false
        this.schemeListData = res;
        //console.log("Scholarship Type", this.schemeListData)
      },
      error:(error)=>{
        console.error("error caught in scheme list")
        this.innerLoaderschemeList=false
      }
    })
  }
  nominatedList() {
    this.innerLoadernominatedList = true
    this.athleteService.getLookUpItems().subscribe({
      next:(res:any)=>{
        this.innerLoadernominatedList = false
        //console.log(res);
        for(let i=0 ; i  < res?.length ; i++){
          if(res[i].lookup_name == "Nominated_By"){
            this.nominateListData.push(res[i])
            //console.log(res[i])
          }  
        } 
      },error:()=>{
        console.error("error caught in nominated list")
        this.innerLoadernominatedList=false
      }
    })
  }

  get addAthleteArray() : FormArray {
    return this.addAthleteForm.get("addAthleteArray") as FormArray
  }

  newAddAthleteArray(): FormGroup {
    return this.fb.group({
      //nsrsid:['',[Validators.required]],
      athleteName:['', Validators.required],      
      dob:['', Validators.required],
      sport:['', Validators.required],
      nominated_by_id:['',[Validators.required]],
      scholarship_type_id:['',[Validators.required]],
      amount:[''],
      start_date:['',[Validators.required]],
      end_date:[null],
      player_detail_id:[''],
    })
  }

  addAthlete(){
    this.addAthleteArray.push(this.newAddAthleteArray());
  }

  removeAthlete(index:any){
    this.addAthleteArray.removeAt(index)
  }

  onBlurNsrsid(event:any,index:number){
    this.nsrsId = event.target.value;
    if(event.target.value !==''){
      this.innerLoaderMainData = true
    this.addInsuranceService.getAddInsuranceData(this.nsrsId,this.addAthleteData.userid,1).subscribe({
      next:(data)=>{
        this.innerLoaderMainData = false
        this.addInsuranceData = data;
        //console.log(data)
        if(this.addInsuranceData.isExist){
          this.addAthleteArray.at(index).patchValue({
            athleteName:this.addInsuranceData.name,
            dob:this.addInsuranceData.date_of_birth,
            sport:this.addInsuranceData.sport_name,
            player_detail_id:this.addInsuranceData.detailId,
          });
          this.DisableField(index,"athleteName",true)
          this.DisableField(index,"dob",true)
          this.DisableField(index,"sport",true)
        }else{
          this.alertService.swalPopError(this.addInsuranceData.reason)
          this.addAthleteArray.controls[index].get('nsrsid')?.reset();
        }
      },
      error:()=>{
        console.error("error caught in addinsurance data")
        this.innerLoaderMainData=false
      }
    })
  } 

  }
  SelectnominateType(event:any,index:number){
    

    //console.log(event);
    //console.log(index);
    this.test1= this.addAthleteArray.controls[index].get('nominated_by_id');
    if(this.test1.value=='2'){
    
   this.addAthleteArray.controls[index].get('scholarship_type_id')?.setValue(3);
   this.addAthleteArray.controls[index].get('amount')?.setValue(10000);
  
   this.scholarship_type_id=this.schemeListData[2].id;
   //console.log(this.scholarship_type_id);
    }else if(this.test1.value=='1'){
    
      this.addAthleteArray.controls[index].get('scholarship_type_id')?.setValue(1);
      this.addAthleteArray.controls[index].get('amount')?.setValue(50000);
     
      this.scholarship_type_id=this.schemeListData[0].id;
      //console.log(this.scholarship_type_id);
    }else if(this.test1.value=='3'){
    
        this.addAthleteArray.controls[index].get('scholarship_type_id')?.setValue(2);
        this.addAthleteArray.controls[index].get('amount')?.setValue(25000);
       this.scholarship_type_id=this.schemeListData[1].id
          //console.log(this.scholarship_type_id);
   }else{
      //console.log("value null");
    }
   
 
  }
  // (selectionChange)="SelectnominateType($event,i)"








  SelectScholarshipType(event:any,index:number){
    //console.log(event.value);
    this.scholarship_type_id = event.value;
    //console.log(this.scholarship_type_id);
    //console.log('SelectScholarshipType',event.value, index)
    if(this.scholarship_type_id==1){
      this.addAthleteArray.controls[index].get('amount')?.setValue(50000);


    }else if(this.scholarship_type_id==2){
      this.addAthleteArray.controls[index].get('amount')?.setValue(25000);

    }else if(this.scholarship_type_id==3){
      this.addAthleteArray.controls[index].get('amount')?.setValue(10000);
    }else if(this.scholarship_type_id==4){
      this.addAthleteArray.controls[index].get('amount')?.setValue(2500);
    }
    else{
      //console.log("value null");
    }
    // this.addAthleteArray.at(index).patchValue({
    //   amount:event.value.amount
    // });
    
  }
  



  private DisableField(index:number,formControlName:string,disableVal?:boolean){
    this.addAthleteArray.controls[index].get(formControlName)?.disable({onlySelf:disableVal})
  }

  savefinance(){
    const opt_Type:number = 1;
    //console.log(this.addAthleteData.userid,opt_Type,this.scholarship_type_id)

    //console.log(this.addAthleteForm.value.addAthleteArray)

    //console.log(this.addAthleteForm.value.addAthleteArray.at(0).fromDate);
    this.innerLoaderMainData = true
    this.financialService.athleteFAMultiTag(this.addAthleteData.userid,this.addAthleteForm.value.addAthleteArray).subscribe(res=>{ 
      this.innerLoaderMainData = false     
      //console.log(res)
      if(res == true){
        this.alertService.swalPopSuccess("Data save successfully")
        this.activeModal.close()
      }else{
        this.alertService.swalPopError("Data not save please try again")
        this.activeModal.close()
      }
      
    },()=>{
      console.error('error caught in athleteFAmultiTag')
      this.innerLoaderMainData=false
    })  
  }
  
}
