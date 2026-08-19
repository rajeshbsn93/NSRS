import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { LoaderComponent } from "src/app/standalone_components/loader/loader.component";
import { environment } from "src/environments/environment";

@Component({
    selector:'app-athlete-popup-profile-document-info',
    templateUrl:'./athlete-popup-profile-document-info.component.html',
    styleUrls:['./athlete-popup-profile-document-info.component.css'],
    standalone:true,
    imports:[CommonModule,LoaderComponent]

})

export class AthletePopupProfileDocumentInfoComponent implements OnInit{
    popupDataReceived:any;
    baseUrl = environment.fileUrl;
    constructor(public activeModal:NgbActiveModal){}

    ngOnInit(): void {
    }
}