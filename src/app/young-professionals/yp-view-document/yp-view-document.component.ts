import { Component, OnInit } from '@angular/core';
import { CommonModule,Location } from "@angular/common";
import { ActivatedRoute } from '@angular/router';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { YoungProfessionalService } from 'src/app/_common/services/young-professional/young-professional.service';
import { environment } from 'src/environments/environment';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-yp-view-document',
  templateUrl: './yp-view-document.component.html',
  styleUrls: ['./yp-view-document.component.css']
})
export class YpViewDocumentComponent implements OnInit {

  form5Id!: number;
  ypDocumentList!:any
  fileUrl=environment.fileUrl
  isLoading:boolean=false
  constructor(private youngProfessionalService:YoungProfessionalService,
    private _activateRoute:ActivatedRoute,
    private alertService:AlertService,
    private location: Location,
    public sanitizer: DomSanitizer
  ){}
  
 

  ngOnInit(): void {
    this._activateRoute.params.subscribe(params => {
      this.form5Id = +params['form5Id'];
      this.getFormFiveDocumentsList()
    });
 
  }

  getFormFiveDocumentsList(){
    this.isLoading=true
  this.youngProfessionalService.getFormFiveDocumentsList(this.form5Id).subscribe({
        next: (res:any) => {
          if(res){
            this.isLoading=false
            this.ypDocumentList=res[0]
          }
         
        },
        error: (error) => {
          this.isLoading=false
          this.alertService.swalPopErrorTimer('SOMETHING WENT WRONG!! PLEASE TRY AGAIN')
      
        },
      });
 } 


 goBack(){
  this.location.back();
}


previewMedia(mediaUrl:string): void {
  if (mediaUrl) {
    window.open(mediaUrl, '_blank');
  }
}
}
