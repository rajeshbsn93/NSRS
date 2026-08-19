import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { MaterialModule } from 'src/app/_common/material.module';
import { AadhaarService } from 'src/app/_common/services/common-services/aadhaar.service';
import { StorageService } from 'src/app/_common/services/common-services/storage.service';
import { LoaderComponent } from 'src/app/standalone_components/loader/loader.component';

@Component({
  standalone: true,
  selector: 'app-view-aadhar',
  templateUrl: './view-aadhar.component.html',
  styleUrls: ['./view-aadhar.component.css'],
  imports: [CommonModule, FormsModule, LoaderComponent,MaterialModule]
})
export class ViewAadhaarComponent implements OnInit {
  userDetails:any;
  aadhaarData$:Observable<any> = new Observable<any>()
  aadhaarImgBase = 'data:image/png;base64,'

  constructor(
    public activeModal: NgbActiveModal, private storageService:StorageService,private aadhaarService:AadhaarService
  ) {}

  ngOnInit(): void {
    this.userDetails = this.storageService.getUserDetails()
    // console.log(this.userDetails)
    this.aadhaarData$ = this.aadhaarService.getAadhaar(this.userDetails.user_id,this.userDetails.role_id)
  }

}
