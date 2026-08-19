import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-district-map-detail',
  templateUrl: './district-map-detail.component.html',
  styleUrls: ['./district-map-detail.component.css']
})
export class DistrictMapDetailComponent implements OnInit {

  popupShow: boolean = true
  @Output() showHideControl: any = new EventEmitter();
  @Input() data: any

  constructor() { }

  ngOnInit(): void {
    console.log(this.data);
    
  }

  popupControl_hide() {
    this.popupShow = false;
    this.showHideControl.emit(false);
  }
  popupControl_show() {
    this.popupShow = true;
    this.showHideControl.emit(true);
  }
  ClickedOut(event: any) {
    if (event.target.className === 'modal fade show') {
      // this.popupShow = false;
      // this.showHideControl.emit(false);
    }
  }

}
