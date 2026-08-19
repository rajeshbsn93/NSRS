import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { MatStepperModule } from "@angular/material/stepper";
import { UpcommingEventComponent } from "../upcoming-event.component";
import { AthleteDashboardSidebarComponent } from "../athlete-dashboard-sidebar/athlete-dashboard-sidebar.component";
import { AthleteBenefitsService, AthleteSupportEntity } from "src/app/_common/services/role-inner-pages-services/athlete-services/athelete-benefits.service";
import { StorageService } from "src/app/_common/services/common-services/storage.service";
import { first } from "rxjs";
import { LoaderComponent } from "src/app/standalone_components/loader/loader.component";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatExpansionModule } from "@angular/material/expansion";
import { StepperSelectionEvent } from "@angular/cdk/stepper";

@Component({
    selector:'app-benefits',
    templateUrl:'./athlete-benefits.component.html',
    styleUrls:['./athlete-benefits.component.css'], 
    standalone:true, 
    imports:[
      CommonModule, UpcommingEventComponent, AthleteDashboardSidebarComponent, MatStepperModule,
      LoaderComponent, FormsModule, ReactiveFormsModule, MatInputModule, 
      MatSelectModule, MatButtonModule, MatIconModule, MatExpansionModule
    ]
})

export class AthleteBenefitsComponent implements OnInit {
  athleteSupportDetails: Array<AthleteSupportEntity> = [];
  filteredDetails: Array<AthleteSupportEntity> = [];
  loader = true;
  form: FormGroup = this.fb.group({provider: null, type: null});
  openedSteps: Array<Number> = [1,3];
  
  constructor(
    private athleteBenefitsService: AthleteBenefitsService, 
    private storageService: StorageService, 
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    if (this.storageService.getUserDetails()?.user_id) {
      this.athleteBenefitsService.getAthleteSupport(this.storageService.getUserDetails().user_id.toString()).pipe(first()).subscribe({
        next: (response: Array<AthleteSupportEntity>) => {
          this.athleteSupportDetails = response;
          this.filteredDetails = response;
          this.loader = false;
        },
        error: () => {
          this.loader = false;
        }
      });
    }
  }

  applyFilter() {
    let tempList = this.athleteSupportDetails; 
    if (this.form.value.provider)
      tempList = tempList.filter((item) => item.supportProvider?.toLowerCase() === this.form.value.provider);
    if (this.form.value.type)
      tempList = tempList.filter((item) => item.support?.toLowerCase() === this.form.value.type);
    this.filteredDetails = tempList;
  }
}