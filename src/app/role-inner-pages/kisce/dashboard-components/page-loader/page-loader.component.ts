import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-page-loader',
  templateUrl: './page-loader.component.html',
  styleUrls: ['./page-loader.component.css']
})
export class PageLoaderComponent implements OnInit, OnChanges {

  @Input() show: boolean = false;
  @Input() color: any = '#1F60AB';
  @Input() loaderType: any = 'pgMedium';

  constructor(private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    // ++++++++++++ Used This package for showing loader +++++++++++++ 
    // "ngx-spinner": "^13.1.1",
    // this.spinner.hide(); ---- this is also function to hide spinner
    this.spinner.show();
  }
  ngOnChanges(): void {
    if (this.show) {
      this.spinner.show();
    } else {
      // this.spinner.hide();      
    }
  }
  ngOnDestroy(): void {
    // this.spinner.hide();
  }

}
