import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/_common/material.module';
import { ProfileService } from 'src/app/_common/services/role-inner-pages-services/academy-services/profile.service';
import { LoaderComponent } from 'src/app/standalone_components/loader/loader.component';
import { StorageService } from 'src/app/_common/services/common-services/storage.service';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AddSportsDisciplineComponent } from '../Add-sports-discipline/Add-sports-discipline.component';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { SportscientistDetailListService } from 'src/app/_common/services/role-inner-pages-services/academy-services/sportscientist-detail-list.service';
import { AthleteStrengthComponent } from 'src/app/standalone_components/strength-components/athlete-strength/athlete-strength.component';
import { CoachStrengthComponent } from 'src/app/standalone_components/strength-components/coach-strength/coach-strength.component';
import { SportScientistStrengthComponent } from 'src/app/standalone_components/strength-components/sport-scientist-strength/sport-scientist-strength.component';
import { map } from 'rxjs';

export interface sportDiscipline{
  sport_detail_id:number,
  sport_name:string
}

@Component({
  selector: 'app-sports-discipline',
  templateUrl: './sports-discipline.component.html',
  styleUrls: ['./sports-discipline.component.css'],
  standalone:true,
  imports:[CommonModule,MaterialModule,LoaderComponent,ReactiveFormsModule,AthleteStrengthComponent,CoachStrengthComponent,
  SportScientistStrengthComponent]
})

export class SportsDisciplineComponent implements OnInit {

  @ViewChild('deletediscipline') deleteEventModalPopUp:any;
  deleteDiciplinePopUp:any
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  // displayedColumns: string[] = ['sport_name', 'event_Category_Name','event', 'sanctionedStrengthMen', 'sanctionedStrengthWomen', 'action'];
  displayedColumns: string[] = ['sn', 'sport_name',];
  dataSource:any
  academyDisplicineList:any
  mainLoader:boolean=false
  userDetails:any;
  @ViewChild('athleteTabRef') athleteTabRef:any;
  @ViewChild('coachStrengthTemp') coachStrengthTabRef:any;
  @ViewChild('sportscientistRef') sportscientistTabRef:any

  constructor(public activeModal:NgbActiveModal,private profileService:ProfileService,
    private storageService:StorageService,private modalService:NgbModal,private alertService:AlertService,
    private sportsDisciplineService:SportscientistDetailListService,private fb:FormBuilder) { }

  ngOnInit() {
    this.userDetails=this.storageService.getUserDetails()
    this.getAcademySportDecipline(); 
  }

  getAcademySportDecipline(){
    this.mainLoader=true
    this.profileService.academySportDecipline(this.userDetails.user_id).pipe(map((items:any)=>{
      return items
      .map((item:any,index:number)=>{
        return {...item,sln:index+1}
      })
    })).subscribe({
      next:(res)=>{
        this.mainLoader=false
         //console.log(res)
        this.academyDisplicineList=res
        const ELEMENT_DATA: sportDiscipline[] = this.academyDisplicineList;
        this.dataSource = new MatTableDataSource<sportDiscipline>(ELEMENT_DATA);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error:()=>{
        console.error("error caught in getting academy sport list")
        this.mainLoader=false
      }
    })
  }
  

  addEditSportsDiscipline(elementRowData:any){
    const modalRef = this.modalService.open(AddSportsDisciplineComponent,{size: 'lg', centered: true,})
    // modalRef.componentInstance.sportDisciplineEdit=elementRowData
    // modalRef.componentInstance.disciplineListAlreadyMapped=this.academyDisplicineList
    modalRef.result.then((event) => {
      //console.log(event)
      if(event){
        this.getAcademySportDecipline();
      }
    }).catch(() => {});
  }
  athleteStrength(){
    this.athleteTabRef.getAcademySanctionedStrength();
  }
  coachStrength(){
    this.coachStrengthTabRef.getAcademySanctionedStrength();
  }
  sportscientistStrength(){
    this.sportscientistTabRef.getAcademySanctionedStrength();
  }

}
