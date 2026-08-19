import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, shareReplay } from 'rxjs';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { StorageService } from 'src/app/_common/services/common-services/storage.service';
import { AthleteLanguageEntity, AthleteLanguageModalService, LanguageEntity } from 'src/app/_common/services/role-inner-pages-services/athlete-services/athlete-language-modal.service';
import { LoaderComponent } from 'src/app/standalone_components/loader/loader.component';

@Component({
  selector: 'app-athlete-language-modal',
  templateUrl: './athlete-language-modal.component.html',
  styleUrls: ['./athlete-language-modal.component.css'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, MatInputModule,
    LoaderComponent, MatSelectModule, MatCheckboxModule
  ],
})
export class AthleteLanguageModalComponent implements OnInit {
  languageList$: Observable<LanguageEntity[]> = this.athleteLanguageModalService.getLanguageList().pipe(shareReplay(1));
  playerDetailId?: number;
  form: FormGroup = this.formBuilder.group({
    primary_communication_language: [null, Validators.required],
    is_primary_read: false,
    is_primary_write: false,
    secondary_communication_language: [null],
    is_secondary_read: false,
    is_secondary_write: false
  });
  loader: boolean = false;

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private storageService: StorageService,
    private alertService: AlertService,
    private athleteLanguageModalService: AthleteLanguageModalService
  ) {}

  ngOnInit(): void {
    this.getPlayerLanguageInfo();
  }

  getPlayerLanguageInfo() {
    this.playerDetailId = this.storageService.getUserDetails()?.user_id;
    if (!this.playerDetailId) return;
    this.athleteLanguageModalService.getPlayerLanguageInfo(this.storageService.getUserDetails().user_id).subscribe({
      next: (response: AthleteLanguageEntity) => {
        this.form.patchValue(response);
        if (!response?.secondary_communication_language) {
          this.form.get('is_secondary_read')?.disable();
          this.form.get('is_secondary_write')?.disable();
        }
      },
      error: () => {
        this.alertService.swalPopError('Something went wrong! Please try again');
      }
    })
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.alertService.swalPopWarning('Invalid fields found! Please check.');
      return;
    }

    if (this.form.value.primary_communication_language && !this.form.value.is_primary_read && !this.form.value.is_primary_write) {
      this.alertService.swalPopWarning('Please select atleast one checkbox of Primary Language');
      return;
    }

    if (
      this.form.value.secondary_communication_language && 
      !this.form.getRawValue().is_secondary_read && 
      !this.form.getRawValue().is_secondary_write
    ) {
      this.alertService.swalPopWarning('Please select atleast one checkbox of Secondary Language');
      return;
    }

    this.athleteLanguageModalService.savePlayerLanguageInfo({
      player_detail_id: this.playerDetailId,
       ...this.form.getRawValue(),
       is_secondary_read: this.form.get('is_secondary_read')?.disabled ? null : this.form.value.is_secondary_read,
       is_secondary_write: this.form.get('is_secondary_write')?.disabled ? null : this.form.value.is_secondary_write
    }).subscribe({
      next: (response: boolean) => {
        if (response) {
          this.activeModal.close();
          this.alertService.swalPopSuccess('Languages updated successfully');
        } else
            this.alertService.swalPopError('Something went wrong! Please try again');
      },
      error: () => {
        this.alertService.swalPopError('Something went wrong! Please try again');
      }
    })
  }

  onSecLanguageChange(event: MatSelectChange) {
    if (event.value) {
      this.form.get('is_secondary_read')?.enable();
      this.form.get('is_secondary_write')?.enable();
      if (this.form.value.is_secondary_read === null) this.form.get('is_secondary_read')?.setValue(false);
      if (this.form.value.is_secondary_write === null) this.form.get('is_secondary_write')?.setValue(false);
    } else {
      this.form.get('is_secondary_read')?.disable();
      this.form.get('is_secondary_write')?.disable();
      this.form.get('is_secondary_read')?.setValue(false);
      this.form.get('is_secondary_write')?.setValue(false);
    }
  }
}
