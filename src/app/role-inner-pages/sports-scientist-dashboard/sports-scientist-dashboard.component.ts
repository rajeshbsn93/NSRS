import { Component } from '@angular/core';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from 'src/app/standalone_components/loader/loader.component';
import { StorageService } from 'src/app/_common/services/common-services/storage.service';
import { RouterModule } from '@angular/router';
import { OfficialUpcommingEventComponent } from '../coach-dashboard/official-upcoming-event.component';
import { AthleteDashboardSidebarComponent } from '../athlete-dashboard/athlete-dashboard-sidebar/athlete-dashboard-sidebar.component';

@Component({
    selector:'app-sports-scientist-dashboard',
    templateUrl:'./sports-scientist-dashboard.component.html',
    styleUrls:['./sports-scientist-dashboard.component.css'],
    standalone:true,
    imports:[CommonModule,AthleteDashboardSidebarComponent,CarouselModule,LoaderComponent,RouterModule, OfficialUpcommingEventComponent]
})

export class SportsScientistDashboardComponent{
    ssDashboardData!: any;
    loader:boolean = false;
    userDetails:any;
  

  constructor (
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
    this.userDetails=this.storageService.getUserDetails();
  }
}