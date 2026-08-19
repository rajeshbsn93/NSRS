import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-camp-admin-pages',
  templateUrl: './camp-admin-pages.component.html',
  styleUrls: ['./camp-admin-pages.component.css']
})
export class CampAdminPagesComponent implements OnInit {

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
