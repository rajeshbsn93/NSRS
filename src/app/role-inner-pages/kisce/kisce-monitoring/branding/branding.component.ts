
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { Moment } from 'moment';
import { Subject, takeUntil } from 'rxjs';
import { Months, RoleCode } from 'src/app/_common/_enums/role-code';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { IUserDetails, StorageService } from 'src/app/_common/services/common-services/storage.service';
import { EquipmentProcurementService, IGetBrandingList } from 'src/app/_common/services/role-inner-pages-services/kic-services/monitoring-evaluation/equipmentProcurement.service';
import { BrandingModalComponent } from 'src/app/standalone_components/modal-window/kisceMonitoringModalWindows/branding-modal/branding-modal.component';
import { environment } from 'src/environments/environment';
import { ITabbingLink } from '../kisce-monitoring.component';
import { KicMonitoringModalViewComponent } from 'src/app/role-inner-pages/kic/kic-monitoring-modal-view/kic-monitoring-modal-view.component';
import { KisceMonitoringModalViewComponent } from '../../kisce-monitoring-modal-view/kisce-monitoring-modal-view.component';

@Component({
  selector: 'app-branding',
  templateUrl: './branding.component.html',
  styleUrls: ['./branding.component.css']
})
export class BrandingComponent implements OnInit {

  displayedColumns: string[] = ['year', 'brandingAtKIC', 'uploadImage', 'brandingRemarks', 'action'];
  displayedStateColumns: string[] = ['sno', 'kiC_KUID', 'kiC_NAME', 'brandingAtKIC', 'uploadImage', 'brandingRemarks'];
  displayedRcColumns: string[] = ['sno', 'stateName', 'kiC_KUID', 'kiC_NAME', 'brandingAtKIC', 'uploadImage', 'brandingRemarks'];
  displayedRCStateColumns: string[] = ['sno', 'stateName', 'noOfKIC', 'kicWhereBrandingCompleted', 'kicWhereBrandingNotCompleted']
  displayedColumnsForRCList: string[] = ['sno', 'rdName', 'totalKic', 'stateName']

  dataSource: any
  dataSourceForState: any
  dataSourceForRC: any

  brandingList: Array<IGetBrandingList> = [];
  date = new FormControl(moment());
  mainLoader: Boolean = false
  userDetails!: IUserDetails
  fileUrl: string = environment.fileUrl

  brandingForm!: FormGroup

  editable: Boolean = false
  rdListshow: boolean = false

  KicUsersRoleId: any = RoleCode
  fileurl: any = environment.fileUrl
  min_date = new Date(2017, 1, 1)
  max_date = new Date()
  monthsDetails: any = Months
  searchFilter!: FormGroup;
  @Input() uniqueKUID: any
  @Input() tabbingLinkData!: ITabbingLink

  @Output() dataOfTabClicked: EventEmitter<any> = new EventEmitter<any>();

  selected_branding_list: any;
  stateName: any = ''

  @ViewChild('statePaginator', { read: MatPaginator }) statePaginator!: MatPaginator
  @ViewChild('kicWISEPaginator', { read: MatPaginator }) kicWISEPaginator!: MatPaginator
  @ViewChild('rdListPaginator', { read: MatPaginator }) rdListPaginator!: MatPaginator

  unsubscribe: Subject<any> = new Subject();

  constructor(private _fb: FormBuilder, public _modalService: NgbModal,
    private _storageService: StorageService, private _alertService: AlertService, private _equipmentService: EquipmentProcurementService, private fb: FormBuilder) { }

  ngOnInit() {
    console.log('brandingn-------------', this.tabbingLinkData);
    console.log('this.rdListshow', this.rdListshow);

    this.userDetails = this._storageService.getUserDetails()
    this.searchFilter = this.fb.group({
      month: [''],
      year: [''],
      status: [''],

    });
    this.createBrandingForm();
    console.log(this.rdListshow);

    if (this.userDetails.role_id == this.KicUsersRoleId.hoAdmin) {
      this.getBrandingList()
      if (this.tabbingLinkData != undefined) {
        if (this.tabbingLinkData.stateId != undefined || this.tabbingLinkData.stateName != undefined) {
          this.rdChange(this.tabbingLinkData.data, true)
        } else {
          this.rdChange(this.tabbingLinkData.data, false)
        }
      }
    } else if (this.userDetails.role_id == this.KicUsersRoleId.rcAdmin) {
      if (this.tabbingLinkData?.stateName != undefined) {
        this.getBrandingList(1)
      } else {
        this.getBrandingList()
      }
    } else {
      this.getBrandingList()
    }
  }

  createBrandingForm() {
    this.brandingForm = this._fb.group({
      branding_kic: ['', Validators.required],
      upload_image: ['', Validators.required],
      remarks: ['', Validators.compose([Validators.required, Validators.maxLength(200)])],
      // status: [1,Validators.required],
      // year_of_operation: ['2023',Validators.required],
      user_id: [this.userDetails.user_id, Validators.required],
      role_id: [this.userDetails.role_id, Validators.required],
      bid: [0, Validators.required]
    })
  }

  stateWiseList: any;
  kicWiseList: any;

  getBrandingList(check?: any) {
    this.mainLoader = true
    this._equipmentService.getBranding(this.userDetails.user_id, this.userDetails.role_id, 80).pipe(takeUntil(this.unsubscribe)).subscribe({
      next: (res: any) => {
        this.mainLoader = false
        if (res.status) {

          //for state and kic roles
          if (this.userDetails.role_id == this.KicUsersRoleId.kisceAdmin || this.userDetails.role_id == this.KicUsersRoleId.stateAdmin) {
            this.rdListshow = true;
            this.brandingList = res.data
            this.dataSource = new MatTableDataSource(this.brandingList)

            setTimeout(() => this.dataSource.paginator = this.kicWISEPaginator);
          }
          //for rc role

          if (this.userDetails.role_id == this.KicUsersRoleId.rcAdmin) {
            this.rdListshow = true;
            if (check == 1) {
              this.stateName = this.tabbingLinkData.stateName
            } else {
              this.stateName = res.statewisedata[0].state
            }
            this.brandingList = res.kicWiseData;
            var stateData = res.kicWiseData.filter((data: any) => {
              if (data.state_name.toLowerCase().trim() == this.stateName.toLowerCase().trim()) {
                return data
              }
            })
            this.dataSource = new MatTableDataSource(stateData)
            setTimeout(() => this.dataSource.paginator = this.kicWISEPaginator);
            this.dataSourceForState = new MatTableDataSource(res.statewisedata)
            setTimeout(() => this.dataSourceForState.paginator = this.statePaginator);
          }

          if (this.userDetails.role_id == this.KicUsersRoleId.hoAdmin) {
            if (this.tabbingLinkData == undefined || check == 1) {
              this.rdListshow = false;
              this.stateWiseList = res.statewisedata
              this.kicWiseList = res.kicWiseData
              this.dataSourceForRC = new MatTableDataSource(res.rcData)
              setTimeout(() => this.dataSourceForRC.paginator = this.rdListPaginator);
              // this.brandingList = res.kicWiseData;
              // // this.dataSource=new MatTableDataSource(res.kicWiseData)
              // // this.dataSource.paginator = this.kicWISEPaginator;
              // this.dataSourceForState=new MatTableDataSource(res.statewisedata)
              // this.dataSourceForState.paginator=this.statePaginator
              // this.getKicByStateId(res.statewisedata[0].state_id,res.statewisedata[0].state)
            }
          }
          // this.dataSource.sort = this.sort;
        } else {
          this.brandingList = res.data
          this.dataSource = new MatTableDataSource(res.data)
          if (this.userDetails.role_id == this.KicUsersRoleId.kisceAdmin || this.userDetails.role_id == this.KicUsersRoleId.stateAdmin) {
            this.rdListshow = true;
            this.brandingList = res.data
            this.dataSource = new MatTableDataSource(this.brandingList)

            setTimeout(() => this.dataSource.paginator = this.kicWISEPaginator);
          }
          if (this.userDetails.role_id == this.KicUsersRoleId.rcAdmin) {
            this.rdListshow = true;
            // this.stateName=res?.statewisedata[0]?.state
            // this.brandingList  = res.kicWiseData;
            // var stateData=res.kicWiseData.filter((data:any)=>{
            //   if(data.state_name.toLowerCase().trim()==this.stateName.toLowerCase().trim()){
            //     return data
            //   }
            // })
            this.dataSource = new MatTableDataSource([])


            setTimeout(() => this.dataSource.paginator = this.kicWISEPaginator);
            this.dataSourceForState = new MatTableDataSource([])

            setTimeout(() => this.dataSourceForState.paginator = this.statePaginator);
          }
          if (this.userDetails.role_id == this.KicUsersRoleId.hoAdmin) {
            this.rdListshow = false;
            this.stateWiseList = res?.statewisedata
            this.kicWiseList = res?.kicWiseData
            this.dataSourceForRC = new MatTableDataSource([])
            setTimeout(() => this.dataSourceForRC.paginator = this.rdListPaginator);
          }
          // this.dataSource.paginator = this.paginator;
          // this.dataSource.sort = this.sort;
        }
      },
      error: (error) => {
        if (error?.error?.code == 200) {
          // this._alertService.swalPopError(`Data Not Found.`)
          this.brandingList = error?.error?.data
          this.dataSource = new MatTableDataSource(error?.error?.data)
        }
        this.mainLoader = false
      }
    })
  }

  rdChange(elementData: any, isStateChange?: any) {
    this.dataOfTabClicked.emit({
      data: elementData,
      check: 'rc',
      stateId: this.tabbingLinkData?.stateId,
      stateName: this.tabbingLinkData?.stateName
    })
    this.mainLoader = true
    this._equipmentService.getBranding(elementData.user_id, elementData.role_id, 80).subscribe({
      next: (res: any) => {
        this.mainLoader = false
        this.rdListshow = true
        this.stateName = res.statewisedata[0].state
        this.brandingList = res.kicWiseData;
        var stateData = res.kicWiseData.filter((data: any) => {
          if (data.state_name.toLowerCase().trim() == this.stateName.toLowerCase().trim()) {
            return data
          }
        })
        this.dataSource = new MatTableDataSource(stateData)
        setTimeout(() => this.dataSource.paginator = this.kicWISEPaginator);
        // this.dataSource.paginator = this.kicWISEPaginator;
        this.dataSourceForState = new MatTableDataSource(res.statewisedata)
        setTimeout(() => this.dataSourceForState.paginator = this.statePaginator);
        // this.dataSourceForState.paginator=this.statePaginator
        if (isStateChange) {
          this.getKicByStateId(this.tabbingLinkData.stateName, this.tabbingLinkData.stateName)
        }
      },
      error: () => {
        this.mainLoader = false
        this.rdListshow = true
      }
    })
  }

  backToRD() {
    this.rdListshow = false
    this.getBrandingList(1);
    this.tabbingLinkData == undefined
    this.dataOfTabClicked.emit(undefined)
  }

  editAddBranding(action: string, data?: any) {
    const modelRef = this._modalService.open(BrandingModalComponent, { size: 'xl', centered: true, backdrop: 'static' })
    modelRef.componentInstance.brandingModalData = { action: action, data: data, kiuid: this.uniqueKUID };

    modelRef.result.then((res: any) => {
      if (res.saved) {
        this.getBrandingList()
        this.clearFilter();
      }
    })
      .catch(() => { });



    // this.editable=true
    // if(this.userDetails.role_id!=82){
    //   // for state and other roles
    //   this.brandingForm.patchValue({
    //     branding_kic:checkAddEdit=='edit'? data?.bandinG_DONE_AT_KIC:'',
    //     upload_image:checkAddEdit=='edit'? data?.uploaD_IMAGES:'',
    //     remarks:checkAddEdit=='edit' ? data?.remarkS_IF_ANY: '',
    //     bid:checkAddEdit=='edit' ? data?.bid: 0
    //   });
    // }else{
    //   // for KIC
    //   this.brandingForm.patchValue({
    //     branding_kic:checkAddEdit=='edit'? data?.branding_done:'',
    //     upload_image:checkAddEdit=='edit'? data?.upload_image:'',
    //     remarks:checkAddEdit=='edit' ? data?.remarks: '',
    //     bid:checkAddEdit=='edit' ? data?.id: 0
    //   });

    // }
    // if(checkAddEdit=='add'){
    //   this.brandingList=[
    //     {id:0,academy_id:0, role_id:this.userDetails.role_id,branding_done: 0, upload_image: '', remarks: ''}
    //   ]
    //   this.dataSource=new MatTableDataSource(this.brandingList)
    // }
  }

  saveBranding(data: IGetBrandingList) {
    if (this.brandingForm.valid) {
      this._equipmentService.saveBranding(this.brandingForm.value).pipe(takeUntil(this.unsubscribe)).subscribe({
        next: (res: any) => {
          if (res.status) {
            this._alertService.swalPopSuccess(`${res.message}`)
            this.getBrandingList();
            this.editable = false;
          } else {
            this._alertService.swalPopError(`${res.message}`)
          }
        },
        error: () => {
        }
      })
    } else {
      this.brandingForm.markAllAsTouched()
    }
  }

  uploadBrandingFile(files: any) {
    if (!files.length) return
    if (['jpg', 'jpeg', 'png', 'pdf'].includes(this.verifyDocumentFileExtension(files[0]))) {
      if (files[0].size < 5242880) {
        const formData = new FormData();
        formData.append("file", files[0], files[0].name);
        formData.append("path", `documents/Others`);
        formData.append("uploadType", "3");
        this.mainLoader = true
        this._equipmentService.uploadFile(formData).pipe(takeUntil(this.unsubscribe)).subscribe({
          next: (response: any) => {
            this.mainLoader = false
            if (response.isUploaded) {
              this._alertService.swalPopSuccess('File Uploaded');
              // imageUploadUrl = response.filedataList[0].filePath;
              this.brandingForm.get('upload_image')?.setValue(response.filedataList[0].filePath)
              // this.profilePicUrl=environment.fileUrl+imageUploadUrl;
            } else {
              // this.profilePicUrl=''
              this._alertService.swalPopError('Upload Failed! Please Try Again.');
            }
          },
          error: () => {
            this.mainLoader = false
          }
        })
      } else {
        this._alertService.swalPopError('File Size must be less than 5mb.')
      }
    } else {
      this._alertService.swalPopError('File Format Not Supported.')
    }
  }

  verifyDocumentFileExtension(file: any) {
    var fileIndex = file.name.lastIndexOf(".") + 1;
    var fileExtension = file.name.substr(fileIndex, file.name.length).toLowerCase();
    return fileExtension;
  }

  ngOnDestroy() {
    this.unsubscribe.complete()
  }

  getKicByStateId(state_name: string, stateName: string) {
    this.dataOfTabClicked.emit({
      data: this.tabbingLinkData?.data,
      check: this.tabbingLinkData?.check,
      stateId: this.tabbingLinkData?.stateId,
      stateName: stateName
    })
    this.stateName = stateName
    this.dataSource = new MatTableDataSource<any>(this.getKicWiseDataByStateId(stateName));
    this.dataSource.paginator = this.kicWISEPaginator;
  }


  getKicWiseDataByStateId(state_name: string) {

    return this.brandingList.filter((res: any) => {
      if (state_name == res.state_name) {
        return res;
      }
    })
  }

  search() {

    this.selected_branding_list = this.brandingList
    if (this.searchFilter.value.month != '' && this.searchFilter.value.month != null) {
      this.selected_branding_list = this.selected_branding_list.filter((data: any) => {
        if (data.month == this.searchFilter.value.month) {
          return data;
        }
      });
    }
    if (this.searchFilter.value.year != '' && this.searchFilter.value.year != null) {
      let changed_year = new Date(this.searchFilter.value.year).getFullYear().toString()

      this.selected_branding_list = this.selected_branding_list.filter((data: any) => {
        if (data.year == changed_year) {
          return data;
        }
      });
    }
    if (this.searchFilter.value.status != '' && this.searchFilter.value.status != null) {
      this.selected_branding_list = this.selected_branding_list.filter((data: any) => {
        if (data.branding_done == this.searchFilter.value.status) {
          return data;
        }
      });
    }


    this.dataSource = new MatTableDataSource(this.selected_branding_list)

    setTimeout(() => this.dataSource.paginator = this.kicWISEPaginator);
  }


  handleYearSelected(normalizedYear: Moment, dp: any) {
    const ctrlValue = this.date.value;
    ctrlValue!.year(normalizedYear.year());
    this.searchFilter.controls['year'].setValue(ctrlValue);
    this.search();
    dp.close();

  }
  clearFilter(check?: boolean) {
    this.searchFilter.reset();
    if (check) {
      this.dataSource = new MatTableDataSource(this.brandingList)

      setTimeout(() => this.dataSource.paginator = this.kicWISEPaginator);
    }
  }

  openKisceDetailsModal(elementData: any) {
    const modelRefForEquipmentModal = this._modalService.open(KisceMonitoringModalViewComponent, { size: 'xl', centered: true, backdrop: 'static' })
    //  const data =  {sno:'1',type:'Sports Kit',status:'Completed',date_procurement:'17-10-2023',reason_for_delay:'Comp. Off',uploadDocuments:'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',remark:'remarks'};
    modelRefForEquipmentModal.componentInstance.equipmentModalViewData = elementData;
    modelRefForEquipmentModal.componentInstance.equipmentModalToViewFor = 'branding';

    modelRefForEquipmentModal.result.then((res: any) => {

    })
      .catch(() => { });
  }


}
