import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { LoaderComponent } from "src/app/standalone_components/loader/loader.component";
import { environment } from "src/environments/environment";

@Component({
    selector:'app-oficial-popup-profile-document-info',
    templateUrl:'./oficial-popup-profile-document-info.component.html',
    styleUrls:['./oficial-popup-profile-document-info.component.css'],
    standalone:true,
    imports:[CommonModule,LoaderComponent]

})

export class OfficialPopupProfileDocumentInfoComponent implements OnInit{
    popupDataReceived:any;
    baseUrl = environment.fileUrl;
    constructor(public activeModal:NgbActiveModal){}

    ngOnInit(): void {
        // console.log(this.popupDataReceived)
    }
}