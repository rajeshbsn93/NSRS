import { CommonModule, DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from "@angular/material/core";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Observable } from "rxjs";
import { MaterialModule } from "src/app/_common/material.module";
import { MY_DATE_FORMATS } from "src/app/_common/models/my_dateFormat";
import { AlertService } from "src/app/_common/services/common-services/alert.service";
import { CommonSharableService } from "src/app/_common/services/common-services/commonSharable.service";
import { recruitmentSportQuotaService, typeOfGovtMaster } from "src/app/_common/services/common-services/recruitmentSportQuota.service";
import { StorageService } from "src/app/_common/services/common-services/storage.service";
import { SharableService } from "src/app/_common/services/innerPagesServices/innerpagesSharable.service";
import { CoachAchievementService } from "src/app/_common/services/role-inner-pages-services/coach-services/coach-achievement.service";
import { LoaderComponent } from "src/app/standalone_components/loader/loader.component";

@Component({
    selector: 'app-add-edit-recruitment-quota-for-athlte',
    templateUrl: './add-edit-recruitment-quota-for-athlte.component.html',
    styleUrls: ['./add-edit-recruitment-quota-for-athlte.component.css'],
    standalone: true,
    imports: [CommonModule, MaterialModule, LoaderComponent, ReactiveFormsModule],
    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
        DatePipe
    ]
})
export class AddEditRecruitmentQuotaForAthlteComponent implements OnInit {
    recruitmentForm!: FormGroup
    loader: boolean = false;
    userDetails: any;
    editData: any;
    designation$: Observable<any> = new Observable();
    maxDate: any
    typeOfGovt: typeOfGovtMaster = [];


    constructor(public activeModal: NgbActiveModal, private fb: FormBuilder, private storageService: StorageService,
        private alertService: AlertService, private datePipe: DatePipe, private sharableService: SharableService,
        private commonSharableService: CommonSharableService,
        private recruitmentQuotaService: recruitmentSportQuotaService,
        private coachAchievementService: CoachAchievementService) { }

    ngOnInit(): void {
        this.maxDate = new Date()
        this.getMaster()
        this.userDetails = this.storageService.getUserDetails();

        this.recruitmentForm = this.fb.group({
            id: [0],
            nsrS_Id: [this.userDetails.nsrs_id || 0, [Validators.required]],
            name_Of_Employer: ['', [Validators.required]],
            rollId: [this.userDetails.role_id || 0, [Validators.required]],
            type_Of_Goverment: ['', Validators.required],
            date_Of_Joining: ['', Validators.required],
            post_Name_At_Time_Of_Entry: ['', Validators.required],
            grade_level_at_entry: ['', Validators.required],
            currentPost: ['', Validators.required],
            current_PayScale_Level: ['', Validators.required],
            date_Of_relieving: [null],
            others: ['']

        });




        if (this.editData != null) {
            this.recruitmentForm.patchValue({
                id: this.editData.id,
                name_Of_Employer: this.editData.name_Of_Employer,
                type_Of_Goverment: this.editData.type_Of_Goverment,
                date_Of_Joining: this.editData.date_Of_Joining,
                post_Name_At_Time_Of_Entry: this.editData.post_Name_At_Time_Of_Entry,
                grade_level_at_entry: this.editData.grade_level_at_entry,
                currentPost: this.editData.currentPost,
                current_PayScale_Level: this.editData.current_PayScale_Level,
                date_Of_relieving: this.editData.date_Of_relieving,
                others: this.editData.others
            })
        }

        this.recruitmentForm.get('type_Of_Goverment')?.valueChanges.subscribe(value => {
            const othersControl = this.recruitmentForm.get('others');
            if (value === 4) {
                othersControl?.setValidators(Validators.required);
            } else {
                othersControl?.clearValidators();
                othersControl?.setValue('');
            }
            othersControl?.updateValueAndValidity();
        });

    }

    getMaster() {
        this.loader = true;
        this.recruitmentQuotaService.getMasterGovtType().subscribe({
            next: (response) => {
                this.loader = false;
                if (response.length > 0) {
                    this.typeOfGovt = response
                }
            },
            error: (err) => {
                this.loader = false;
                console.error(err)
            }
        })
    }




    save() {
        const formValue = this.recruitmentForm.value;
        const payload = {
            recruitmentSportKota_Data: [{
                ...formValue,
                date_Of_Joining: this.datePipe.transform(formValue.date_Of_Joining, 'yyyy-MM-dd'),
                date_Of_relieving: formValue.date_Of_relieving ? this.datePipe.transform(formValue.date_Of_relieving, 'yyyy-MM-dd') : null,
            }]
        };
        if (this.recruitmentForm.valid) {
            this.loader = true;
            this.recruitmentQuotaService.saveRecruitmentSportsQuota(this.userDetails.user_id, this.userDetails.nsrs_id, this.userDetails.role_id, payload).subscribe({
                next: (response) => {
                    this.loader = false;
                    if (response) {
                        this.activeModal.close(response);
                        this.alertService.swalPopSuccess('Saved Successfully!');
                    }
                },
                error: (err) => {
                    this.loader = false;
                    console.error(err)
                }
            })
        } else {
            this.recruitmentForm.markAllAsTouched()
        }
    }

}
