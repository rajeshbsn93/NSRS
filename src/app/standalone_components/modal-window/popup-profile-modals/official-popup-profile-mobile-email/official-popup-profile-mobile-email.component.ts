import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { LoaderComponent } from "src/app/standalone_components/loader/loader.component";

@Component({
    selector:'app-official-popup-profile-mobile-email',
    templateUrl:'./official-popup-profile-mobile-email.component.html',
    styleUrls:['./official-popup-profile-mobile-email.component.css'],
    standalone:true,
    imports:[CommonModule,LoaderComponent]

})

export class OfficialPopupProfileMobileEmailComponent implements OnInit{
    popupDataReceived:any
    constructor(public activeModal:NgbActiveModal){}

    ngOnInit(): void {
    }
}