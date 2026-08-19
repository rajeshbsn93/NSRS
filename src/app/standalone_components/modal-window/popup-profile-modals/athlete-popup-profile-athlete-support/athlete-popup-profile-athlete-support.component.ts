import { CommonModule } from "@angular/common";
import { Component, Input, OnInit } from "@angular/core";
import { MatStepperModule } from "@angular/material/stepper";
import { AthleteBenefitsService, AthleteSupportEntity } from "src/app/_common/services/role-inner-pages-services/athlete-services/athelete-benefits.service";
import { first } from "rxjs";
import { LoaderComponent } from "src/app/standalone_components/loader/loader.component";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatExpansionModule } from "@angular/material/expansion";

@Component({
    selector:'app-athlete-popup-profile-athlete-support',
    templateUrl:'./athlete-popup-profile-athlete-support.component.html',
    styleUrls:['./athlete-popup-profile-athlete-support.component.css'], 
    standalone:true, 
    imports:[
      CommonModule, MatStepperModule,
      LoaderComponent, FormsModule, ReactiveFormsModule, MatInputModule, 
      MatSelectModule, MatButtonModule, MatIconModule, MatExpansionModule
    ]
})

export class AthletePopupProfileAthleteSupportComponent implements OnInit {
  athleteSupportDetails: Array<AthleteSupportEntity> = [];
  filteredDetails: Array<AthleteSupportEntity> = [];
  loader = true;
  form: FormGroup = this.fb.group({provider: null, type: null});
  openedSteps: Array<Number> = [1,3];
  @Input() player_Id:any
  
  constructor(
    private athleteBenefitsService: AthleteBenefitsService, 
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    if (this.player_Id) {
      this.athleteBenefitsService.getAthleteSupport(this.player_Id).pipe(first()).subscribe({
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