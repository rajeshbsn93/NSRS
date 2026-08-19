import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { first } from 'rxjs';
import { StorageService } from 'src/app/_common/services/common-services/storage.service';
import { AuthenticationService } from 'src/app/_common/services/innerPagesServices/authentication.service';

@Component({
  selector: 'app-menu-list',
  templateUrl: './menu-list.component.html',
  styleUrls: ['./menu-list.component.css'],
  standalone:true,
  imports:[CommonModule, RouterModule]
})
export class MenuListComponent implements OnInit {
  @Output() menuClickEvent = new EventEmitter()
userDetail:any
  constructor(
    private storageService:StorageService,
    public authenticateService:AuthenticationService
  ) { }

  ngOnInit() {
    this.userDetail = this.storageService.getUserDetails()
    if (!this.authenticateService.dashboardData) {
          // this.innerLoaderMainData = true;
          this.authenticateService
            .getDashboardMenu(this.userDetail.role_id)
            .pipe(first())
            .subscribe({
              // next: () => (this.innerLoaderMainData = false),
              // error: () => (this.innerLoaderMainData = false),
              next: () => (console.log('success')),
              error: () =>console.log('error'),
            });
        }
  }
  onMenuClick(){
    this.menuClickEvent.emit(false)
  }

}
