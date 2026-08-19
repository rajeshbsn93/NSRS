import { CommonModule } from '@angular/common';
import {Component, OnInit} from '@angular/core'
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/_common/material.module';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { StorageService } from 'src/app/_common/services/common-services/storage.service';
import { LoaderComponent } from '../../loader/loader.component';
import { DisciplineStrengthService } from 'src/app/_common/services/role-inner-pages-services/academy-services/discipline-strength.service';
@Component({
    selector:'app-athlete-strength',
    templateUrl:'./athlete-strength.component.html',
    styleUrls:['./athlete-strength.component.css'],
    standalone:true,
    imports:[CommonModule,ReactiveFormsModule,MaterialModule,LoaderComponent]
})
export class AthleteStrengthComponent implements OnInit{
    loader:boolean = false;
    userDetails:any;
    athleteStrengthForm!:FormGroup;
    academySanctionedStrengthData:any;
    constructor(private storageService:StorageService,private disciplineStrengthService:DisciplineStrengthService,
        private alertService:AlertService,private fb:FormBuilder){}
    ngOnInit(): void {
        this.userDetails=this.storageService.getUserDetails();
        // this.getAcademySanctionedStrength();
        this.athleteStrengthForm = this.fb.group({
            athleteStrengthFormArray:this.fb.array([])
          })
    }

    getAcademySanctionedStrength(){
      this.athleteStrengthFormArray.clear();
        this.loader = true
        this.disciplineStrengthService.academySanctionedStrength(this.userDetails.user_id,1).subscribe({
          next:(response:any)=>{
            this.loader = false
            // console.log(response)
            this.academySanctionedStrengthData = response
            for(let i=0 ; i<response?.length;i++){
              this.athleteStrengthFormArray.push(this.newAthleteStrengthFormArray(response[i]))
            }
          },
          error:(err)=>{
            this.loader=false
            console.error(err)
          }
        })
      }
    
      get athleteStrengthFormArray() : FormArray {
        return this.athleteStrengthForm.get("athleteStrengthFormArray") as FormArray
      }
    
      newAthleteStrengthFormArray(data:any): FormGroup {
        // console.log(data)
        return this.fb.group({
          discipline:data.discipline,
          disciplineId:data.discipline_id,
          nonresidentialId: data.sanctioned_Strength_Datas[0].id,
          nonresidentialType:  data.sanctioned_Strength_Datas[0].type,
          nonresidentialMen: data.sanctioned_Strength_Datas[0].sanction_strength_men,
          nonresidentialWomen:  data.sanctioned_Strength_Datas[0].sanction_strength_women,
          residentialId: data.sanctioned_Strength_Datas[1].id,
          residentialType: data.sanctioned_Strength_Datas[1].type,
          residentialMen: data.sanctioned_Strength_Datas[1].sanction_strength_men,
          residentialWomen:  data.sanctioned_Strength_Datas[1].sanction_strength_women,      
        })
      }
    
      editRowAthlete(data:any,type:string,index:number){     
          // console.log(data)
          const role_id = 1
        if(type==='nonresidential'){ 
            this.saveSanctionedStrength(data.nonresidentialId,this.userDetails.user_id,role_id,data.disciplineId,
                data.nonresidentialType,data.nonresidentialMen,data.nonresidentialWomen)
          }else{
            this.saveSanctionedStrength(data.residentialId,this.userDetails.user_id,role_id,data.disciplineId,
                data.residentialType,data.residentialMen,data.residentialWomen)
          }        
      }
      saveSanctionedStrength(id:number,academy_detail_id:number,role_id:number,discipline_id:number,
        type:string,sanction_strength_men:number,sanction_strength_women:number){
            this.loader = true;
            this.disciplineStrengthService.saveAcademySanctionedStrength(id,academy_detail_id,role_id,discipline_id,
                type,sanction_strength_men,sanction_strength_women).subscribe({
                    next:(response)=>{
                        this.loader = false;
                        if(response){
                            this.alertService.swalPopSuccess('Save successfully!');
                            this.getAcademySanctionedStrength()
                        }else{
                            this.alertService.swalPopError('Can not update!')
                        }
                    },
                    error:(err)=>{
                        this.loader = false;
                        console.error(err)
                    }
                })
      }
}