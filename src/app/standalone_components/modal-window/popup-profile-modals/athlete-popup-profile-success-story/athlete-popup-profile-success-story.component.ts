import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { AngularEditorConfig, AngularEditorModule } from "@kolkov/angular-editor";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { LoaderComponent } from "src/app/standalone_components/loader/loader.component";
import { environment } from "src/environments/environment";

@Component({
    selector:'app-athlete-popup-profile-success-story',
    templateUrl:'./athlete-popup-profile-success-story.component.html',
    styleUrls:['./athlete-popup-profile-success-story.component.css'],
    standalone:true,
    imports:[CommonModule,LoaderComponent,AngularEditorModule,FormsModule]

})

export class AthletePopupProfileSuccessStoryComponent implements OnInit{
    popupDataReceived:any;
    baseUrl = environment.fileUrl;
    constructor(public activeModal:NgbActiveModal){}

    // kolkov editor configuration
editorConfig: AngularEditorConfig = {
    editable: false,
    spellcheck: true,
    height: 'auto',
    minHeight: '2rem',
    placeholder: 'Enter Success Story Here...',
    translate: 'no',
    sanitize:false,
    // defaultParagraphSeparator: 'p',
    // defaultFontName: 'Arial',
    toolbarHiddenButtons: [
      ['insertVideo','insertImage','toggleEditorMode',]
      ], 
      showToolbar:false,
      enableToolbar:false,
      outline:false
  };

    ngOnInit(): void {
    }
}