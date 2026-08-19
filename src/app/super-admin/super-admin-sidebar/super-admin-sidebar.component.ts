import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { StorageService } from 'src/app/_common/services/common-services/storage.service';
import { ActivatedRoute } from '@angular/router';
import { first, Observable } from 'rxjs';
import { AuthenticationService } from 'src/app/_common/services/innerPagesServices/authentication.service';

@Component({
  selector: 'app-super-admin-sidebar',
  templateUrl: './super-admin-sidebar.component.html',
  styleUrls: ['./super-admin-sidebar.component.css'],
})
export class SuperAdminSidebarComponent implements OnInit {
  sidebarToggle = false;
  userDetails: any;
  loginUserData: any = [];
  sessionResponse: any;
  state$!: Observable<object>;
  loaderMain: boolean = false;
  @ViewChild('sidebarOffCanvasContent') sidebarOffCanvas: any;
  innerLoaderMainData: boolean = false;

  constructor(
    public authenticateService: AuthenticationService,
    private _storageService: StorageService,
    public activatedRoute: ActivatedRoute,
    private offcanvasService: NgbOffcanvas
  ) {}

  ngOnInit(): void {
    //getting user roleid, userid and other details from stroage service
    this.userDetails = this._storageService.getUserDetails();
    if (!this.authenticateService.dashboardData) {
      this.innerLoaderMainData = true;
      this.authenticateService
        .getDashboardMenu(this._storageService.getUserDetails().role_id)
        .pipe(first())
        .subscribe({
          next: () => (this.innerLoaderMainData = false),
          error: () => (this.innerLoaderMainData = false),
        });
    }
    this.sidebarMenuData(this.menuData);
  }
  public toggleSidebar() {
    this.sidebarToggle = !this.sidebarToggle;
  }
  // generateSession(roleid: any, userid: any) {
  //   // this.authenticateService.generateSessionData(roleid,userid,token).subscribe(res=>{
  //   //   this.sessionResponse=res;
  //   //   console.log(this.sessionResponse)
  //   //   console.log("session respo")
  //   //   this.getMenu()
  //   //   localStorage.setItem('sessiondata', JSON.stringify(this.sessionResponse));
  //   //   // this.authenticateService.getsession().subscribe(res=>{
  //   //   //   console.log("seesiobfdgn")
  //   //   //   console.log(res)
  //   //   //   this.getMenu()
  //   //   // })
  //   // })

  // }

  //send menu data from sidebar component to storage service
  menuData: any;
  sidebarMenuData(menuData: any) {
    this.menuData = menuData;
    this._storageService.setState(this.menuData);
    this._storageService.sendMenuData(this.menuData);
  }
  openSidebarOffCanvas() {
    this.offcanvasService.open(this.sidebarOffCanvas, {
      backdropClass: 'offcanvas-sidebarBackdrop',
      panelClass: 'offcanvas-sidebarPanel',
    });
  }
}
