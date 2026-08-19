import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-super-admin',
  templateUrl: './super-admin.component.html',
  styleUrls: ['./super-admin.component.css']
})
export class SuperAdminComponent implements OnInit {
  @ViewChild('mockOffcanvaschild') childsidebarOffcanvas!:any;
  sidebarToggle = false;
  loginUserData:any=[];
  innerWidth:any;

  constructor() { }

  ngOnInit(): void {
    this.innerWidth = window.innerWidth;
  }
  
  ToggleSideBar(event?:any) {
    this.sidebarToggle = !this.sidebarToggle;
    if(this.innerWidth<768){
      this.childsidebarOffcanvas.openSidebarOffCanvas();
    }
    
  }
  test(){
    this.childsidebarOffcanvas.openSidebarOffCanvas();
  }
}
