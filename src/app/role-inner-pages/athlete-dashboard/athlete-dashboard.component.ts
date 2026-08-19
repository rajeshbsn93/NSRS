import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { AthleteDashboardSidebarComponent } from './athlete-dashboard-sidebar/athlete-dashboard-sidebar.component';
import { UpcommingEventComponent } from './upcoming-event.component';
import { AthleteDashboardService } from 'src/app/_common/services/role-inner-pages-services/athlete-services/athlete-dashboard.service';
import { CommonModule } from '@angular/common';
import { AthleteDashboardIRootObject } from 'src/app/_common/models/athlete-dashboard';
import { Observable, Subscription, first, map } from 'rxjs';
import { LoaderComponent } from 'src/app/standalone_components/loader/loader.component';
import { StorageService } from 'src/app/_common/services/common-services/storage.service';
import { RouterModule } from '@angular/router';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  standalone: true,
  selector: 'app-athlete-dashboard',
  templateUrl: './athlete-dashboard.component.html',
  styleUrls: ['./athlete-dashboard.component.css'],
  imports:[CommonModule,AthleteDashboardSidebarComponent,CarouselModule,UpcommingEventComponent,LoaderComponent,RouterModule,NgbTooltipModule]
})
export class AthleteDashboardComponent implements OnInit, OnDestroy {

  athleteDashboardData: any;
  athleteDashboardSubscription:Subscription = new Subscription();
  loader:boolean = false;
  userDetails:any;
  // athleteDashboardData$: Observable<AthleteDashboardIRootObject> = this.athleteDashboardService.GetAthleteDashboardData(this.userDetails.user_id);
  

  constructor(private athleteDashboardService:AthleteDashboardService,private storageService:StorageService) { }
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: true,
    //margin:10,
    navSpeed: 700,
    // navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      500: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 3
      }
    },
    nav: false
  }

  ngOnInit(): void {
    this.userDetails=this.storageService.getUserDetails()
    this.getAthleteDashboardData();
  }
  getAthleteDashboardData(){
    this.loader = true
   this.athleteDashboardSubscription = this.athleteDashboardService.GetAthleteDashboardData(this.userDetails.user_id).pipe(first(),map((items)=>{
    return items.athleteAchievementDatas
   })).subscribe({
    next:(response) =>{
      this.loader = false
      this.athleteDashboardData = response;
    },
    error:(error)=>{
      this.loader= false
      console.error(error)
    }
  });
 }

ngOnDestroy(): void {
  this.athleteDashboardSubscription.unsubscribe();
}

}


