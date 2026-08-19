import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LoaderComponent } from 'src/app/standalone_components/loader/loader.component';

@Component({
  standalone: true,
  selector: 'app-athlete-popup-profile-education-info',
  templateUrl: './athlete-popup-profile-education-info.component.html',
  styleUrls: ['./athlete-popup-profile-education-info.component.css'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatInputModule, MatFormFieldModule, MatSelectModule, LoaderComponent]
})
export class AthletePopupProfileEducationInfoComponent implements OnInit {
  popupDataReceived: any
  loader: boolean = false;

  constructor(
    public activeModal: NgbActiveModal,
  ) {}

  ngOnInit(): void {
  }

}
