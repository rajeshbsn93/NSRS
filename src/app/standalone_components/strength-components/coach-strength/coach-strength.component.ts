import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core'
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/_common/material.module';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { StorageService } from 'src/app/_common/services/common-services/storage.service';
import { LoaderComponent } from '../../loader/loader.component';
import { DisciplineStrengthService } from 'src/app/_common/services/role-inner-pages-services/academy-services/discipline-strength.service';
import { first } from 'rxjs';
@Component({
  selector: 'app-coach-strength',
  templateUrl: './coach-strength.component.html',
  styleUrls: ['./coach-strength.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule, LoaderComponent]
})
export class CoachStrengthComponent implements OnInit {
  loader: boolean = false;
  userDetails: any;
  coachStrengthForm!: FormGroup;
  academySanctionedStrengthData: any;
  sanctionTypes: string[] = [];
  constructor(private storageService: StorageService, private disciplineStrengthService: DisciplineStrengthService,
    private alertService: AlertService, private fb: FormBuilder) { }
  ngOnInit(): void {
    this.userDetails = this.storageService.getUserDetails();
    // this.getAcademySanctionedStrength();
    this.coachStrengthForm = this.fb.group({
      coachStrengthFormArray: this.fb.array([])
    })
  }

  getAcademySanctionedStrength() {
    this.coachStrengthFormArray.clear();
    this.loader = true;
    this.disciplineStrengthService.academySanctionedStrength(this.userDetails.user_id, 2).pipe(first()).subscribe({
      next: (response: any) => {
        this.loader = false
        this.academySanctionedStrengthData = response
        const allTypes = response.flatMap((item: any) =>
          item.sanctioned_Strength_Datas.map((data: any) => data.type.toLowerCase())
        );

        this.sanctionTypes = Array.from(new Set(allTypes)); // remove duplicates
        for (let i = 0; i < response?.length; i++) {
          this.coachStrengthFormArray.push(this.newCoachStrengthFormArray(response[i]))
        }

      },
      error: (err) => {
        this.loader = false
        console.error(err)
      }
    })
  }

  get coachStrengthFormArray(): FormArray {
    return this.coachStrengthForm.get("coachStrengthFormArray") as FormArray
  }

  // newCoachStrengthFormArray(data:any): FormGroup {
  //   return this.fb.group({
  //     discipline:data.discipline,
  //     disciplineId:data.discipline_id,

  //     academyTrainingId: data.sanctioned_Strength_Datas[0].id,
  //     academyTrainingType: data.sanctioned_Strength_Datas[0].type,
  //     academyTrainingMen: data.sanctioned_Strength_Datas[0].sanction_strength_men,
  //     academyTrainingWomen:  data.sanctioned_Strength_Datas[0].sanction_strength_women, 

  //     contractId: data.sanctioned_Strength_Datas[1].id,
  //     contractType:  data.sanctioned_Strength_Datas[1].type,
  //     contractMen: data.sanctioned_Strength_Datas[1].sanction_strength_men,
  //     contractWomen:  data.sanctioned_Strength_Datas[1].sanction_strength_women,

  //     deputationId: data.sanctioned_Strength_Datas[2].id,
  //     deputationType: data.sanctioned_Strength_Datas[2].type,
  //     deputationMen: data.sanctioned_Strength_Datas[2].sanction_strength_men,
  //     deputationWomen:  data.sanctioned_Strength_Datas[2].sanction_strength_women,  

  //     regularId: data.sanctioned_Strength_Datas[3].id,
  //     regularType: data.sanctioned_Strength_Datas[3].type,
  //     regularMen: data.sanctioned_Strength_Datas[3].sanction_strength_men,
  //     regularWomen:  data.sanctioned_Strength_Datas[3].sanction_strength_women,  


  //   })
  // }

  newCoachStrengthFormArray(data: any): FormGroup {
    const group: any = {
      discipline: data.discipline,
      disciplineId: data.discipline_id,
    };

    data.sanctioned_Strength_Datas.forEach((item: any) => {
      const typeKey = item.type.toLowerCase(); // e.g., 'academyTraining', 'contract', etc.

      group[`${typeKey}Id`] = item.id;
      group[`${typeKey}Type`] = item.type;
      group[`${typeKey}Men`] = item.sanction_strength_men;
      group[`${typeKey}Women`] = item.sanction_strength_women;
    });

    return this.fb.group(group);
  }

  // editRowAthlete(data:any,type:string,index:number){     

  //     const role_id = 2
  //   if(type==='Contract'){ 
  //       this.saveSanctionedStrength(data.contractId,this.userDetails.user_id,role_id,data.disciplineId,
  //           data.contractType,data.contractMen,data.contractWomen)
  //     }else if(type==='Deputation'){
  //       this.saveSanctionedStrength(data.deputationId,this.userDetails.user_id,role_id,data.disciplineId,
  //           data.deputationType,data.deputationMen,data.deputationWomen)
  //     }else{
  //       this.saveSanctionedStrength(data.regularId,this.userDetails.user_id,role_id,data.disciplineId,
  //           data.regularType,data.regularMen,data.regularWomen)
  //     }        
  // }

  editRowAthlete(data: any, type: string, index: number) {
    const role_id = 2;
    const key = type.charAt(0).toLowerCase() + type.slice(1); 

    this.saveSanctionedStrength(
      data[`${key}Id`],
      this.userDetails.user_id,
      role_id,
      data.disciplineId,
      data[`${key}Type`],
      data[`${key}Men`],
      data[`${key}Women`]
    );
  }
  saveSanctionedStrength(id: number, academy_detail_id: number, role_id: number, discipline_id: number,
    type: string, sanction_strength_men: number, sanction_strength_women: number) {
    this.loader = true;
    this.disciplineStrengthService.saveAcademySanctionedStrength(id, academy_detail_id, role_id, discipline_id,
      type, sanction_strength_men, sanction_strength_women).subscribe({
        next: (response) => {
          this.loader = false;
          if (response) {
            this.alertService.swalPopSuccess('Save successfully!')
            this.getAcademySanctionedStrength()
          } else {
            this.alertService.swalPopError('Can not update!')
          }
        },
        error: (err) => {
          this.loader = false;
          console.error(err)
        }
      })
  }
}