import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LoaderComponent } from 'src/app/standalone_components/loader/loader.component';
import { MaterialModule } from 'src/app/_common/material.module';
import { MY_DATE_FORMATS } from 'src/app/_common/models/my_dateFormat';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { Enable_disableFormService } from 'src/app/_common/services/common-services/enable_disableForm.service';
import { StorageService } from 'src/app/_common/services/common-services/storage.service';
import { AcademySharableService } from 'src/app/_common/services/role-inner-pages-services/academy-services/academySharable.service';
import { CoachDetailListService, IDesignationList } from 'src/app/_common/services/role-inner-pages-services/academy-services/coach-detail-list.service';
import { SharableService } from 'src/app/_common/services/innerPagesServices/innerpagesSharable.service';
import { environment } from 'src/environments/environment';
import { CampInnerPagesService } from 'src/app/_common/services/camp-services/camp-inner-pages.service';

@Component({
  selector: 'app-add-camp-coach',
  templateUrl: './add-camp-coach.component.html',
  styleUrls: ['./add-camp-coach.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ],
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule, LoaderComponent]
})
export class AddCampCoachComponent implements OnInit {
  multiTagForm!: FormGroup
  sportDisciplineIdToAdd: any
  loader: boolean = false
  userDetails: any
  getDataByNsrsId: any;
  designationsList: IDesignationList[] = [];
  fileUploadRes: any
  fileUrl: any
  fileBaseUrl = environment.fileUrl;
  todayDate = new Date();
  minDate = new Date();
  maxDate = new Date();


  constructor(public activeModal: NgbActiveModal, private fb: FormBuilder, private academySharableService: AcademySharableService,
    private storageService: StorageService, private alertService: AlertService, private coachDetailService: CoachDetailListService,
    private enableDisableService: Enable_disableFormService, private _sharableService: SharableService,
    private campInnerPageService: CampInnerPagesService,
    private campInnerPagesService: CampInnerPagesService) { }

  ngOnInit() {
    this.userDetails = this.storageService.getAcademyDetails()
    this.getBasicCampDetail();
    //multitagging reactive formarray
    this.multiTagFormReactiveForm()
    //in case if dropdown is selected on coach detail component dropdown of sports discipline
    //console.log(this.sportDisciplineIdToAdd.disciplineToSearch);

    this.coachDetailService.getCoachDesignationList().subscribe((response: IDesignationList[]) => this.designationsList = response);
  }

  multiTagFormReactiveForm() {
    this.multiTagForm = this.fb.group({
      addMultiTagArray: this.fb.array([])
    })
    this.addMultiTagArray.push(this.AddMultiTagArrayControls())
  }

  get addMultiTagArray(): FormArray {
    return this.multiTagForm.get('addMultiTagArray') as FormArray
  }

  AddMultiTagArrayControls(): FormGroup {
    return this.fb.group({
      ki_unique_id: ['', Validators.required],
      offcialDetailId: [''],
      coach_name: [{ value: '', disabled: true }],
      designation: ['', Validators.required],
      doj: ['',  Validators.required],
      endDate: ['',  Validators.required],
      docPath: [''],
      document_upload_path_url: [''],
    })
  }

  newAddMultiTagArray() {
    this.addMultiTagArray.push(this.AddMultiTagArrayControls())
  }

  removeAddMultiTagArray(index: any) {
    this.addMultiTagArray.removeAt(index)
  }

  nsrsId: any;
  duplicateCheck: boolean = false;
  getDataOnchangeNsrsid(event: Event, index: any) {
    const coachRoleId = 2;
    this.nsrsId = (event.target as HTMLInputElement)?.value
    if (this.nsrsId != '') {
      if (this.addMultiTagArray.length > 1) {
        this.duplicateCheck = false;
        for (let j = 0; j < index; j++) {
          if ((this.addMultiTagArray.at(j)?.value?.ki_unique_id)?.trim() === (this.nsrsId)?.trim()) {
            this.duplicateCheck = true;
            break;
          } else {
            this.duplicateCheck = false;
          }
        }
        if (this.duplicateCheck == true) {
          this.addMultiTagArray.controls[index].get('ki_unique_id')?.reset();
          this.addMultiTagArray.updateValueAndValidity();
          this.alertService.swalPopWarning("Duplicate entry is detected!");
        } else if (this.duplicateCheck == false) {
          this.loader = true
          this.campInnerPageService.GetCoachSSDetailforCamp(this.nsrsId, this.sportDisciplineIdToAdd.disciplineToSearch, coachRoleId).subscribe({
            next: (res: any) => {
              this.loader = false
              this.getDataByNsrsId = res[0]
              //console.log(this.getDataByNsrsId)
              if (res.length > 0) {
                this.setInputValues(index)
              } else {
                this.alertService.swalPopWarning(`Either NSRS ID is not valid or discipline mapping is not correct`);
                this.addMultiTagArray.controls[index].get('ki_unique_id')?.reset();
                this.addMultiTagArray.controls[index].get('coach_name')?.reset();
              }
            },
            error: () => {
              console.error('error caught in athlete mapping details')
              this.loader = false
            }
          })
        }
      } else {
        this.loader = true
        this.campInnerPageService.GetCoachSSDetailforCamp(this.nsrsId, this.sportDisciplineIdToAdd.disciplineToSearch, coachRoleId).subscribe({
          next: (res: any) => {
            this.loader = false
            this.getDataByNsrsId = res[0]
            //console.log(this.getDataByNsrsId)
            // if(this.getDataByNsrsId.academy_name==''){
            //   this.setInputValues(index)
            // }else if(this.getDataByNsrsId.academy_name==null){
            //   if(this.getDataByNsrsId.remark==''){
            //     this.alertService.swalPopError("Mapped somewhere")
            //   }else{
            //     this.alertService.swalPopError(this.getDataByNsrsId.remark)
            //   }
            // }else if(this.getDataByNsrsId.academy_name!=''){
            //   var msg=this.getDataByNsrsId.academy_name
            //   this.alertService.swalPopError(`Already mapped ${msg}`)
            // }
            if (res.length > 0) {
              this.setInputValues(index)
            } else {
              this.alertService.swalPopWarning(`Either NSRS ID is not valid or discipline mapping is not correct`);
              this.addMultiTagArray.controls[index].get('ki_unique_id')?.reset();
              this.addMultiTagArray.controls[index].get('coach_name')?.reset();
            }
          },
          error: () => {
            console.error('error caught in athlete mapping details')
            this.loader = false
          }
        })
      }

    } else {
      this.alertService.swalPopWarning("Please enter a NSRS ID")
      //console.log(this.nsrsId)
    }
  }

  setInputValues(index: any) {
    // console.log(this.getDataByNsrsId)
    this.addMultiTagArray.at(index).patchValue({
      coach_name: this.getDataByNsrsId.full_name,
      offcialDetailId: this.getDataByNsrsId.official_detail_id
    });
    this.enableDisableService.DisableFieldFormArray(this.addMultiTagArray, index, "coach_name", true)
  }

  verifyFileSize(files: any) {
    var fileSize = files[0].size
    //console.log(fileSize)
    return fileSize
  }

  verifyDocumentFileExtension(files: any) {
    var fileIndex = files[0].name.lastIndexOf(".") + 1;
    var extFile = files[0].name.substr(fileIndex, files[0].name.length).toLowerCase();
    return extFile
  }

  public uploadDocuments = (files: any, index: any) => {
    if (files.length === 0) {
      return;
    } else {
      var extFile = this.verifyDocumentFileExtension(files)
      if (extFile == "jpg" || extFile == "jpeg" || extFile == "png" || extFile == "pdf") {
        var fileSize = this.verifyFileSize(files)
        if (fileSize <= 500000) {
          const formData = new FormData();
          for (let i = 0; i < files.length; i++) {
            formData.append("file", files[i], files[i].name);
            formData.append("path", 'data/Tempimage')
            formData.append("uploadType", '3')
          }
          //serivce calling
          this.loader = true
          this._sharableService.uploadFile(formData).subscribe({
            next: (res) => {
              this.loader = false
              this.fileUploadRes = res;
              if (this.fileUploadRes.isUploaded == true) {
                this.alertService.swalPopSuccess('File Uploaded')
                this.AddMultiTagArrayControls().controls['docPath'].setValue = this.fileUploadRes.filedataList[0].filePath
                // this.addMultiTagArray.at(index).patchValue({
                //   document_upload_path:this.fileUploadRes.filedataList[0].filePath
                // });
                this.fileUrl = this.fileUploadRes.filedataList[0].filePath;
                this.addMultiTagArray.controls[index].get('document_upload_path_url')?.setValue(this.fileUploadRes.filedataList[0].filePath);
                //console.log(this.fileUrl)
              } else {
                this.alertService.swalPopError(this.fileUploadRes.errorMsg || 'Upload Failed! Please Try Again.');
                this.addMultiTagArray.controls[index].get('docPath')?.setValue('');
                this.addMultiTagArray.controls[index].get('document_upload_path_url')?.setValue(null);
              }
            },
            error: () => {
              console.error('error caught in file uploading');
              this.addMultiTagArray.controls[index].get('docPath')?.setValue('');
              this.addMultiTagArray.controls[index].get('document_upload_path_url')?.setValue(null);
              this.loader = false;
            }
          })
        } else {
          this.alertService.swalPopError('File size must not be more than 500kb')
        }
      }
      else {
        this.alertService.swalPopWarning('Only jpg, jpeg, png, pdf file is allowed!')
      }
    }
  }

  submitMultiAddCoach() {
    //console.log(this.multiTagForm.getRawValue().addMultiTagArray)
    if (this.multiTagForm.valid) {
      let formArrayValue = this.addMultiTagArray.getRawValue();
      formArrayValue.forEach((item, i) => {
        formArrayValue[i].docPath = formArrayValue[i].document_upload_path_url;
        delete formArrayValue[i].document_upload_path_url;
        delete formArrayValue[i].coach_name;
        delete formArrayValue[i].ki_unique_id;
      }
      );
      //console.log(formArrayValue)
      for (let i of this.multiTagForm.getRawValue().addMultiTagArray) {
        //console.log(i.doj)
        i.doj = i.doj.utc('dd-MM-YYYY')
      }
      this.loader = true
      this.campInnerPageService.saveCampOfficialDetail(this.userDetails.user_id, formArrayValue).subscribe({
        next: (res: any) => {
          this.loader = false;
          //console.log(res)
          if (res) {
            this.alertService.swalPopSuccess('Saved successfully!')
            this.activeModal.close(res)
          }
        },
        error: () => {
          console.error("error caught in AcademyCoachMapping")
          this.loader = false
        }
      })
    } else {
      this.multiTagForm.markAllAsTouched()
      //console.log("plz fill form data first")
    }
  }

  // get basic camp details to validate 
  getBasicCampDetail() {
    this.campInnerPagesService.basicCampDetail(this.userDetails.user_id).subscribe({
      next: (res: any) => {
        if (res) {
          this.minDate = new Date(res[0].from_date);
          this.maxDate = new Date(res[0].to_date);
        }
      }, error: (err) => { console.log(err); }
    })
  }

}
