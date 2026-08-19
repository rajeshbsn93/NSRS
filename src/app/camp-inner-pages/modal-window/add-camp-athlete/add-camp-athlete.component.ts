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
import { SharableService } from 'src/app/_common/services/innerPagesServices/innerpagesSharable.service';
import { environment } from 'src/environments/environment';
import { CampAthleteService } from 'src/app/_common/services/camp-services/camp-athlete.service';
import { CampInnerPagesService } from 'src/app/_common/services/camp-services/camp-inner-pages.service';

@Component({
  selector: 'app-add-camp-athlete',
  templateUrl: './add-camp-athlete.component.html',
  styleUrls: ['./add-camp-athlete.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ],
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule, LoaderComponent],

})
export class AddCampAthleteComponent implements OnInit {
  disciplineToAddID: any
  multiAthleteTagForm!: FormGroup
  userDetails: any
  loader: boolean = false
  getDataByNsrsId: any
  fileUploadRes: any
  fileUrl: any
  fileBaseUrl = environment.fileUrl;
  todayDate = new Date();
  minDate = new Date();
  maxDate = new Date();

  constructor(public activeModal: NgbActiveModal, private fb: FormBuilder, private aletService: AlertService,
    private campAthleteService: CampAthleteService, private storageService: StorageService,
    private _sharableService: SharableService, private enableDisableService: Enable_disableFormService,
    private campInnerPagesService: CampInnerPagesService) { }

  ngOnInit() {
    this.userDetails = this.storageService.getAcademyDetails();
    this.getBasicCampDetail();
    this.multiAthleteTagForm = this.fb.group({
      addMultiTagArray: this.fb.array([])
    });

    this.addMultiTagArray.push(this.AddMultiTagArray());
  }

  get addMultiTagArray(): FormArray {
    return this.multiAthleteTagForm.get('addMultiTagArray') as FormArray
  }

  AddMultiTagArray(): FormGroup {
    return this.fb.group({
      ki_unique_id: ['', Validators.required],
      athelete_name: [{ value: '', disabled: true }],
      category: ['', Validators.required],
      doj: ['', Validators.required],
      period_upto: ['',Validators.required],
      file_path: [''],
      document_upload_path_url: [''],
      player_detail_id: [''],
      camp_detail_id: [''],
      user_id: [],
    })
  }

  newAddMultiTagArray() {
    this.addMultiTagArray.push(this.AddMultiTagArray())
  }

  removeAddMultiTagArray(index: any) {
    this.addMultiTagArray.removeAt(index)
  }

  nsrsId: any;
  duplicateCheck: boolean = false;
  changeInNsrsID(event: Event, index: any) {
    this.nsrsId = (event.target as HTMLInputElement)?.value
    if (this.nsrsId != '') {
      if (this.addMultiTagArray.length > 1) {
        this.duplicateCheck = false
        for (let j = 0; j < index; j++) {
          if ((this.addMultiTagArray.at(j)?.value.ki_unique_id).trim() === (this.nsrsId).trim()) {
            this.duplicateCheck = true;
            break

          } else {
            // console.log('index',index)
            this.duplicateCheck = false
          }
        }
        if (this.duplicateCheck == true) {
          //console.log("matches")
          this.addMultiTagArray.controls[index].get('ki_unique_id')?.reset()
          this.addMultiTagArray.updateValueAndValidity();
          this.aletService.swalPopWarning("Duplicate entry is detected!");
        } else if (this.duplicateCheck == false) {
          this.loader = true
          this.campAthleteService.campAtheleteMappingDetail(this.nsrsId, this.disciplineToAddID, this.userDetails.user_id).subscribe({
            next: (res: any) => {
              this.loader = false
              this.getDataByNsrsId = res
              //console.log(this.getDataByNsrsId)
              if (res.length == 0) {
                this.aletService.swalPopWarning('Either NSRS ID is not valid or discipline mapping is not correct');
                this.addMultiTagArray.controls[index].get('ki_unique_id')?.reset()
                this.addMultiTagArray.controls[index].get('athelete_name')?.reset()
              } else {
                if (this.getDataByNsrsId[0].player_detail_id != 0) {
                  this.setInputValues(index)
                } else {
                  var msg;
                  if (this.getDataByNsrsId[0].first_name == null) {
                    msg = this.getDataByNsrsId[0].remark
                  } else {
                    // msg=this.getDataByNsrsId[0].remark + ' is in ' + this.getDataByNsrsId[0].first_name
                    msg = this.getDataByNsrsId[0].remark
                  }
                  //console.log(msg)
                  this.aletService.swalPopError(msg)
                }
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
        this.campAthleteService.campAtheleteMappingDetail(this.nsrsId, this.disciplineToAddID, this.userDetails.user_id).subscribe({
          next: (res: any) => {
            this.loader = false
            this.getDataByNsrsId = res
            //console.log(this.getDataByNsrsId)
            if (res.length == 0) {
              this.aletService.swalPopWarning('Either NSRS ID is not valid or discipline mapping is not correct');
              this.addMultiTagArray.controls[index].get('ki_unique_id')?.reset()
              this.addMultiTagArray.controls[index].get('athelete_name')?.reset()
            } else {
              if (this.getDataByNsrsId[0].player_detail_id != 0) {
                this.setInputValues(index)
              } else {
                var msg;
                if (this.getDataByNsrsId[0].first_name == null) {
                  msg = this.getDataByNsrsId[0].remark
                } else {
                  // msg=this.getDataByNsrsId[0].remark + ' is in ' + this.getDataByNsrsId[0].first_name
                  msg = this.getDataByNsrsId[0].remark
                }
                //console.log(msg)
                this.aletService.swalPopError(msg)
              }
            }
          },
          error: () => {
            console.error('error caught in athlete mapping details')
            this.loader = false
          }
        })
      }
    } else {
      this.aletService.swalPopWarning("Please enter a NSRSId");
      //console.log(this.nsrsId)
    }
  }

  setInputValues(index: any) {
    this.addMultiTagArray.at(index).patchValue({
      athelete_name: this.getDataByNsrsId[0].full_name,
      player_detail_id: this.getDataByNsrsId[0].player_detail_id,
      camp_detail_id: this.getDataByNsrsId[0].camp_detail_id,
      user_id: this.userDetails.user_id
    });
    this.enableDisableService.DisableFieldFormArray(this.addMultiTagArray, index, 'athelete_name', true)
    this.enableDisableService.DisableFieldFormArray(this.addMultiTagArray, index, 'dob', true)
    // this.DisableField(index,"athelete_name",true)
    // this.DisableField(index,"dob",true)
    // this.DisableField(index,"sport",true)
  }

  // private DisableField(index:number,formControlName:string,disableVal?:boolean){
  //   this.addMultiTagArray.controls[index].get(formControlName)?.disable({onlySelf:disableVal})
  // }
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
                this.aletService.swalPopSuccess('File Uploaded')
                this.AddMultiTagArray().controls['file_path'].setValue = this.fileUploadRes.filedataList[0].filePath
                // this.addMultiTagArray.at(index).patchValue({
                //   document_upload_path:this.fileUploadRes.filedataList[0].filePath
                // });
                this.fileUrl = this.fileUploadRes.filedataList[0].filePath;
                this.addMultiTagArray.controls[index].get('document_upload_path_url')?.setValue(this.fileUploadRes.filedataList[0].filePath);
                //console.log(this.fileUrl)
              } else {
                this.aletService.swalPopError(this.fileUploadRes.errorMsg || 'Upload Failed! Please Try Again.');
                this.addMultiTagArray.controls[index].get('file_path')?.setValue('');
                this.addMultiTagArray.controls[index].get('document_upload_path_url')?.setValue(null);
              }
            },
            error: () => {
              console.error('error caught in file uploading');
              this.addMultiTagArray.controls[index].get('file_path')?.setValue('');
              this.addMultiTagArray.controls[index].get('document_upload_path_url')?.setValue(null);
              this.loader = false;
            }
          })
        } else {
          this.aletService.swalPopError('File size must not be more than 500kb')
        }
      }
      else {
        this.aletService.swalPopWarning('Only jpg, jpeg, png, pdf file is allowed!')
      }
    }
  }

  submitMultiTagged() {
    //console.log(this.addMultiTagArray.valid)
    //console.log(this.addMultiTagArray)
    if (this.addMultiTagArray.valid) {
      for (let data of this.addMultiTagArray.value) {
        if (data.doj) data.doj = data.doj.utc('dd-MM-YYYY')
        if (data.period_upto) data.period_upto = data.period_upto.utc('dd-MM-YYYY')
      }
      let formArrayValue = this.addMultiTagArray.getRawValue();
      formArrayValue.forEach((item, i) => {
        formArrayValue[i].file_path = formArrayValue[i].document_upload_path_url;
        delete formArrayValue[i].document_upload_path_url;
        delete formArrayValue[i].ki_unique_id;
        delete formArrayValue[i].athelete_name;
      }
      );
      //console.log(formArrayValue)
      this.loader = true
      this.campAthleteService.saveCampAtheleteMappingDetail(formArrayValue).subscribe({
        next: (res: any) => {
          this.loader = false;
          if (res) {
            this.aletService.swalPopSuccess('Saved Successfully');
            this.activeModal.close(res);
          }
          // this.aletService.swalPopSuccess(res.error);
          // this.activeModal.close({...this.addMultiTagArray.getRawValue()});
        },
        error: () => {
          this.aletService.swalPopError('Something went wrong! Please try again.');
          console.error('error caught in saving academy multiple athletes')
          this.loader = false;
        }
      })
    } else {
      this.addMultiTagArray.markAllAsTouched()
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
