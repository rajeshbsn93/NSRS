import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from 'src/app/_common/material.module';
import { athleteformfiveService } from 'src/app/_common/services/role-inner-pages-services/athlete-services/atheleteformfive.service';
import { LoaderComponent } from 'src/app/standalone_components/loader/loader.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-athlete-form-five-documents',
  templateUrl: './athlete-form-five-documents.component.html',
  styleUrls: ['./athlete-form-five-documents.component.css'],
  standalone:true,
  imports:[MaterialModule,LoaderComponent,CommonModule]
})
export class AthleteFormFiveDocumentsComponent implements OnInit {

  formIdFromParent:any;
  documentsList:any;
  loader:Boolean=false;
  filebaseUrl=environment.fileUrl;

  constructor(
    public activeModal:NgbActiveModal,private _atheletForm5Service:athleteformfiveService
  ) { }

  ngOnInit() {
    this.getDocuments()
  }

  getDocuments(){
    this.loader=true
    this._atheletForm5Service.getDocuments(this.formIdFromParent.data).subscribe({
      next:(documentRes:any)=>{
        this.loader=false
        this.documentsList=documentRes
      },
      error:()=>{
        this.loader=false
      }
    })
  }

}
