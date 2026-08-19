import { CommonModule } from "@angular/common";
import { Component, Input, OnInit } from "@angular/core";
import { MatStepperModule } from "@angular/material/stepper";
import { first } from "rxjs";
import { LoaderComponent } from "src/app/standalone_components/loader/loader.component";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatExpansionModule } from "@angular/material/expansion";
import { CommonSupportService, OfficialSupportEntity } from "src/app/_common/services/role-inner-pages-services/common-role-services/common-support.service";

@Component({
    selector:'app-official-popup-profile-support',
    templateUrl:'./official-popup-profile-support.component.html',
    styleUrls:['./official-popup-profile-support.component.css'], 
    standalone:true, 
    imports:[
      CommonModule, MatStepperModule,
      LoaderComponent, FormsModule, ReactiveFormsModule, MatInputModule, 
      MatSelectModule, MatButtonModule, MatIconModule, MatExpansionModule
    ]
})

export class OfficialPopupProfileSupportComponent implements OnInit {
  officialSupportDetails: Array<OfficialSupportEntity> = [];
  filteredDetails: Array<OfficialSupportEntity> = [];
  loader = true;
  form: FormGroup = this.fb.group({provider: null, type: null});
  openedSteps: Array<Number> = [1,3];
  @Input() player_Id:any
  
  constructor(
    private commonSupportService: CommonSupportService, 
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    if (this.player_Id) {
      this.commonSupportService.getOfficialSupport(this.player_Id.toString()).pipe(first()).subscribe({
        next: (response: Array<OfficialSupportEntity>) => {
          this.officialSupportDetails = response;
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
    let tempList = this.officialSupportDetails; 
    if (this.form.value.provider)
      tempList = tempList.filter((item) => item.supportProvider?.toLowerCase() === this.form.value.provider);
    if (this.form.value.type)
      tempList = tempList.filter((item) => item.support?.toLowerCase() === this.form.value.type);
    this.filteredDetails = tempList;
  }
}