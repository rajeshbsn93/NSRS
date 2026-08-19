import { CommonModule, DatePipe } from "@angular/common";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { DateAdapter, MAT_DATE_FORMATS } from "@angular/material/core";
import { MatDatepicker } from "@angular/material/datepicker";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Moment } from "moment";
import { first } from "rxjs";
import { MaterialModule } from "src/app/_common/material.module";
import { MY_DATE_FORMATS } from "src/app/_common/models/my_dateFormat";
import { AlertService } from "src/app/_common/services/common-services/alert.service";
import { StorageService } from "src/app/_common/services/common-services/storage.service";
import { SharableService } from "src/app/_common/services/innerPagesServices/innerpagesSharable.service";
import { TournamentService } from "src/app/_common/services/innerPagesServices/tournament.service";
import { YearFormatDirective } from "src/app/standalone_components/directives/year-format.directive";
import { LoaderComponent } from "src/app/standalone_components/loader/loader.component";
import { environment } from "src/environments/environment";
import Swal from "sweetalert2";

@Component({
    selector:'app-athlete-edit-achievement',
    templateUrl:'./athlete-edit-achievement.component.html',
    styleUrls:['./athlete-edit-achievement.component.css'],
    providers: [
        {provide: DateAdapter, useClass: MomentDateAdapter},
        { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS},
        DatePipe
      ],
      standalone:true,
      imports:[CommonModule,MaterialModule,ReactiveFormsModule,LoaderComponent,YearFormatDirective],
})

export class AthleteEditAchievementComponent implements OnInit{
  @ViewChild('document_pathInput') document_pathInput!: ElementRef<any>;
    loader:boolean = false;
    document_pathUrl: string | null = null;
    readonly fileBaseUrl = environment.fileUrl;
    isSaveClicked: boolean = false;
    editRowData:any;
    achievement_detail_id:any
    player_detail_id:any

    constructor(public activeModal:NgbActiveModal,private fb:FormBuilder,private aletService:AlertService,
        private storageService:StorageService,private tournamentService:TournamentService, private sharableService: SharableService,
        private datePipe:DatePipe) { }

    ngOnInit(): void {
        if(this.editRowData !=(null)) {
            this.achievement_detail_id = this.editRowData?.player_achievement_detail_id;
            this.player_detail_id = this.editRowData?.player_detail_id
            this.document_pathUrl = this.editRowData.document_path
        }
    }

    swalAlert(iconText:any,TextMsg:string){
        return Swal.fire({
            icon:iconText,
            text:TextMsg,
            showConfirmButton:true
        })
      }

      fileUpload(event: any) {
        const file = event.target.files[0];
        if (!file) return;
        const extFile=this.getFileExtension(file);
        if (extFile == "jpg" || extFile == "jpeg" || extFile == "png" || extFile == "pdf") {
          const formData = new FormData();
          formData.append("file",file, file.name);
          formData.append("path", "Athlete\\Achievement");
          formData.append("uploadType","3")
          this.loader = true;
          this.sharableService.uploadFile(formData).subscribe({
            next: (response: any) => {
              this.loader = false;
              if (response.isUploaded==true) {
                this.swalAlert('success','Upload Successful!');
                  this.document_pathUrl = response.filedataList[0].filePath;
                  this.document_pathInput.nativeElement.value = null;
              } else {
                this.swalAlert('error',response.errMsg || 'Upload Failed! Please try again.');
              }
            },
            error: () => {
              this.loader=false;
              this.swalAlert('error','Upload Failed! Please try again.');
              console.error("error caught in upload file")
            }
          });
        } 
        else {
          this.swalAlert('warning','Only jpg, jpeg, png or pdf file is allowed!');
        }
      }
    
      getFileExtension(file:any) {
        let fileIndex = file.name.lastIndexOf(".") + 1;
        let extFile = file.name.substr(fileIndex, file.name.length).toLowerCase();
        return extFile;
      }



      save(){
        this.isSaveClicked = true;
        let event_id= null
        let represented= "";
        let position= "";
        let result= "";
        let tournament_id= null;
        let category= "";
        let competition_level= "";
        let competition_name= "";
        let fromdate= null;
        let todate= null ;
        let venue= "";
        this.loader = true
        this.tournamentService.SaveAthleteAchievementDetail(
            this.achievement_detail_id,this.player_detail_id,event_id,represented,position,result,this.document_pathUrl,tournament_id,
            category,competition_level,competition_name,fromdate,todate,venue
            ).subscribe({
                next:(response)=>{
                    this.loader = false;
                    if(response){
                        this.activeModal.close(response)
                    }
                },
                error:(err)=>{
                    this.loader = false;
                    console.error(err);
                }                
            })
      }


      



}