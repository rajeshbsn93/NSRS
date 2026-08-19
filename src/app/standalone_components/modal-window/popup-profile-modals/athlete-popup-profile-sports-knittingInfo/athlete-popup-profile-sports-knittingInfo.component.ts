import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { LoaderComponent } from "src/app/standalone_components/loader/loader.component";

@Component({
    selector:'app-athlete-popup-profile-sports-knittingInfo',
    templateUrl:'./athlete-popup-profile-sports-knittingInfo.component.html',
    styleUrls:['./athlete-popup-profile-sports-knittingInfo.component.css'],
    standalone:true,
    imports:[CommonModule,LoaderComponent]

})

export class AthletePopupProfileSportsKnittingInfoComponent implements OnInit{
    popupDataReceived:any
    constructor(public activeModal:NgbActiveModal){}

    ngOnInit(): void {
    }
}