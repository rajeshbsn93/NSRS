import { Component, EventEmitter, Input, OnInit, Output,  } from '@angular/core';
import { AbstractControl,  FormBuilder, FormGroup, Validators } from '@angular/forms';
import { KicProposalService } from 'src/app/_common/services/role-inner-pages-services/kic-services/kic-proposal.service';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { environment } from 'src/environments/environment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { KicSanctionService } from 'src/app/_common/services/role-inner-pages-services/kic-services/kic-sanction.service';
import Swal from 'sweetalert2';
import { RoleCode } from 'src/app/_common/_enums/role-code';
import { LoaderComponent } from 'src/app/standalone_components/loader/loader.component';

@Component({
  selector: 'app-financial-status-uc-details',
  standalone: true,
  imports: [CommonModule, LoaderComponent],
  templateUrl: './financial-status-uc-details.component.html',
  styleUrls: ['./financial-status-uc-details.component.css']
})
export class FinancialStatusUcDetailsComponent implements OnInit {

 @Input() popupShow: any = false;
  @Output() showHideControl: any = new EventEmitter();
  @Output() popupControl_ConfirmBtn: any = new EventEmitter();
  @Input() sanction_Id!: number;
  @Input() sanction_No!: number;
  @Input() released_Amount!: number;
  @Input() sanction_Date!: number;
  @Input() kiC_id!: string;
  @Input() kiC_Name!: string;
  @Input() kiC_Type!: string;
  @Input() state_name!: string;
  @Input() enableEdit!: boolean;
  addSanctionReleased: any = [];
  fileUrl: string = environment.fileUrl;
  selectedFile!: File;
  mainLoader: Boolean = false;
  moduleType: string = '';
  getFilePath: string = '';
  formSubmitted: boolean = false;
  roleId: string = '';
  userRoleId: any;
  addressDetails: any[] = [];
  setUserRole: string = '';
  onAdd = new EventEmitter();
  isLoading: boolean = false;
  showDocument: boolean = false;
  sanctionReleaseForm!: FormGroup;
  userkicAndKisceRole: any = RoleCode
  financialStatusData:any

  constructor(
    private kicSanctionService: KicSanctionService,
    public activeModal: NgbActiveModal,
    private _alertService: AlertService,
  ) { }

  ngOnInit(): void {
    this.getSanctionReleaseUCDetails();
  }

 


  getSanctionReleaseUCDetails() {
    this.mainLoader = true;
    this.kicSanctionService.getUcSanctionReleased(this.financialStatusData.sanction_Id).subscribe({
      next: (res: any) => {
        this.addSanctionReleased = res.data;
        this.mainLoader = false;
      },
      complete: () => { },
      error: (errors: any) => {
        this.formSubmitted = false;
        this._alertService?.swalPopErrorTimer(errors?.error?.message);
      },
    });
  }

  modalClose(closeType = 'cancel') {
    this.activeModal.close(closeType);
    this.onAdd.emit();
  }


  openFile(filePath: string) {
    if (filePath) {
      const fileUrl = this.fileUrl + filePath;
      window.open(fileUrl, '_blank');
    } else {
      this._alertService.swalPopError('File path is not available.');
    }
  }


}
