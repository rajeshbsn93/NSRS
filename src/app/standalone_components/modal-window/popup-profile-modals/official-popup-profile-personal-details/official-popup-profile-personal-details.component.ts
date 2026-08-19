import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { LoaderComponent } from "src/app/standalone_components/loader/loader.component";

@Component({
    selector:'app-official-popup-profile-personal-details',
    templateUrl:'./official-popup-profile-personal-details.component.html',
    styleUrls:['./official-popup-profile-personal-details.component.css'],
    standalone:true,
    imports:[CommonModule,LoaderComponent]

})

export class OfficialPopupProfilePersonalDetailsComponent implements OnInit{
    popupDataReceived:any
    constructor(public activeModal:NgbActiveModal){}

    ngOnInit(): void {
        // console.log(this.popupDataReceived)
    }
}