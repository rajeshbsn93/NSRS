import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { LoaderComponent } from "src/app/standalone_components/loader/loader.component";

@Component({
    selector:'app-athlete-popup-profile-address-info',
    templateUrl:'./athlete-popup-profile-address-info.component.html',
    styleUrls:['./athlete-popup-profile-address-info.component.css'],
    standalone:true,
    imports:[CommonModule,LoaderComponent]

})

export class AthletePopupProfileAddressInfoComponent implements OnInit{
    popupDataReceived:any
    constructor(public activeModal:NgbActiveModal){}

    ngOnInit(): void {
    }
}