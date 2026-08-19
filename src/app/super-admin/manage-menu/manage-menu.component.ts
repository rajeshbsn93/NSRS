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
import { AppEntity, ManageMenuService, MenuEntity } from 'src/app/_common/services/superuser-services/manage-menu.service';
import { LoaderComponent } from 'src/app/standalone_components/loader/loader.component';

@Component({
  standalone: true,
  selector: 'app-manage-menu',
  templateUrl: './manage-menu.component.html',
  styleUrls: ['./manage-menu.component.css'],
  imports: [
    CommonModule, MatFormFieldModule, MatInputModule, MatIconModule,
    MatTableModule, MatPaginatorModule, MatButtonModule, MatSortModule,
    LoaderComponent, FormsModule, ReactiveFormsModule, MatDialogModule,
    MatSelectModule, MatOptionModule
  ]
})

export class ManageMenuComponent implements OnInit, OnDestroy {
  @ViewChild(MatTable) table!: MatTable<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('manageMenu') manageMenu!: TemplateRef<any>;
  @ViewChild('searchField') searchField!: ElementRef<HTMLInputElement>;
  displayedColumns: string[] = ['action', 'menu_name', 'menu_component_name', 'menu_class'];
  dataSource!: MatTableDataSource<MenuEntity>;
  loader: boolean = false;
  popupRef!: MatDialogRef<any>;
  form: FormGroup = this.fb.group({
    id: null,
    menu_name: [null, Validators.required],
    menu_component_name: [null, Validators.required],
    menu_class: [null, Validators.required],
    app_id: null
  });
  appIdControl: FormControl = new FormControl(1);
  appIdList$: Observable<AppEntity[]> = this.manageMenuService.getAppIdList().pipe(shareReplay(1));
  subscription: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private manageMenuService: ManageMenuService, 
    private alertService: AlertService,
    private matDialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.subscription.add(
      this.appIdControl.valueChanges.subscribe((value) => {
        this.loader = true;
        this.fetchMenu(value.toString());
      })
    );

    this.subscription.add(
      this.form.get('menu_component_name')?.valueChanges.subscribe((value) => {
        if (value) this.form.get('menu_class')?.setValue(`icon-${value}`);
        else this.form.get('menu_class')?.setValue(null);
      })
    );
    
    this.appIdControl.updateValueAndValidity();
    
  }

  fetchMenu(appID: string) {
    this.loader = true;
    this.manageMenuService.getMenuDetails(appID)
      .pipe(first())
      .subscribe({
        next: (response: MenuEntity[]) => {
        if (!response?.length)
          this.alertService.swalPopError('No record found!');
        this.dataSource = new MatTableDataSource(response?.length ? response : []);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource.filterPredicate = function(data: MenuEntity, filter: string): boolean {
          return data.menu_name?.toLowerCase().includes(filter) ||
            data.menu_component_name?.toLowerCase().includes(filter) ||
            data.menu_class?.toLowerCase().includes(filter);
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

  openPopup(record: MenuEntity | null = null) {
    if (record) {
      this.form.patchValue(record, {emitEvent: false});
      this.form.get('menu_component_name')?.disable({emitEvent: false});
    } else {
      this.form.reset(); 
      this.form.get('menu_component_name')?.enable({emitEvent: false});
    }
    this.form.get('app_id')?.setValue(this.appIdControl.value);
    this.popupRef = this.matDialog.open(this.manageMenu, {disableClose: true, autoFocus: false, panelClass: 'menu-popup'});
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
    const dataToSend = this.form.getRawValue();
    if (!dataToSend.id) dataToSend.id = 0;
    this.manageMenuService.manageMenuDetails(dataToSend)
    .pipe(first())
    .subscribe({
      next: (response: boolean) => {
        if (response) {
          this.alertService.swalPopSuccess(`Menu Successfully ${this.form.get('id')?.value ? 'Updated' : 'Inserted'}!`);
          this.fetchMenu(this.appIdControl.value?.toString());
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
