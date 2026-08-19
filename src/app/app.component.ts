import { Component, HostListener } from '@angular/core';
import { AuthenticationService } from './_common/services/innerPagesServices/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'nsrs';

  // @HostListener('window:beforeunload', ['$event'])
  // beforeunloadHandler() {
  //   this.authenticationService.logout();
  // }

  constructor(private authenticationService: AuthenticationService) {}
}
