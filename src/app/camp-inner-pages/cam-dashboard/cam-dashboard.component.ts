import { Component, OnInit } from "@angular/core";
import { OwlOptions } from "ngx-owl-carousel-o";

@Component({
    selector:'app-cam-dashboard',
    templateUrl:'./cam-dashboard.component.html',
    styleUrls:['./cam-dashboard.component.css']
})

export class CampDashboardComponent implements OnInit{
    constructor(){}
    ngOnInit(): void {
        
    }
    customOptions: OwlOptions = {
        loop: true,
        mouseDrag: false,
        touchDrag: false,
        pullDrag: false,
        dots: false,
        navSpeed: 700,
        navText: ['<i class="fa-solid fa-angle-left"></i>', '<i class="fa-solid fa-angle-right"></i>'],
        responsive: {
          0: {
            items: 1
          },
          400: {
            items: 2
          },
          740: {
            items: 3
          },
          940: {
            items: 3
          }
        },
        nav: true,
        margin: 15
      }

}