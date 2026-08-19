import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MaterialModule } from 'src/app/_common/material.module';
import { MY_DATE_FORMATS } from 'src/app/_common/models/my_dateFormat';
import { LoaderComponent } from '../../loader/loader.component';
import { environment } from 'src/environments/environment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { SharableService } from 'src/app/_common/services/innerPagesServices/innerpagesSharable.service';
import { AddAttendanceService } from 'src/app/_common/services/role-inner-pages-services/academy-services/add-attendance.service';
import { StorageService } from 'src/app/_common/services/common-services/storage.service';

@Component({
  selector: 'app-kic-add-pca-attendance',
  templateUrl: './kic-add-pca-attendance.component.html',
  styleUrls: ['./kic-add-pca-attendance.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }

  ],
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule, LoaderComponent]
})
export class KicAddPcaAttendanceComponent implements OnInit {

  @Output() popupClose: EventEmitter<string> = new EventEmitter<string>();
  attendanceForm!: FormGroup;
  attendanceFile: any;
  selectedDate: Date | undefined;
  durationData: Array<any> = [];
  date: Date = new Date();
  genderCoundData: any
  mainLoader: Boolean = false;
  fileUploadRes: any
  filePathUrl: any
  userDetails: any
  fileBaseUrl: any = environment.fileUrl;
  constructor(public activeModal: NgbActiveModal, private _fb: FormBuilder, private datePipe: DatePipe,
    private addAttendanceService: AddAttendanceService, private alertService: AlertService, private sharedService: SharableService,
    private storageService: StorageService) {
    this.userDetails = this.storageService.getUserDetails()
    this.formInitialization();
  }

  get atendanceArray(): FormArray {
    return this.attendanceForm.get("items") as FormArray
  }


  ngOnInit(): void {
    this.getDurationData();
    // this.getGenderCountData();
  }

  getDurationData() {
    this.addAttendanceService.getDurationData().subscribe((res: any) => {
      this.mainLoader = true;
      if (res?.code === 200 && res?.data.length > 0) {
        this.durationData = res?.data;
        this.mainLoader = false;
      } else {
        this.alertService.swalPopWarning(res?.message)
      }
    }, (error) => {
      this.mainLoader = false;
      this.alertService.swalPopWarning('Something went wrong!!')
      this.modalClose('cancel');
    })
  }

  // getGenderCountData() {
  //   this.addAttendanceService.getGenderCountData(this.userDetails).subscribe((res: any) => {
  //     this.mainLoader = true;
  //     console.log(res)
  //     if (res?.code === 200 && res?.data.length > 0) {
  //       this.genderCoundData = res?.data[0];
  //       const control = this.attendanceForm.get('items') as FormArray;
  //       control.at(0).patchValue({
  //         maleCount: this.genderCoundData?.male_count.toString(),
  //         femaleCount: this.genderCoundData?.female_count.toString(),
  //         totalCount: this.genderCoundData?.total_count.toString()
  //       });
  //       this.mainLoader = false;
  //     } else {
  //       this.mainLoader = false;
  //       this.alertService.swalPopWarning(res?.message)
  //     }
  //   }, (error) => {
  //     this.mainLoader = false;
  //     this.alertService.swalPopWarning('Something went wrong!!')
  //     this.modalClose('cancel');
  //   })
  // }

  modalClose(closeType = 'cancel') {
    this.activeModal.close(closeType);
  }

  formInitialization() {
    this.attendanceForm = this._fb.group({
      items: this._fb.array([]),

    });
    this.addItemAttendance();
  }

  addItemAttendance(value: any = null): void {

    this.atendanceArray.push(this.createAttendanceItem());
  }

  createAttendanceItem(): FormGroup {
    return this._fb.group({
      academy_detail_id: [this.userDetails.user_id],
      duration: ['', Validators.required],
      kiud: ['', Validators.required],
      role_id: [this.userDetails.role_id],
      maleCount: ['0', Validators.required],
      femaleCount: ['0', Validators.required],
      totalCount: ['0', Validators.required],
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required],
      filePath: ['', Validators.required],
      fileName: [''],
      created_by: [this.userDetails.user_id],
      uploadDate: [this.date]
    });
  }




  agendaTrackBy(index: number, data: any) {
    return data?.attendanceIndex;
  }
  saveData() {
    this.mainLoader = true;
    if (!this.attendanceForm.invalid) {
      let formData = this.attendanceForm.getRawValue();
      formData.items.map((data: any) => {
        data.fromDate = this.datePipe.transform(data.fromDate, 'yyyy-MM-dd')
        data.toDate = this.datePipe.transform(data.toDate, 'yyyy-MM-dd')
        data.is_Pca = true
      })
      this.addAttendanceService.saveAttendance(formData.items).subscribe((res: any) => {
        if (res && res.code == 200) {
          this.mainLoader = false;
          this.alertService.swalPopSuccess(res.message)
          this.activeModal.close('save');
        } else {
          this.mainLoader = false;
          this.activeModal.close()
          this.alertService.swalPopWarning('Something went wrong!!')
        }
      }, (error) => {
        this.activeModal.close()
        this, this.mainLoader = false;
        this.alertService.swalPopWarning('Something went wrong!!')
      })
    }
  }
  removeAttendance(index: any) {
    const items = this.attendanceForm.get('items') as FormArray;
    items.removeAt(index);
  }


  verifyFileSize(files: any) {
    var fileSize = files[0].size
    return fileSize
  }

  verifyDocumentFileExtension(files: any) {
    var fileIndex = files[0].name.lastIndexOf(".") + 1;
    var extFile = files[0].name.substr(fileIndex, files[0].name.length).toLowerCase();
    return extFile
  }

  // +++++++++++++ File Upload Function +++++++++++++++
  public uploadDocuments = (files: any, index: any) => {
    if (files.length === 0) {
      return;
    } else {
      var extFile = this.verifyDocumentFileExtension(files)
      if (extFile == "xls" || extFile == "xlsx") {

        var fileSize = this.verifyFileSize(files)

        if (fileSize <= 500000 || (extFile == "xls" || extFile == "xlsx" && fileSize <= 5242880)) {
          const formData = new FormData();
          for (let i = 0; i < files.length; i++) {
            formData.append("file", files[i], files[i].name);
            formData.append("path", 'data/Tempimage')
            formData.append("uploadType", '4')
          }
          //serivce calling
          this.mainLoader = true
          this.sharedService.uploadFile(formData).subscribe({
            next: (res) => {
              this.mainLoader = false

              this.fileUploadRes = res;
              if (this.fileUploadRes.isUploaded == true) {
                this.alertService.swalPopSuccess('File Uploaded')
                this.filePathUrl = this.fileUploadRes.filedataList[0].filePath

                const control = this.attendanceForm.get('items') as FormArray;
                control.at(index).patchValue({
                  filePath: this.fileUploadRes.filedataList[0]?.filePath,
                  fileName: this.fileUploadRes.filedataList[0].fileName
                });
              } else {
                this.alertService.swalPopError(this.fileUploadRes.errorMsg || 'Upload Failed! Please Try Again.');
              }
            },
            error: () => {
              this.attendanceForm.controls[index].get('file_path')?.patchValue('');
              this.attendanceForm.controls[index].get('document_upload_path_url')?.patchValue(null);
              this.mainLoader = false;
            }
          })
        } else {
          this.alertService.swalPopError('File size must not be more than 500kb')
        }
      } else {
        const control = this.attendanceForm.get('items') as FormArray;
        control.at(index).patchValue({
          filePath: ''
        });
        this.alertService.swalPopWarning('Only excel file is allowed!')
      }
    }
  }

}
