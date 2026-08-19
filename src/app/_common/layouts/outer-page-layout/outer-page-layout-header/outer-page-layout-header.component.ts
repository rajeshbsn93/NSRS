import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-outer-page-layout-header',
  templateUrl: './outer-page-layout-header.component.html',
  styleUrls: ['./outer-page-layout-header.component.css']
})
export class OuterPageLayoutHeaderComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  goToSsoLoginPage() {
    window.open(environment.ssoLoginUrl + 'login?appId=' + environment.encrAppId, '_self');
  }

}
