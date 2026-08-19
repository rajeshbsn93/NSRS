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
import { Observable, first, tap } from 'rxjs';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { AppEntity, ManageMenuRoleMappingService, MenuListEntity, MenuRoleMappingEntity, RoleEntity } from 'src/app/_common/services/superuser-services/manage-menu-role-mapping.service';
import { LoaderComponent } from 'src/app/standalone_components/loader/loader.component';

@Component({
  standalone: true,
  selector: 'app-manage-menu-role-mapping',
  templateUrl: './manage-menu-role-mapping.component.html',
  styleUrls: ['./manage-menu-role-mapping.component.css'],
  imports: [
    CommonModule, MatFormFieldModule, MatInputModule, MatIconModule,
    MatTableModule, MatPaginatorModule, MatButtonModule, MatSortModule,
    LoaderComponent, FormsModule, ReactiveFormsModule, MatDialogModule,
    MatSelectModule, MatOptionModule
  ]
})

export class ManageMenuRoleMappingComponent implements OnInit {
  @ViewChild(MatTable) table!: MatTable<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('manageMenu') manageMenu!: TemplateRef<any>;
  @ViewChild('searchField') searchField!: ElementRef<HTMLInputElement>;
  displayedColumns: string[] = ['action', 'menu_name', 'menu_order'];
  dataSource!: MatTableDataSource<MenuRoleMappingEntity>;
  loader: boolean = false;
  popupRef!: MatDialogRef<any>;
  form: FormGroup = this.fb.group({
    id: null,
    role_id: null,
    menu_id: [null, Validators.required],
    menu_order: [null, Validators.required],
    appId: null
  });
  roleIdControl: FormControl = new FormControl();
  appIdControl: FormControl = new FormControl();
  roleIdList$: Observable<RoleEntity[]> = this.manageMenuRoleMappingService.getRolesList();
  appIdList$: Observable<AppEntity[]> = this.manageMenuRoleMappingService.getAppIdList();
  menuList!: MenuListEntity[];
  showAssignMenuBtn: boolean = false;

  constructor(
    private fb: FormBuilder,
    private manageMenuRoleMappingService: ManageMenuRoleMappingService, 
    private alertService: AlertService,
    private matDialog: MatDialog
  ) { }

  ngOnInit(): void {

  }

  fetchMenu() {
    this.loader = true;
    this.showAssignMenuBtn = true;
    this.manageMenuRoleMappingService.getMenuRoleMappingDetails(this.roleIdControl.value, this.appIdControl.value)
      .pipe(
        first(),
        tap(() => {
          this.manageMenuRoleMappingService.getMenuList(this.appIdControl.value)
          .pipe(first())
          .subscribe({
            next: (response: MenuListEntity[]) => {
              if (response.length) this.menuList = response;
              else this.menuList = [];
            },
            error: () => this.menuList = []
          });
        })
      )
      .subscribe({
        next: (response: MenuRoleMappingEntity[]) => {
        if (!response?.length) {
          this.alertService.swalPopError('No record found!');
          this.menuList = [];
        }
        this.dataSource = new MatTableDataSource(response?.length ? response : []);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource.filterPredicate = function(data: MenuRoleMappingEntity, filter: string): boolean {
          return data.menu_name?.toLowerCase().includes(filter) ||
            data.menu_order?.toString() === filter;
        }
        if (this.searchField.nativeElement.value) {
          this.dataSource.filter = this.searchField.nativeElement.value; 
        }
        this.loader = false;
        },
        error: () => {
          this.loader = false;
          this.menuList = [];
          this.alertService.swalPopError('Something went wrong!');
        }
      });
  }

  applyFilter(filterValue: string) {
    if (this.dataSource)
      this.dataSource.filter = filterValue
      ? filterValue.trim().toLowerCase()
      : filterValue;
  }

  clearTable() {
    this.dataSource = new MatTableDataSource();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.filterPredicate = function(data: MenuRoleMappingEntity, filter: string): boolean {
      return data.menu_name?.toLowerCase().includes(filter) ||
        data.menu_order?.toString() === filter;
    }
    this.showAssignMenuBtn = false;
  }

  openPopup(record: MenuRoleMappingEntity | null = null) {
    if (record) {
      this.form.patchValue(record);
      this.form.get('menu_id')?.disable();
    } else {
      this.form.reset();
      this.form.get('menu_id')?.enable();
    }
    this.form.get('appId')?.setValue(this.appIdControl.value);
    this.form.get('role_id')?.setValue(this.roleIdControl.value);
    this.popupRef = this.matDialog.open(this.manageMenu, {disableClose: true, autoFocus: false, panelClass: 'menu-role-mapping-popup'});
  }

  closePopup() {
    if (this.popupRef) this.popupRef.close();
    this.form.reset();
  }

  saveDetails() {
    if (this.form.invalid) {
      this.alertService.swalPopWarning('Invalid fields found! Please check.');
      this.form.markAllAsTouched();
      return;
    }
    if (
      !this.form.get('id')?.value && this.dataSource.data
      .some((item: MenuRoleMappingEntity) => item.menu_id === this.form.get('menu_id')?.value)
    ) {
      this.alertService.swalPopWarning('Menu already exists!');
      return;  
    }
    const dataToSend = this.form.getRawValue();
    if (!dataToSend.id) dataToSend.id = 0;
    this.manageMenuRoleMappingService.manageMenuRoleMappingDetails(dataToSend)
    .pipe(first())
    .subscribe({
      next: (response: boolean) => {
        if (response) {
          this.alertService.swalPopSuccess(`Menu Successfully ${this.form.get('id')?.value ? 'Updated' : 'Inserted'}!`);
          this.fetchMenu();
          this.closePopup();
        }  
      },
      error: () => {
        this.alertService.swalPopError('Something went wrong! Please try again.');
      }
    });
  }
}
