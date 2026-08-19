import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { LoaderComponent } from "src/app/standalone_components/loader/loader.component";

@Component({
    selector:'app-athlete-popup-profile-personal-details',
    templateUrl:'./athlete-popup-profile-personal-details.component.html',
    styleUrls:['./athlete-popup-profile-personal-details.component.css'],
    standalone:true,
    imports:[CommonModule,LoaderComponent]

})

export class AthletePopupProfilePersonalDetailsComponent implements OnInit{
    popupDataReceived:any
    constructor(public activeModal:NgbActiveModal){}

    ngOnInit(): void {
        // console.log(this.popupDataReceived)
    }
}