import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-app-layout',
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.css']
})
export class AppLayoutComponent implements OnInit {
  sidebarToggle = false;
  constructor(private authenticateService:AuthenticationService) { }

  ngOnInit(): void {
  }
  public toggleSidebar() {
    this.sidebarToggle = !this.sidebarToggle
  }
logout(){
  this.authenticateService.logout()
}
}
