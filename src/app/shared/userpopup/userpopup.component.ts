import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-userpopup',
  templateUrl: './userpopup.component.html',
  styleUrls: ['./userpopup.component.css']
})
export class UserpopupComponent implements OnInit {
  modalRef?: BsModalRef;
  @ViewChild('content') modeShow:any
  constructor( private modalService:BsModalService) { }

  ngOnInit(): void {
  }
  openModal() {
    this.modalRef = this.modalService.show(this.modeShow);
  }
}
