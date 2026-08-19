import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-kisce-dashboard',
  templateUrl: './kisce-dashboard.component.html',
  styleUrls: ['./kisce-dashboard.component.css']
})
export class KisceDashboardComponent implements OnInit {
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
