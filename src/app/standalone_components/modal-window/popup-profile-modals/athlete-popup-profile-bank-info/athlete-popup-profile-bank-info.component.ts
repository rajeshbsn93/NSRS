import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { environment } from "src/environments/environment";

@Component({
    selector:'app-athlete-popup-profile-bank-info',
    templateUrl:'./athlete-popup-profile-bank-info.component.html',
    styleUrls:['./athlete-popup-profile-bank-info.component.css'],
    standalone:true,
    imports:[CommonModule]

})

export class AthletePopupProfileBankInfoComponent implements OnInit{
    popupDataReceived:any;
    baseUrl = environment.fileUrl
    constructor(public activeModal:NgbActiveModal){}

    ngOnInit(): void {
    }
}