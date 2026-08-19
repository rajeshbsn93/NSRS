import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { LoaderComponent } from "../../loader/loader.component";
import {certificateDetailsEntity } from "src/app/_common/services/common-services/khelo-india-games.service";
import { MaterialModule } from "src/app/_common/material.module";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";

@Component({
    selector:'app-khelo-india-games-certificates-modal',
    templateUrl:'./khelo-india-games-certificates-modal.component.html',
    styleUrls:['./khelo-india-games-certificates-modal.component.css'],
    standalone:true,
    imports:[CommonModule,LoaderComponent, MaterialModule]
})
export class KheloIndiaGamesCertificatesModalComponent implements OnInit, AfterViewInit{
    kheloIndiaPlayerTableColumns:String[] = ['certificate_Type','certificate_number','position','event_name']
    @ViewChild(MatPaginator) paginator!:MatPaginator;
    @ViewChild(MatSort) sort!:MatSort;
    certificateDetailsData:any
    KheloIndiaPlayerData = new MatTableDataSource<certificateDetailsEntity>();

    constructor(
        public activeModal:NgbActiveModal,
        ){}
    ngOnInit(): void {
        // console.log(this.certificateDetailsData)
        this.getCertificateDetails();
    }
    ngAfterViewInit(): void {
        this.KheloIndiaPlayerData.paginator = this.paginator;
        this.KheloIndiaPlayerData.sort = this.sort
    }
    getCertificateDetails(){
        const certificateData = this.certificateDetailsData?.certificateDetails == "" ? [] : JSON.parse(this.certificateDetailsData?.certificateDetails)
        this.KheloIndiaPlayerData = new MatTableDataSource<certificateDetailsEntity>(certificateData);
    }
}