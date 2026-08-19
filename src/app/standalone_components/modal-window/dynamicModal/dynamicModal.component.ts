import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from 'src/app/_common/material.module';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { KicProposalService } from 'src/app/_common/services/role-inner-pages-services/kic-services/kic-proposal.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dynamicModal',
  templateUrl: './dynamicModal.component.html',
  styleUrls: ['./dynamicModal.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
})
export class DynamicModalComponent implements OnInit {
  @Input() title: string = '';
  @Input() selectMode!: string;
  @Input() height: string = '';
  @Input() modalSize: string = '';
  @Output() close: any = new EventEmitter();

  proposalArray!: FormArray;
  documentsIndex!: number;

  mainLoader: Boolean = false;

  fileBaseUrl: any = environment.fileUrl;

  constructor(private _proposalService: KicProposalService, public activeModal: NgbActiveModal, private _alertService: AlertService) {}

  ngOnInit(): void {
  }

  getFileExtension(file: any) {
    let fileIndex = file.name.lastIndexOf('.') + 1;
    let extFile = file.name.substr(fileIndex, file.name.length).toLowerCase();
    return extFile;
  }

  verifyFileSize(files: any) {
    var fileSize = files[0].size;
    return fileSize;
  }

  uploadProposalDocumentFile(files: any, formcontrolname: any) {
    if (files.length === 0) {
      return;
    } else {
      let extFile = this.getFileExtension(files[0]);
      let fileSize = this.verifyFileSize(files);
      if (extFile == 'pdf') {
        if (fileSize < 10485770) {
          const formData = new FormData();
          formData.append('file', files[0], files[0].name);
          formData.append('path', 'data/Tempimage');
          formData.append('uploadType', '4');

          // Uploading file - calling service
          this.mainLoader = true;
          this._proposalService?.uploadFile(formData).subscribe({
            next: (res: any) => {
              this.mainLoader = false;
              if (res?.isUploaded == true) {
                // this.addProposalForm.get(`${formcontrolname}`)?.setValue(res?.filedataList[0].filePath)
                this.proposalArray.controls[this.documentsIndex].get(`${formcontrolname}`)?.setValue(res?.filedataList[0].filePath);

                this._alertService.swalPopSuccess('File Uploaded');
              } else {
                this._alertService.swalPopError(res?.errorMsg || 'Upload Failed! Please Try Again.');
              }
            },
            error: () => {
              this.mainLoader = false;
              // Handle error
            },
          });
        } else {
          this._alertService.swalPopWarning('File Size must be less than 10Mb.');
        }
      } else {
        this._alertService.swalPopError('Only PDF files are allowed.');
      }
    }
  }

  openFile(controlName: string) {
    // const filePath = this.addProposalForm.get(controlName)?.value;
    const filePath = this.proposalArray.controls[this.documentsIndex].get(controlName)?.value;

    if (filePath) {
      const fileUrl = this.fileBaseUrl + filePath;
      window.open(fileUrl, '_blank');
    } else {
      this._alertService.swalPopError('File path is not available.');
    }
  }
}
