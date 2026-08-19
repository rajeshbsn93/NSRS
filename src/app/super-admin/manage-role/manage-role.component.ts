import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { first, Observable, Subscription } from 'rxjs';
import { LoaderComponent } from 'src/app/standalone_components/loader/loader.component';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { AppEntity, EditDashboardEntity, EditRoleEntity, ManageRoleService, RoleEntity } from 'src/app/_common/services/superuser-services/manage-role.service';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  standalone: true,
  selector: 'app-manage-role',
  templateUrl: './manage-role.component.html',
  styleUrls: ['./manage-role.component.css'],
  imports: [
    CommonModule, MatFormFieldModule, MatInputModule, MatIconModule,
    MatTableModule, MatPaginatorModule, MatButtonModule, MatSortModule,
    LoaderComponent, FormsModule, ReactiveFormsModule, MatDialogModule,
    MatRadioModule, MatSelectModule, MatTooltipModule
  ]
})
export class ManageRoleComponent implements OnInit, OnDestroy {
  @ViewChild(MatTable) table!: MatTable<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('editRole') editRole!: TemplateRef<any>;
  @ViewChild('editDashboard') editDashboard!: TemplateRef<any>;
  @ViewChild('searchField') searchField!: ElementRef<HTMLInputElement>;
  displayedColumns: string[] = [
    'action',
    'role_name',
    'dashboard_name'
  ];
  dataSource!: MatTableDataSource<RoleEntity>;
  editRoleDialogRef!: MatDialogRef<any>;
  editDashboardDialogRef!: MatDialogRef<any>;
  loader: boolean = true;
  landingDashboardList!: RoleEntity[] | null;
  appIdControl: FormControl = new FormControl(1);

  form: FormGroup = this.fb.group({
    roleId: null,
    roleName: [null, Validators.required],
    dashboardName: null,
    newDashboard: null
  });
  appIdList$: Observable<AppEntity[]> = this.managerRoleService.getAppIdList();
  subscription: Subscription = new Subscription();

  constructor(
    private managerRoleService: ManageRoleService,
    private alertService: AlertService,
    private fb: FormBuilder,
    private matDialog: MatDialog
    ) { }

  ngOnInit() {
    this.fetchRoleDetails();

    this.subscription.add(
      this.appIdControl.valueChanges.subscribe((value) => {
        this.loader = true;
        this.fetchRoleDetails(value);
      })
    );

    this.subscription.add(
      this.dashboardNameControl.valueChanges.subscribe((value) => {if (value) this.newDashboardControl.setValue(null)})
    );

    this.subscription.add(
      this.newDashboardControl.valueChanges.subscribe((value) => {if (value) this.dashboardNameControl.setValue(null)})
    );
  }

  get roleIdControl(): FormControl {
    return this.form.get('roleId') as FormControl;
  }

  get roleNameControl(): FormControl {
    return this.form.get('roleName') as FormControl;
  }

  get dashboardNameControl(): FormControl {
    return this.form.get('dashboardName') as FormControl;
  }

  get newDashboardControl(): FormControl {
    return this.form.get('newDashboard') as FormControl;
  }

  fetchRoleDetails(appID: string = '1') {
    this.managerRoleService
      .getRole(appID)
      .pipe(first())
      .subscribe({
        next: (response: RoleEntity[]) => {
          if (response.length) {
            this.landingDashboardList = response.filter((item) => !!item.dashboard_name);
            if (this.landingDashboardList.length)
            this.landingDashboardList = this.landingDashboardList.filter((value, index, self) =>
              index === self.findIndex((item: any) => (item.dashboard_name === value.dashboard_name)));
          }
          this.dataSource = new MatTableDataSource(response);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.dataSource.filterPredicate = function(data, filter: string): boolean {
            return data.role_name?.toLowerCase()?.includes(filter) ||
            data.dashboard_name?.toLowerCase()?.includes(filter);
          };
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

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue
      ? filterValue.trim().toLowerCase()
      : filterValue;
  }

  openEditRolePopup(record: RoleEntity | null = null) {
    if (record) {
      this.roleIdControl.setValue(record.role_id);
      this.roleNameControl.setValue(record.role_name);
    }
    this.editRoleDialogRef = this.matDialog.open(this.editRole, {disableClose: true, panelClass: 'role-popup', autoFocus: false});
  }
  
  openEditDashboardPopup(record: RoleEntity | null = null) {
    if (record) {
      this.roleIdControl.setValue(record.role_id);
      this.roleNameControl.setValue(record.role_name);
      this.dashboardNameControl.setValue(record.dashboard_name);
      this.roleNameControl.disable();
    }
    this.editDashboardDialogRef = this.matDialog.open(this.editDashboard, {disableClose: true, panelClass: 'role-popup', autoFocus: false});
  }

  closeEditRolePopup() {
    this.form.reset();
    if (this.editRoleDialogRef) this.editRoleDialogRef.close();
  }

  closeEditDashboardPopup() {
    this.form.reset();
    this.roleNameControl.enable();
    if (this.editDashboardDialogRef) this.editDashboardDialogRef.close();
  }

  saveDetails() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.alertService.swalPopWarning('Invalid fields found! Please check.');
      return;
    }

    const dataToSend: EditRoleEntity = {
      roleId: this.roleIdControl.value || 0,
      roleName: this.roleNameControl.value ? this.roleNameControl.value.trim() : null
    };

    if (this.roleNameControl.enabled && this.dataSource.data.some((item) => 
      item.role_name?.toLowerCase()?.trim() === dataToSend.roleName?.toLowerCase()?.trim())) {
        this.alertService.swalPopWarning('Role Name already exists!');
        return;
    }

    this.loader = true;

    this.managerRoleService.saveRole(dataToSend).pipe(first()).subscribe({
      next: (response: boolean) => {
        this.loader = false;
        if (response) {
          this.closeEditRolePopup();
          this.alertService.swalPopSuccessTimer(`Role ${dataToSend.roleId ? 'Updated' : 'Inserted'} Successfully!`);
          this.fetchRoleDetails(this.appIdControl.value);
        } else {
          this.alertService.swalPopError('Something went wrong! Please try again.');
        }
      },
      error: () => {
        this.loader = false;
        this.alertService.swalPopError('Something went wrong! Please try again.');
      }
    })
  }

  saveDashboard() {
    if (!this.dashboardNameControl.value && !this.newDashboardControl.value) {
      this.alertService.swalPopWarning('Please select dashboard name!');
      return;
    }

    this.loader = true;

    const dataToSend: EditDashboardEntity = {
      appId: this.appIdControl.value,
      roleId: this.roleIdControl.value || 0,
      dashboardName: this.dashboardNameControl.value || this.newDashboardControl.value
    };

    this.managerRoleService.saveDashboard(dataToSend).pipe(first()).subscribe({
      next: (response: boolean) => {
        this.loader = false;
        if (response) {
          this.closeEditDashboardPopup();
          this.alertService.swalPopSuccessTimer('Dashboard Updated Successfully!');
          this.fetchRoleDetails(this.appIdControl.value);
        } else {
          this.alertService.swalPopError('Something went wrong! Please try again.');
        }
      },
      error: () => {
        this.loader = false;
        this.alertService.swalPopError('Something went wrong! Please try again.');
      }
    })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
