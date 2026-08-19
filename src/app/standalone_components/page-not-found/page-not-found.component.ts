import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/_common/services/innerPagesServices/authentication.service';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.css']
})
export class PageNotFoundComponent implements OnInit {
  loader: boolean = false;

  constructor(private authService: AuthenticationService) { }

  ngOnInit() {
    // const setLoaderFn = ((value: boolean): void => {this.loader = value});
    // this.authService.logout(setLoaderFn.bind(this));
  }

}
