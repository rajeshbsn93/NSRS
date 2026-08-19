import { CommonModule } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CampBasicInformationComponent } from "../modal-window/camp-basic-information/camp-basic-information.component";
import { CampProfileGeoLocationComponent } from "../modal-window/camp-profile-geo-location/camp-profile-geo-location.component";

@Component({
    selector:'app-camp-profile',
    templateUrl:'./camp-profile.component.html',
    styleUrls:['./camp-profile.component.css'],
    standalone:true, 
    imports:[CommonModule]
})

export class CampProfileComponent implements OnInit, OnDestroy {

  constructor(private modalService:NgbModal) {}

  ngOnInit(): void {
      
  }
  personalDetail() {
    this.openModal(CampBasicInformationComponent);
  }
  geoLocation() {
    this.openModal(CampProfileGeoLocationComponent);
  }

  openModal(modalComponent: any) {
    this.modalService.open(modalComponent, { size:'xl', centered:true, backdrop: 'static', keyboard: false });    
  }

  ngOnDestroy(): void {
    this.modalService.dismissAll();
  }
}