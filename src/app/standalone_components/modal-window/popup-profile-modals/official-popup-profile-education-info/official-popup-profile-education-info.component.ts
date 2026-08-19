import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { LoaderComponent } from "src/app/standalone_components/loader/loader.component";

@Component({
selector:'app-official-popup-profile-education-info',
templateUrl:'./official-popup-profile-education-info.component.html',
styleUrls:['./official-popup-profile-education-info.component.css'],
standalone:true,
imports:[CommonModule, LoaderComponent]
})
export class OfficialPopupProfileEducationInfoComponent implements OnInit{
  popupDataReceived: any;
  loader: boolean = false;

    constructor(
      public activeModal: NgbActiveModal) {}

    ngOnInit(): void {
        this.popupDataReceived = this.popupDataReceived
  }

}