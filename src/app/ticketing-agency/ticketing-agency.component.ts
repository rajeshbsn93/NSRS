import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-ticketing-agency',
  templateUrl: './ticketing-agency.component.html',
  styleUrls: ['./ticketing-agency.component.css']
})
export class TicketingAgencyComponent implements OnInit {

  sidebarToggle = false;
  loginUserData: any = [];
  @ViewChild('mockOffcanvaschild') childsidebarOffcanvas!: any

  constructor() { }
  innerWidth: any
  ngOnInit(): void {
    this.innerWidth = window.innerWidth
  }

  ToggleSideBar(event?: any) {
    //console.log(event)
    this.sidebarToggle = !this.sidebarToggle;
    if (this.innerWidth < 768) {
      //console.log(this.innerWidth)
      this.childsidebarOffcanvas.openSidebarOffCanvas();
    }

  }
  test() {
    this.childsidebarOffcanvas.openSidebarOffCanvas()
  }

}
