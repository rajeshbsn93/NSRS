import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-kic-dashboard',
  templateUrl: './kic-dashboard.component.html',
  styleUrls: ['./kic-dashboard.component.css']
})
export class KicDashboardComponent implements OnInit {

  regionId: any = '0'
  category: any = 'state'  //state or discipline or detail_map or density map

  constructor() { }

  ngOnInit(): void {
  }

  regionIdChange(event: any) {
    this.regionId = String(event?.regionId)
  }

  categoryChange(event: any) {
    this.category = event?.category;
  }

}
