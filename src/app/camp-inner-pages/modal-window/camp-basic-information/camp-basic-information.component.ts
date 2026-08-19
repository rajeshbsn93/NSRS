import { CommonModule, DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Observable, map } from "rxjs";
import { CampInnerPagesService, GetCampDetailEntity } from "src/app/_common/services/camp-services/camp-inner-pages.service";
import { StorageService } from "src/app/_common/services/common-services/storage.service";
import { LoaderComponent } from "src/app/standalone_components/loader/loader.component";

@Component({
    selector:'app-camp-basic-information',
    templateUrl:'./camp-basic-information.component.html',
    styleUrls:['./camp-basic-information.component.css'],
    standalone:true,
    imports:[CommonModule,LoaderComponent],
    providers:[DatePipe]

})

export class CampBasicInformationComponent implements OnInit{
    popupDataReceived:any;
    userDetails:any;
    CampBasicData$:Observable<any> = new Observable();;

    constructor(public activeModal:NgbActiveModal,private storageService:StorageService,private campInnerPagesService:CampInnerPagesService,
        private datePipe:DatePipe){}

    ngOnInit(): void {
        this.userDetails=this.storageService.getUserDetails();
        this.getBasicCampDetail();
    }

    getBasicCampDetail(){
      this.CampBasicData$ =  this.campInnerPagesService.basicCampDetail(this.userDetails.user_id).pipe(map((items:any)=>{
        return items.map((item:any)=>{
            return {...item,from_date:item.from_date ? this.datePipe.transform(item.from_date,'dd-MM-yyyy') : item.from_date,
                    to_date:item.to_date ? this.datePipe.transform(item.to_date,'dd-MM-yyyy') : item.to_date
                    }
        })
      }))
    }
}