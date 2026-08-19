import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { first } from 'rxjs';
import { LoaderComponent } from 'src/app/standalone_components/loader/loader.component';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { AppEntity, ManageProjectService } from 'src/app/_common/services/superuser-services/manage-project.service';

@Component({
  standalone: true,
  selector: 'app-manage-project',
  templateUrl: './manage-project.component.html',
  styleUrls: ['./manage-project.component.css'],
  imports: [
    CommonModule, MatFormFieldModule, MatInputModule, MatIconModule,
    MatTableModule, MatPaginatorModule, MatButtonModule, MatSortModule,
    LoaderComponent, FormsModule, ReactiveFormsModule, MatDialogModule
  ]
})
export class ManageProjectComponent implements OnInit {
  @ViewChild(MatTable) table!: MatTable<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('editProject') editProject!: TemplateRef<any>;
  @ViewChild('searchField') searchField!: ElementRef<HTMLInputElement>;
  displayedColumns: string[] = ['action', 'appId', 'projectName', 'encAppId', 'created_date'];
  dataSource!: MatTableDataSource<AppEntity>;
  loader: boolean = true;
  projectPopupDialogRef!: MatDialogRef<any>;
  form: FormGroup = this.fb.group({appId: null, name: [null, Validators.required]});

  constructor(private manageProjectService: ManageProjectService, private alertService: AlertService, private matDialog: MatDialog, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.fetchProjectsData();
  }

  fetchProjectsData() {
    this.manageProjectService.getProjects().pipe(first()).subscribe({
      next: (response: AppEntity[]) => {
        if (response?.length) {
          this.dataSource = new MatTableDataSource(response);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.dataSource.filterPredicate = function(data: AppEntity, filter: string): boolean {
            return data.appId?.toString().includes(filter) ||
              data.projectName?.toLowerCase().includes(filter) ||
              data.created_date.includes(filter)
          }
          if (this.searchField.nativeElement.value) {
            this.dataSource.filter = this.searchField.nativeElement.value; 
          }
        } else {
          this.alertService.swalPopError('No records found!');
        }
        this.loader = false;
      },
      error: () => {
        this.alertService.swalPopError('Something went wrong!');
        this.loader = false;
      }
    })
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue
      ? filterValue.trim().toLowerCase()
      : filterValue;
  }

  openProject(record: AppEntity | null = null) {
    if (record) {
      this.form.get('appId')?.setValue(record.appId);
      this.form.get('name')?.setValue(record.projectName);
    }
    this.projectPopupDialogRef = this.matDialog.open(
      this.editProject,
      { panelClass: 'project-popup', disableClose: true, autoFocus: false }
    );
  }

  save() {
    console.log(this.form.value);
    this.manageProjectService.saveProject({...this.form.value, appId: this.form.value?.appId || 0})
    .pipe(first())
    .subscribe((response: boolean) => {
      if (response) {
        this.alertService.swalPopSuccess(`Project ${ this.form.get('appId')?.value ? 'updated' : 'inserted' } successfully!`);
        this.closeProject();
        this.loader = true;
        this.fetchProjectsData();
      }
    })
  }

  closeProject() {
    this.form.reset();
    if (this.projectPopupDialogRef) this.projectPopupDialogRef.close();
  }
}
