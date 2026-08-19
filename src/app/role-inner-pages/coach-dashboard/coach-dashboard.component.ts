import { Component, OnInit } from '@angular/core';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { CoachDashboardService } from 'src/app/_common/services/role-inner-pages-services/coach-services/coach-dashboard.service';
import { CommonModule } from '@angular/common';
import { first } from 'rxjs';
import { LoaderComponent } from 'src/app/standalone_components/loader/loader.component';
import { StorageService } from 'src/app/_common/services/common-services/storage.service';
import { RouterModule } from '@angular/router';
import { OfficialUpcommingEventComponent } from './official-upcoming-event.component';
import { AthleteDashboardSidebarComponent } from '../athlete-dashboard/athlete-dashboard-sidebar/athlete-dashboard-sidebar.component';

@Component({
  standalone: true,
  selector: 'app-coach-dashboard',
  templateUrl: './coach-dashboard.component.html',
  styleUrls: ['./coach-dashboard.component.css'],
  imports:[CommonModule,AthleteDashboardSidebarComponent,CarouselModule,LoaderComponent,RouterModule, OfficialUpcommingEventComponent]
})
export class CoachDashboardComponent implements OnInit {

  coachDashboardData!: any;
  loader:boolean = false;
  userDetails:any
  // coachDashboardData$: Observable<CoachDashboardIRootObject> = this.coachDashboardService.GetCoachDashboardData(this.userDetails.user_id);
  

  constructor (
    private coachDashboardService:CoachDashboardService,
    private storageService:StorageService
  ) {}

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: true,
    // margin:10,
    navSpeed: 700,
    // navText: ['', ''],
    responsive: {
      0: { items: 1 },
      400: { items: 1 },
      500: { items: 2 },
      740: { items: 3 },
      940: { items: 3 }
    },
    nav: false
  }

  ngOnInit(): void {
    this.userDetails=this.storageService.getUserDetails()
    // this.coachDashboardService.getCoachDashboardData(this.userDetails.user_id).pipe(first()).subscribe({
    //   next:(response: any) =>{
    //     this.loader = false
    //     this.coachDashboardData = response;
    //   },
    //   error:(error)=>{
    //     this.loader= false
    //     console.error()
    //   }
    // });
  }
}


