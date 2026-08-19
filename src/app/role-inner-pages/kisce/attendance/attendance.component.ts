import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StorageService } from 'src/app/_common/services/common-services/storage.service';
import { KicAttendanceService } from 'src/app/_common/services/role-inner-pages-services/kic-services/kic-attendance.service';
import { KisceAddAttendanceComponent } from 'src/app/standalone_components/modal-window/kisce-add-attendance/kisce-add-attendance.component';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css']
})
export class AttendanceComponent implements OnInit {

 displayedColumns: string[] = ['sno', 'attendanceRecord', 'maleCount', 'femaleCount', 'total', 'uploadDate', 'fromDate', 'toDate', 'recordFile'];
  dataSource: any

  addAttendanceModalRef: any
  userDetails: any
  enableAddBtn: boolean = true;


  constructor(private _modalService: NgbModal, private _storageService: StorageService, private _route: Router, private _kicAttendanceService: KicAttendanceService) {
    this.userDetails = this._storageService.getUserDetails();
  }

  ngOnInit(): void {
    this._kicAttendanceService.getShowAddBtnAthlete().subscribe((res: any) => {
      this.enableAddBtn = res
    })
  }

  popupOpen() {
    this.addAttendanceModalRef = this._modalService.open(KisceAddAttendanceComponent, { size: 'xl', centered: true, backdrop: 'static' });
    // this.addAttendanceModalRef.componentInstance.coachData
    this.addAttendanceModalRef.result.then((event: any) => {
      if (event === 'save') {
        // debugger
        this._kicAttendanceService.setIsListRefresh(true);
      }
    });
  }

}
