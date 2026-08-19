import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { catchError, EMPTY, first, forkJoin, Observable, of, shareReplay, Subscription, switchMap } from 'rxjs';
import { LoaderComponent } from 'src/app/standalone_components/loader/loader.component';
import { MaterialModule } from 'src/app/_common/material.module';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { EncryptionService } from 'src/app/_common/services/innerPagesServices/encryption.service';
import { TournamentService } from 'src/app/_common/services/innerPagesServices/tournament.service';
import {
  CHECK_TYPE,
  ManageUserService,
  UserEntity,
} from 'src/app/_common/services/superuser-services/manage-user.service';
import Swal, { SweetAlertResult } from 'sweetalert2';

export interface DialogData {
  address: string;
  emailId: string;
  mobileNo: string;
  phoneNo: string;
  roleName: string;
  role_id: number;
  state_id: number;
  userDisplayName: string;
  userId: number;
  userName: string;
}

@Component({
  standalone: true,
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.css'],
  imports: [CommonModule, MaterialModule, MatDialogModule, FormsModule, ReactiveFormsModule, LoaderComponent],
})
export class ManageUserComponent implements OnInit, OnDestroy {
  @ViewChild(MatTable) table!: MatTable<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('editUser') editUser!: TemplateRef<any>;
  @ViewChild('searchField') searchField!: ElementRef<HTMLInputElement>;
  displayedColumns: string[] = [
    'action',
    'userName',
    'userDisplayName',
    'roleName',
    'emailId',
  ];
  dataSource!: MatTableDataSource<UserEntity>;
  form: FormGroup = this.fb.group({
    address: ['', Validators.required],
    emailId: ['', [Validators.required, Validators.email]],
    mobileNo: ['', Validators.required],
    phoneNo: [''],
    roleId: [null, Validators.required],
    stateId: ['', Validators.required],
    userDisplayName: ['', Validators.required],
    userId: [0],
    userName: ['', Validators.required],
    password: [''],
    confirmPassword: [''],
    isStakeHolder: [true, Validators.required]
  });
  editUserDialogRef!: MatDialogRef<any>;
  stateList$!: Observable<any>;
  rolesList$!: Observable<any>;
  loader: boolean = true;
  subscription: Subscription = new Subscription();

  constructor(
    private managerUserService: ManageUserService,
    private matDialog: MatDialog,
    private fb: FormBuilder,
    private tournamentService: TournamentService,
    private encryptionService: EncryptionService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.form.get('confirmPassword')?.addValidators(this.confirmPasswordValidator());
    this.fetchUserDetails();
    this.stateList$ = this.tournamentService.stateMasterList(1).pipe(shareReplay(1));
    this.rolesList$ = this.managerUserService.getRole().pipe(shareReplay(1));

    this.subscription.add(
      this.form.get('password')?.valueChanges.subscribe((value) => this.form.get('confirmPassword')?.updateValueAndValidity())
    );

  }

  fetchUserDetails() {
    this.managerUserService
      .getUser()
      .pipe(first())
      .subscribe({
        next: (response: UserEntity[]) => {
        this.dataSource = new MatTableDataSource(response);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        if (this.searchField.nativeElement.value) {
          this.dataSource.filter = this.searchField.nativeElement.value;
        }
        this.loader = false;
      },
      error: (errorResponse: HttpErrorResponse) => {
        this.loader = false;
        this.alertService.swalPopError(errorResponse?.error?.message || 'Something went wrong!');
      }
    });
  }

  saveDetails() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.alertService.swalPopWarning('Invalid fields found! Please check.');
      return;
    }
    const isAlreadyExistsCheck = [
      this.managerUserService.isAlreadyExistCheck(this.form.get('userName')?.value, CHECK_TYPE.USERNAME),
      this.managerUserService.isAlreadyExistCheck(this.form.get('emailId')?.value, CHECK_TYPE.EMAIL),
      this.managerUserService.isAlreadyExistCheck(this.form.get('mobileNo')?.value, CHECK_TYPE.MOBILE)
    ];
    forkJoin(this.form.get('userId')?.value ? [of(false), of(false), of(false)] : isAlreadyExistsCheck).pipe(
      switchMap((response: boolean[]) => {
        if (response.every((item: boolean) => !item)) {
          const formValue = this.form.getRawValue();
          formValue.password = this.form.get('userId')?.value ? '' : this.encryptionService.encryptionAES(this.form.value.password);
          delete formValue.confirmPassword;
          formValue.mobileNo = formValue.mobileNo?.toString();
          formValue.phoneNo = formValue.phoneNo?.toString();
          return this.managerUserService.saveUser(formValue).pipe(catchError((errorResponse: HttpErrorResponse) => {
            this.alertService.swalPopError(errorResponse?.error?.message || 'Something went wrong! Please try again.');
            return EMPTY;
          }));
        } else {
          this.alertService.swalPopError(`${response[0] ? 'User Name' : response[1] ? 'Email ID' : 'Mobile Number'} already registered!`);
          return EMPTY;
        }
      })
    )
    .subscribe({
      next: (response: boolean) => {
        if (response) {
          const userId = this.form.get('userId')?.value;
          this.closeEditUserPopup();
          this.alertService.swalPopSuccess(`Record ${userId ? 'Updated' :'Inserted'} Successfully`);
          this.fetchUserDetails();
        } else this.alertService.swalPopError('Something went wrong! Please try again.');
      },
      error: (errorResponse: HttpErrorResponse) => {
        console.error(errorResponse);
        this.alertService.swalPopError(errorResponse?.error?.message || 'Something went wrong! Please try again.');
      }
    });
  }

  deleteUserDetails(record: UserEntity) {
    const deleteUser = () => {
      this.loader = true;
      this.managerUserService.deleteUser(record.userId.toString(), record.role_id.toString()).pipe(first()).subscribe({
        next: (response) => {
          this.loader = false;
          if (response) {
            this.alertService.swalPopSuccessTimer('Record Deleted Successfully');
            this.fetchUserDetails();
          } else {
          this.alertService.swalPopError('Something went wrong! Please try again.');
          }
        },
        error: (errorResponse: HttpErrorResponse) => {
          this.loader = false;
          this.alertService.swalPopError(errorResponse?.error?.message || 'Something went wrong! Please try again.');
        }
      });
    };
    Swal.fire({
      title: 'CONFIRMATION REQUIRED',
      text: 'Please confirm to delete!',
      confirmButtonText: 'CONFIRM',
      cancelButtonText: 'CANCEL',
      showConfirmButton: true,
      showCancelButton: true,
    }).then((result: SweetAlertResult<any>) => {
      if (result.value) deleteUser();
    })
    .catch(() => {});
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue
      ? filterValue.trim().toLowerCase()
      : filterValue;
  }

  openEditUserPopup(record: any = null) {
    if (record) {
      this.form.patchValue(record);
      this.form.get('roleId')?.setValue(record.role_id);
      this.form.get('stateId')?.setValue(record.state_id);
      this.form.get('userName')?.disable();
      this.form.get('emailId')?.disable();
      this.form.get('mobileNo')?.disable();
      this.form.get('roleId')?.disable();
      this.form.get('password')?.removeValidators(Validators.required);
      this.form.get('confirmPassword')?.removeValidators(Validators.required);
    } else {
      this.form.get('password')?.addValidators(Validators.required);
      this.form.get('confirmPassword')?.addValidators(Validators.required);
      this.form.get('userName')?.enable();
      this.form.get('emailId')?.enable();
      this.form.get('mobileNo')?.enable();
      this.form.get('roleId')?.enable();
    }
    this.editUserDialogRef = this.matDialog.open(this.editUser, {
      panelClass: 'user-popup',
      disableClose: true,
    });
  }

  closeEditUserPopup() {
    if (this.editUserDialogRef) this.editUserDialogRef.close();
    this.form.reset();
    this.form.get('userId')?.setValue(0);
    this.form.get('isStakeHolder')?.setValue(true);
  }

  confirmPasswordValidator(): ValidatorFn {
    return (control: AbstractControl) => 
      control.value && this.form.get('password')?.value !== control.value
      ? {passwordMismatch: true}
      : null;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
