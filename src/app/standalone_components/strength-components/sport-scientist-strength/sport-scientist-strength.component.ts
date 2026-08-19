import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "src/app/_common/material.module";
import { LoaderComponent } from "../../loader/loader.component";
import { StorageService } from "src/app/_common/services/common-services/storage.service";
import { DisciplineStrengthService } from "src/app/_common/services/role-inner-pages-services/academy-services/discipline-strength.service";
import { AlertService } from "src/app/_common/services/common-services/alert.service";

@Component({
    selector:'app-sport-scientist-strength',
    templateUrl:'./sport-scientist-strength.component.html',
    styleUrls:['./sport-scientist-strength.component.css'],
    standalone:true,
    imports:[CommonModule,ReactiveFormsModule,MaterialModule,LoaderComponent]
})

export class SportScientistStrengthComponent implements OnInit{
    sportScientistStrengthForm!:FormGroup;
    userDetails:any;
    loader:boolean = false;
    roleId = 103;
    constructor(private storageService:StorageService,private disciplineStrengthService:DisciplineStrengthService,
        private alertService:AlertService,private fb:FormBuilder){}
    ngOnInit(): void {
        this.userDetails = this.storageService.getUserDetails();
        // this.getAcademySanctionedStrength()
        this.sportScientistStrengthForm = this.fb.group({
            sportScientistArrayName:this.fb.array([])
        })        
    }

    getAcademySanctionedStrength(){
        this.sportScientistArray.clear();
        this.loader = true;
        this.disciplineStrengthService.academySanctionedStrength(this.userDetails.user_id,this.roleId).subscribe({
            next:(response:any)=>{
                this.loader = false;
                if(response.length > 0){
                    for(let i=0; i<response?.length; i++){
                        this.sportScientistArray.push(this.newSportScientistArray(response[i]))
                    }
                }
            },
            error:(err)=>{
                this.loader = false;
                console.error(err)
            }
        })
    }

    get sportScientistArray() : FormArray{
        return this.sportScientistStrengthForm.get("sportScientistArrayName") as FormArray
    }

    newSportScientistArray(data:any) : FormGroup{
        return this.fb.group({
            category:data.discipline,
            categoryId:data.discipline_id,
            ContractId:data.sanctioned_Strength_Datas[0].id,
            ContractType:data.sanctioned_Strength_Datas[0].type,
            ContractMen:data.sanctioned_Strength_Datas[0].sanction_strength_men,
            ContractWomen:data.sanctioned_Strength_Datas[0].sanction_strength_women,
            DeputationId:data.sanctioned_Strength_Datas[1].id,
            DeputationType:data.sanctioned_Strength_Datas[1].type,
            DeputationMen:data.sanctioned_Strength_Datas[1].sanction_strength_men,
            DeputationWomen:data.sanctioned_Strength_Datas[1].sanction_strength_women,
            RegularId:data.sanctioned_Strength_Datas[2].id,
            RegularType:data.sanctioned_Strength_Datas[2].type,
            RegularMen:data.sanctioned_Strength_Datas[2].sanction_strength_men,
            RegularWomen:data.sanctioned_Strength_Datas[2].sanction_strength_women,            
        })
    }
    editRowSportScientist(rowData:any,CatType:string){
        // console.log(rowData)
        if(CatType ==='Contract'){
            this.saveSanctionedStrength(rowData.ContractId,rowData.categoryId,rowData.ContractType,rowData.ContractMen,rowData.ContractWomen);
        }else if(CatType==='Deputation'){
            this.saveSanctionedStrength(rowData.DeputationId,rowData.categoryId,rowData.DeputationType,rowData.DeputationMen,rowData.DeputationWomen);
        }else{
            this.saveSanctionedStrength(rowData.RegularId,rowData.categoryId,rowData.RegularType,rowData.RegularMen,rowData.RegularWomen);
        }
    }

    saveSanctionedStrength(id:number,discipline_id:number,type:string,sanction_strength_men:number,
        sanction_strength_women:number){
         const academy_detail_id = this.userDetails.user_id;
         this.loader = true
         this.disciplineStrengthService.saveAcademySanctionedStrength(id,academy_detail_id,this.roleId,discipline_id,type,
            sanction_strength_men,sanction_strength_women).subscribe({
                next:(response)=>{
                    this.loader = false;
                    if(response){
                        this.alertService.swalPopSuccess('Save successfully!')
                        this.getAcademySanctionedStrength();
                    }else{
                        this.alertService.swalPopError('Can not update!')
                    }
                },
                error:(err)=>{
                    this.loader = false;
                    console.error(err);  
                }
            })
        }
}