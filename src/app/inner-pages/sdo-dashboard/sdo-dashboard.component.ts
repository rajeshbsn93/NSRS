import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import * as Highcharts from 'highcharts';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-sdo-dashboard',
  templateUrl: './sdo-dashboard.component.html',
  styleUrls: ['./sdo-dashboard.component.css']
})
export class SdoDashboardComponent implements OnInit {
  Highcharts: typeof Highcharts = Highcharts;
  updateFlag: boolean = false;
  roleid: any;
  constructor(public router:Router,private modalService: NgbModal,) {
    this.tokenExpireAlert()
  }

  localStorageData: any
  ngOnInit(): void {
    localStorage.getItem('data')
    // this.authenticationService.getDashboardMenu()
    this.localStorageData = (localStorage.getItem('sessiondata'))
    //console.log(JSON.parse(this.localStorageData))
    //console.log("expiry time", JSON.parse(this.localStorageData).expiryTime)

  }
  chartOptions: Highcharts.Options = {
    series: [{
      name: 'Games',
      data: [1, 2, 3],
      type: 'column',

    }],
    title: {
      text: 'Participation'
    },
    xAxis: {
      categories: ['Athletes', 'Badminton', 'Archery']
    },
    yAxis: {
      min: 0,
      title: {
        text: null
      }
    },
    credits: {
      enabled: false
    },
  };

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
  tokenExpireAlert() {
    setTimeout(() => {
      Swal.fire({
        icon: 'info',
        text: 'Your session Has expired',
        allowOutsideClick:false,
        showConfirmButton:true
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['/login'])
          this.modalService.dismissAll();
        }
      })      
    }, 3600000);
    // }, 1500);
  }
}
