import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { StorageService } from 'src/app/_common/services/common-services/storage.service';
import {GetUserRoleDetailEntity, GetUserSportsDetailEntity, RoleTransferService } from 'src/app/_common/services/superuser-services/role-transfer.service';
import { LoaderComponent } from 'src/app/standalone_components/loader/loader.component';

@Component({
  selector: 'app-role-transfer',
  templateUrl: './role-transfer.component.html',
  styleUrls: ['./role-transfer.component.css'],
  standalone:true,
  imports:[
    CommonModule, MatFormFieldModule, MatInputModule, MatTableModule, MatPaginatorModule, 
    MatSortModule, MatButtonModule, MatIconModule, ReactiveFormsModule, MatDialogModule, 
    MatSelectModule, MatOptionModule, LoaderComponent
  ]
})
export class RoleTransferComponent implements OnInit {
  @ViewChild('addRoleDialog') addRoleDialog!:TemplateRef<any>
  matDialogRef!:MatDialogRef<any>
  tableColumn:string[] = ['sln', 'roleName', 'fullName']
  // dataSource!:MatTableDataSource<any>
  dataSource!:MatTableDataSource<GetUserRoleDetailEntity>
  selectRoleControl:FormControl = new FormControl('',[Validators.required]);
  userNameNSRSIDControl:FormControl = new FormControl('',[Validators.required])
  dialogRoleControl = new FormControl('', [Validators.required])
  dialogSportCatControl = new FormControl('', [Validators.required])
  loader:boolean = false;
  roleMasterList:Array<any> = [];
  filterRoleIdsList:Array<any>=[];
  dialogSportCatList:GetUserSportsDetailEntity[] = []
  tableDataSource:GetUserRoleDetailEntity[] = []
  userDetails:any
  constructor(
    private _matDialog:MatDialog,
    private _roleTransferService:RoleTransferService,
    private _storageService:StorageService,
    private _alertService:AlertService
  ) { }

  ngOnInit() {
    this.userDetails = this._storageService.getUserDetails()
    this.getRoleMaster()
  }
  getRoleMaster(){
    this.loader = true;
    this._roleTransferService.getRolesMaster(1).subscribe({
      next:(res)=>{
        this.loader = false;
        this.roleMasterList = res;
      },
      error:(err)=>{
        this.loader = false;
        console.error(err);
      }
    })
  }

  submitSearch(){
   this.loader = true;
    this._roleTransferService.getuserRoleDetail(this.selectRoleControl.value,this.userNameNSRSIDControl.value).subscribe({
      next:(res:GetUserRoleDetailEntity[])=>{
        this.loader = false;
        this.tableDataSource = res;
        this.dataSource = new MatTableDataSource<GetUserRoleDetailEntity>(this.tableDataSource);
        const roleIdsInArr2  = this.tableDataSource.map((item)=>item.role_id);
        this.filterRoleIdsList = this.roleMasterList.filter((item)=>!roleIdsInArr2.includes(item.role_id));
        if(this.tableDataSource.length){
          this.selectRoleControl.disable();
          this.userNameNSRSIDControl.disable();
        }
      },
      error:(err)=>{
        this.loader = false;
        console.error(err);
      }
    })
  }
  reset(){
    this.selectRoleControl.setValue('');
    this.userNameNSRSIDControl.setValue('');
    this.selectRoleControl.enable();
    this.userNameNSRSIDControl.enable();
    this.selectRoleControl.updateValueAndValidity();
    this.userNameNSRSIDControl.updateValueAndValidity();
    this.tableDataSource = [];
    this.dataSource = new MatTableDataSource<GetUserRoleDetailEntity>([]);
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  openDialog(){
    this.matDialogRef = this._matDialog.open(
      this.addRoleDialog,
      {
        autoFocus:false,
      }
    )
    this.matDialogRef.afterClosed().subscribe((res)=>{
      this.dialogRoleControl.reset('');
      this.dialogSportCatControl.reset('');
      if(res!==undefined) this.submitSearch()
    })
  }
  closeDialog(){
    if(this.matDialogRef) this.matDialogRef.close()
  }

  changeDialogRole(value:any){
    this.getUserSportsDetail(value);
    this.dialogSportCatControl.reset('');
  }
  getUserSportsDetail(toRoleId:number){
    this.loader = true
    this._roleTransferService.getUserSportsDetail(this.selectRoleControl.value, this.dataSource.data[0].master_id,toRoleId).subscribe({
      next:(res:GetUserSportsDetailEntity[])=>{
        this.loader = false;
        this.dialogSportCatList = res;
      },
      error:(err)=>{
        this.loader = false;
        console.error(err);
      }
    })
  }
  submitFormDialog(){
    const payload = {
                      masterId: this.dataSource.data[0].master_id,
                      fromRoleId: this.selectRoleControl.value,
                      toRole: this.dialogRoleControl.value,
                      userId: this.userDetails.user_id,
                      sportId: this.dialogSportCatControl.value
                    }
    this.loader = true;
    this._roleTransferService.saveRoleTransferDetail(payload).subscribe({
      next:(res)=>{
        this.loader = false;
        if(res){
          this._alertService.swalPopSuccessTimer('Role Added Successfully!');
          this.matDialogRef.close(res);
        }
      },
      error:(err)=>{
        this.loader = false;
        console.error(err);
      }
    })
  }

}
