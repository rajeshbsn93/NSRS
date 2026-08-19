import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from 'src/app/_common/material.module';
import { LoaderComponent } from 'src/app/standalone_components/loader/loader.component';

@Component({
  standalone: true,
  selector: 'app-athlete-popup-profile-language-info',
  templateUrl: './athlete-popup-profile-language-info.component.html',
  styleUrls: ['./athlete-popup-profile-language-info.component.css'],
  imports: [CommonModule, FormsModule, LoaderComponent,MaterialModule]
})
export class AthletePopupProfileLanguageInfoComponent implements OnInit {
  popupDataReceived: any
  loader: boolean = false;

  constructor(
    public activeModal: NgbActiveModal,
  ) {}

  ngOnInit(): void {
  }

}
