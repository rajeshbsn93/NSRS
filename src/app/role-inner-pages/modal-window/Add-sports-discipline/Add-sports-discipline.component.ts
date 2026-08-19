import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoaderComponent } from 'src/app/standalone_components/loader/loader.component';
import { MaterialModule } from 'src/app/_common/material.module';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { Enable_disableFormService } from 'src/app/_common/services/common-services/enable_disableForm.service';
import { StorageService } from 'src/app/_common/services/common-services/storage.service';
import { AcademySharableService } from 'src/app/_common/services/role-inner-pages-services/academy-services/academySharable.service';
import { SportscientistDetailListService } from 'src/app/_common/services/role-inner-pages-services/academy-services/sportscientist-detail-list.service';
import { DisciplineStrengthService } from 'src/app/_common/services/role-inner-pages-services/academy-services/discipline-strength.service';

@Component({
  selector: 'app-Add-sports-discipline',
  templateUrl: './Add-sports-discipline.component.html',
  styleUrls: ['./Add-sports-discipline.component.css'],
  imports:[CommonModule,MaterialModule,LoaderComponent,ReactiveFormsModule],
  standalone:true
})
export class AddSportsDisciplineComponent implements OnInit {
  sportsDisciplineForm!:FormGroup
  userDetails:any
  ssList:any
  loader:boolean=false

  constructor(public activeModal:NgbActiveModal,private fb:FormBuilder,private storageService:StorageService,
    private sportsDisciplineService:SportscientistDetailListService,private alertService:AlertService,private modal: NgbModal,
    private disciplineStrengthService:DisciplineStrengthService) { }

  ngOnInit() {
    this.userDetails=this.storageService.getAcademyDetails()
    this.sportDiscipleineList();
    this.sportsDisciplineForm = this.fb.group({
      ssList:''
    })
  }
  

  sportDiscipleineList(){
    this.loader=true
    this.sportsDisciplineService.getMasterSportList().subscribe({
      next:(res:any)=>{
        this.loader=false
        this.ssList=res;
      },
      error:()=>{
        console.error('error caught in getting discipline list')
        this.loader=false
      }
    })
  }


  save(){
    if(this.sportsDisciplineForm.value.ssList !=''){
      //console.log(this.sportsDisciplineForm.value,this.userDetails.user_id);
      this.loader =true
      this.disciplineStrengthService.updateAcademyDisciplines(this.userDetails.user_id,this.sportsDisciplineForm.value.ssList).subscribe({
        next:(response)=>{
          this.loader = false;
          //console.log(response)
          if(response){
            this.activeModal.close(true)
            this.alertService.swalPopSuccess('Save successfully!');
          }else{
            this.alertService.swalPopError('This discipline already exists!')
          }
        },
        error:(err)=>{
          this.loader = false;
        }
      })
    } else{
      this.alertService.swalPopWarning('Select discipline')
    }   
  }

}
