import { Component, OnInit, ViewChild } from '@angular/core';
import { StorageService } from '../_common/services/common-services/storage.service';

@Component({
  selector: 'app-camp-inner-pages',
  templateUrl: './camp-inner-pages.component.html',
  styleUrls: ['./camp-inner-pages.component.css']
})
export class CampInnerPagesComponent implements OnInit {
  userDetails: any
  sidebarToggle = false;
  loginUserData: any = [];
  @ViewChild('mockOffcanvaschild') childsidebarOffcanvas!: any
  innerWidth: any

  constructor(private storageService: StorageService) {
    this.userDetails = this.storageService.getAcademyDetails();
  }

  ngOnInit() {
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
