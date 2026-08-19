import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { environment } from "src/environments/environment";

@Component({
    selector:'app-oficial-popup-profile-bank-info',
    templateUrl:'./oficial-popup-profile-bank-info.component.html',
    styleUrls:['./oficial-popup-profile-bank-info.component.css'],
    standalone:true,
    imports:[CommonModule]

})

export class OfficialPopupProfileBankInfoComponent implements OnInit{
    popupDataReceived:any;
    baseUrl = environment.fileUrl
    constructor(public activeModal:NgbActiveModal){}

    ngOnInit(): void {
    }
}