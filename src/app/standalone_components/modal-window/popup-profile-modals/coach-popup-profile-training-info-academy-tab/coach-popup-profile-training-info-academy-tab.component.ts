import { CommonModule, DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from "@angular/material/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { MaterialModule } from "src/app/_common/material.module";
import { MY_DATE_FORMATS } from "src/app/_common/models/my_dateFormat";
import { AlertService } from "src/app/_common/services/common-services/alert.service";
import { StorageService } from "src/app/_common/services/common-services/storage.service";
import { CoachingInfoService, IAcademyList } from "src/app/_common/services/role-inner-pages-services/coach-services/coaching-info.service";
import { LoaderComponent } from "src/app/standalone_components/loader/loader.component";

@Component({
    selector: 'app-coach-popup-profile-training-info-academy-tab',
    templateUrl: './coach-popup-profile-training-info-academy-tab.component.html',
    styleUrls: ['./coach-popup-profile-training-info-academy-tab.component.css'],
    standalone: true,
    imports: [CommonModule, MaterialModule, LoaderComponent, ReactiveFormsModule, FormsModule],
    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter },
        { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
        DatePipe
    ]

})
export class CoachPopupProfileTrainingInfoAcademyTabComponent implements OnInit {
    loader: boolean = false;
    previousPositionForm!: FormGroup
    userDetails: any;
    editData: any;
    maxDate: any
    academySearchText = '';
    academyListData: IAcademyList[] = [];
    academySearchTexts: string[] = [];
    filteredAcademyListData: IAcademyList[][] = [];
    officialId: any
    coachTrainingId: any

    constructor(public activeModal: NgbActiveModal, private fb: FormBuilder, private storageService: StorageService,
        private alertService: AlertService, private datePipe: DatePipe,
        private _fb: FormBuilder,
        private coachingInfoService: CoachingInfoService,
    ) { }

    ngOnInit(): void {
        this.maxDate = new Date()
        this.getMaster()
        this.userDetails = this.storageService.getUserDetails();
        this.previousPositionForm = this.fb.group({
            officialTraining: this.fb.array([])
        });
        if (this.editData != (null)) {
            let row = this.createRow();
            this.isEdit(this.editData?.academy_detail_id, row)
        } else {
            this.addNewInputField();
        }
    }

    createRow() {
        return this._fb.group({
            coach_training_Id: [this.coachTrainingId, Validators.required],
            coach_Id: [this.officialId, Validators.required],
            academy_detail_id: ['', Validators.required],
            nsrS_Id: ['', Validators.required],
            start_date: ['', Validators.required],
            end_date: ['', Validators.required],
            remarks: ['', [Validators.maxLength(250)]],
        })
    }

    get previousPositionFormArray() { return this.previousPositionForm.get('officialTraining') as FormArray }
    addNewInputField() {
        let row = this.createRow();
        row.get('academy_detail_id')?.valueChanges.subscribe((selectedAcademyId: any) => {
            this.onAcademyChange(selectedAcademyId, row);
        });
        this.previousPositionFormArray.push(row);
        this.academySearchTexts.push('');
        this.filteredAcademyListData.push([...this.academyListData]);
        const index = this.previousPositionFormArray.length - 1;
        this.bindDateChangeValidation(row, index);
    }

    removeRow(index: number) {
        this.previousPositionFormArray.removeAt(index);
        this.academySearchTexts.splice(index, 1);
        this.filteredAcademyListData.splice(index, 1);
        this.rebindAllDateChangeValidations();
    }

    bindDateChangeValidation(row: FormGroup, index: number) {
        row.get('start_date')?.valueChanges.subscribe(() => {
            this.validateDateRange(row, index);
        });

        row.get('end_date')?.valueChanges.subscribe(() => {
            this.validateDateRange(row, index);
        });
    }

    rebindAllDateChangeValidations() {
        this.previousPositionFormArray.controls.forEach((row, index) => {
            this.bindDateChangeValidation(row as FormGroup, index);
        });
    }

    getMaster() {
        this.loader = true;
        this.coachingInfoService.getAcademyMaster().subscribe({
            next: (response) => {
                this.loader = false;
                if (response.data.length > 0) {
                    this.academyListData = response?.data;
                    this.filteredAcademyListData = this.previousPositionFormArray.controls.map(() => [...this.academyListData]);
                }
            },
            error: (err) => {
                this.loader = false;
                console.error(err)
            }
        })
    }

    // trackById(index: number, item: any): number {
    //     // console.log("item", item, index);
    //     return item.academy_detail_id; 
    // }

    get filteredAcademyList() {
        if (!this.academySearchText) return this.academyListData;
        return this.academyListData.filter(item =>
            item.academy_name.toLowerCase().includes(this.academySearchText.toLowerCase())
        );
    }

    onSearchChange(event: Event, index: number): void {
        const input = (event.target as HTMLInputElement).value;
        this.academySearchTexts[index] = input;
        this.filteredAcademyListData[index] = this.academyListData.filter(item =>
            item.academy_name.toLowerCase().includes(input.toLowerCase())
        );
    }

    onAcademyChange(selectedAcademyId: string, row: FormGroup) {
        const matchedAcademy = this.academyListData.find((a: any) => a.academy_detail_id === selectedAcademyId);
        if (matchedAcademy) {
            row.get('nsrS_Id')?.setValue(matchedAcademy.nsrS_Id);
        } else {
            row.get('nsrS_Id')?.reset();
        }
    }

    save() {
        const formValue = this.previousPositionForm.value;
        formValue.officialTraining.map((item: any) => {
            item.start_date = this.datePipe.transform(item.start_date, 'yyyy-MM-dd'),
                item.end_date = this.datePipe.transform(item.end_date, 'yyyy-MM-dd')
        });
        if (this.previousPositionForm.valid) {
            this.loader = true;
            let saveOrUpdate = this.editData ? "Update_Official_Training" : "SaveOfficialTrainingInfo";
            this.coachingInfoService.OfficialTrainingInfoSave(saveOrUpdate, this.userDetails.user_id, this.officialId, this.userDetails.role_id, formValue).subscribe({
                next: (response: any) => {
                    this.loader = false;
                    if (response) {
                        if (response.value === true) {
                            this.activeModal.close(response);
                            this.alertService.swalPopSuccess(response.messaage);
                        } else {
                            this.alertService.swalPopError(response.messaage || 'something went wrong!');
                        }

                    }
                },
                error: (err) => {
                    this.loader = false;
                    console.error(err)
                }
            })
        } else {
            this.previousPositionForm.markAllAsTouched()
        }
    }

    isEdit(selectedAcademyId: string, row: FormGroup) {
        const { start_date, end_date } = this.parsePeriod(this.editData.period);
        row.get('start_date')?.setValue(this.parseDate(start_date));
        row.get('end_date')?.setValue(this.parseDate(end_date));
        row.get('academy_detail_id')?.setValue(selectedAcademyId);
        row.get('remarks')?.setValue(this.editData?.weedOutRemark);
        row.get('nsrS_Id')?.setValue(this.editData?.nsrS_Id);
        if (this.editData.period.toLowerCase().includes('present')) {
            row.get('academy_detail_id')?.disable();
            row.get('end_date')?.disable();
            row.get('remarks')?.disable();

        } else {
            row.get('academy_detail_id')?.enable();
            row.get('end_date')?.enable();
            row.get('remarks')?.enable();
        }
        this.previousPositionFormArray.push(row);
        this.academySearchTexts.push('');
        this.filteredAcademyListData.push([...this.academyListData]);
    }

    parsePeriod(period: string): { start_date: string; end_date: string } {
        const parts = period.split(' - ');
        const start_date = parts[0].trim();
        const end_date = parts[1].trim();
        return {
            start_date,
            end_date
        };
    }

    parseDate(dateStr: string): Date | null {
        const parts = dateStr.split('/');
        if (parts.length === 3) {
            const day = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10) - 1; // Months are 0-based
            const year = parseInt(parts[2], 10);
            return new Date(year, month, day);
        }
        return null;
    }

    isDateOverlap(newStart: Date, newEnd: Date, currentIndex: number): boolean {
        for (let i = 0; i < this.previousPositionFormArray.length; i++) {
            if (i === currentIndex) continue;

            const row = this.previousPositionFormArray.at(i);
            const start = new Date(row.get('start_date')?.value);
            const end = new Date(row.get('end_date')?.value);

            if (newStart <= end && newEnd >= start) {
                return true;
            }
        }
        return false;
    }
    validateDateRange(row: FormGroup, index: number) {
        const startDate = new Date(row.get('start_date')?.value);
        const endDate = new Date(row.get('end_date')?.value);
        if (startDate && endDate && this.isDateOverlap(startDate, endDate, index)) {
            this.alertService.swalPopError('Date range overlaps with another entry. Please enter a different date range');
            row.get('start_date')?.setValue(null, { emitEvent: false });
            row.get('end_date')?.setValue(null, { emitEvent: false });
        }
    }

    // Function for trackBy
    //   trackByUserId(index: number, academy: any): number {
    //     console.log('index--------------',index);
    //     console.log('academy--------------',academy);

    //   return academy.academy_detail_id;
    // }

}
