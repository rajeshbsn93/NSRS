import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators, ValidationErrors, ValidatorFn, AbstractControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { first, Observable } from 'rxjs';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { CheckCredentialService, RoleEntity, UpdateUserEM } from 'src/app/_common/services/superuser-services/check-credential.service';
import { LoaderComponent } from 'src/app/standalone_components/loader/loader.component';

@Component({
  standalone: true,
  selector: 'app-already-exist-check',
  templateUrl: './already-exist-check.component.html',
  styleUrls: ['./already-exist-check.component.css'],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatSortModule,
    LoaderComponent,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatSelectModule,
    MatOptionModule,
  ],
})
export class AlreadyExistCheckComponent implements OnInit {
  form!: FormGroup;
  roleIdList$: Observable<RoleEntity[]> = this.check.getRolesList();

  constructor(private fb: FormBuilder, private check: CheckCredentialService, private alertService: AlertService) {
    this.form = this.fb.group({
      rollId: ['', Validators.required],
      userName: ['', Validators.required],
      mobileNo: ['', [Validators.pattern('^[0-9]*$'), Validators.minLength(10)]],
      emailId: ['', [Validators.email, Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)]],
    },
      {
        validators: this.atLeastOneRequired('mobileNo', 'emailId')
      }
    );
  }

  ngOnInit(): void { }

  saveDetails() {
    if (this.form.valid) {
      const payload: UpdateUserEM = {
        userName: this.form.get('userName')?.value,
        roleId: this.form.get('rollId')?.value,
        emailId: this.form.get('emailId')?.value,
        mobileNo: this.form.get('mobileNo')?.value,
      };
      console.log('payload', payload);
      this.check
        .saveUpdateUserEM(payload)
        .pipe(first())
        .subscribe({
          next: (res: any) => {
            console.log('saveDetails', res);
            if (res) {
              this.form.reset();
              this.alertService.swalPopSuccess('Update Success');
            } else {
              this.form.reset();
              this.alertService.swalPopError('Something went wrong! Please try again.');
            }
          },
          error: () => {
            this.form.reset();
            this.alertService.swalPopError('Something went wrong! Please try again.');
          },
        });
    } else {
      this.form.markAllAsTouched();
    }
  }


  atLeastOneRequired(controlName1: string, controlName2: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const formGroup = control as FormGroup;
      const control1 = formGroup.get(controlName1);
      const control2 = formGroup.get(controlName2);

      if (!control1 || !control2) {
        return null;
      }

      const value1 = control1.value;
      const value2 = control2.value;
      if (!value1 && !value2) {
        return { atLeastOneRequired: true };
      }

      return null;
    };
  }


}
