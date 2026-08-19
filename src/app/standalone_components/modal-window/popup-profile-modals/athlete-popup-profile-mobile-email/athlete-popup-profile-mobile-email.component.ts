import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { LoaderComponent } from "src/app/standalone_components/loader/loader.component";

@Component({
    selector:'app-athlete-popup-profile-mobile-email',
    templateUrl:'./athlete-popup-profile-mobile-email.component.html',
    styleUrls:['./athlete-popup-profile-mobile-email.component.css'],
    standalone:true,
    imports:[CommonModule,LoaderComponent]

})

export class AthletePopupProfileMobileEmailComponent implements OnInit{
    popupDataReceived:any
    constructor(public activeModal:NgbActiveModal){}

    ngOnInit(): void {
    }
}