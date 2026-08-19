import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Observable, Subscription, first, shareReplay } from 'rxjs';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { 
  ManageProjectRoleMappingService, 
  ProjectRoleMappingEntity, 
  AppEntity, 
  RoleEntity 
} from 'src/app/_common/services/superuser-services/manage-project-role-mapping.service';
import { LoaderComponent } from 'src/app/standalone_components/loader/loader.component';

@Component({
  standalone: true,
  selector: 'app-manage-project-role-mapping',
  templateUrl: './manage-project-role-mapping.component.html',
  styleUrls: ['./manage-project-role-mapping.component.css'],
  imports: [
    CommonModule, MatFormFieldModule, MatInputModule, MatIconModule,
    MatTableModule, MatPaginatorModule, MatButtonModule, MatSortModule,
    LoaderComponent, FormsModule, ReactiveFormsModule, MatDialogModule,
    MatSelectModule, MatOptionModule
  ]
})

export class ManageProjectRoleMappingComponent implements OnInit, OnDestroy {
  @ViewChild(MatTable) table!: MatTable<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('mapProjectRolePopup') mapProjectRolePopup!: TemplateRef<any>;
  @ViewChild('searchField') searchField!: ElementRef<HTMLInputElement>;
  displayedColumns: string[] = ['role_name'];
  dataSource!: MatTableDataSource<ProjectRoleMappingEntity>;
  loader: boolean = false;
  popupRef!: MatDialogRef<any>;
  form: FormGroup = this.fb.group({appName: [{value: null, disabled: true}], roleName: [[], Validators.required]});
  appIdControl: FormControl = new FormControl(1);
  appIdList$: Observable<AppEntity[]> = this.manageProjectRoleMappingService.getAppIdList().pipe(shareReplay(1));
  subscription: Subscription = new Subscription();
  roleList!: RoleEntity[];

  constructor(
    private fb: FormBuilder,
    private manageProjectRoleMappingService: ManageProjectRoleMappingService, 
    private alertService: AlertService,
    private matDialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.subscription.add(
      this.appIdControl.valueChanges.subscribe((value) => {
        this.loader = true;
        this.fetchProjectRoleMappingData(value.toString());
      })
    );
    
    this.appIdControl.updateValueAndValidity();
    
  }

  fetchProjectRoleMappingData(appID: string) {
    this.loader = true;
    this.manageProjectRoleMappingService.getProjectRoleMapping(appID)
      .pipe(first())
      .subscribe({
        next: (response: ProjectRoleMappingEntity[]) => {
        if (!response?.length)
          this.alertService.swalPopError('No record found!');
        this.dataSource = new MatTableDataSource(response?.length ? response : []);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource.filterPredicate = function(data: ProjectRoleMappingEntity, filter: string): boolean {
          return data.role_name?.toLowerCase().includes(filter);
        }
        if (this.searchField.nativeElement.value) {
          this.dataSource.filter = this.searchField.nativeElement.value; 
        }
        this.loader = false;
        },
        error: () => {
          this.loader = false;
          this.alertService.swalPopError('Something went wrong!');
        }
      });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue
      ? filterValue.trim().toLowerCase()
      : filterValue;
  }

  openPopup() {
    this.form.get('appName')?.setValue(this.appIdControl.value);
    this.loader = true;
    this.manageProjectRoleMappingService.getRole(
      this.appIdControl.value?.toString())
      .pipe(first())
      .subscribe({
        next: (response: RoleEntity[]) => {
        if (response?.length) {
          const mappedRoles = this.dataSource.data.map((item) => item.roleId);
          this.roleList = response.filter((item: RoleEntity) => !mappedRoles.includes(item.role_id));
          this.popupRef = this.matDialog.open(
            this.mapProjectRolePopup, 
            {panelClass: 'map-project-role-popup', disableClose: true, autoFocus: false, position: {top: '10vh'}}
          );
        } else {
          this.alertService.swalPopError('No roles found!');
          this.roleList = [];
        }
        this.loader = false;
      },
        error: () => {
          this.roleList = [];
          this.loader = false;
          this.alertService.swalPopError('Something went wrong while fetching roles!');
        }
      }
    );
  }

  closePopup() {
    if (this.popupRef) this.popupRef.close();
    this.form.reset();
  }

  saveDetails() {
    if (this.form.invalid) {
      this.alertService.swalPopWarning('No role is selected!');
      return;
    }
    this.manageProjectRoleMappingService.createProjectRoleMapping(
      {appID: this.appIdControl.value, roleID: this.form.get('roleName')?.value?.toString()}
    )
    .pipe(first())
    .subscribe({
      next: (response: boolean) => {
        if (response) {
          this.alertService.swalPopSuccess('Project and Role Mapping Successfull!');
          this.fetchProjectRoleMappingData(this.appIdControl.value?.toString());
          this.closePopup();
        }  
      },
      error: () => {
        this.alertService.swalPopError('Something went wrong! Please try again.');
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
