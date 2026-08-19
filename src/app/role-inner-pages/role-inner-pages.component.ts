import { Component, OnInit, ViewChild } from '@angular/core';
import { StorageService } from '../_common/services/common-services/storage.service';

@Component({
  selector: 'app-role-inner-pages',
  templateUrl: './role-inner-pages.component.html',
  styleUrls: ['./role-inner-pages.component.css']
})
export class RoleInnerPagesComponent implements OnInit {
  userDetails: any
  sidebarToggle = false;
  loginUserData: any = [];
  @ViewChild('mockOffcanvaschild') childsidebarOffcanvas!: any
  innerWidth: any
  constructor(private storageService: StorageService) { }

  ngOnInit() {
    this.innerWidth = window.innerWidth
    this.userDetails = this.storageService.getAcademyDetails();
    //console.log(this.userDetails)
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
