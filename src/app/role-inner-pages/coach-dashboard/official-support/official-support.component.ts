import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { MatStepperModule } from "@angular/material/stepper";
import { StorageService } from "src/app/_common/services/common-services/storage.service";
import { first } from "rxjs";
import { LoaderComponent } from "src/app/standalone_components/loader/loader.component";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatExpansionModule } from "@angular/material/expansion";
import { CommonSupportService, OfficialSupportEntity } from "src/app/_common/services/role-inner-pages-services/common-role-services/common-support.service";
import { AthleteDashboardSidebarComponent } from "../../athlete-dashboard/athlete-dashboard-sidebar/athlete-dashboard-sidebar.component";

@Component({
    selector:'app-official-support',
    templateUrl:'./official-support.component.html',
    styleUrls:['./official-support.component.css'], 
    standalone:true, 
    imports:[
      CommonModule, AthleteDashboardSidebarComponent, MatStepperModule,
      LoaderComponent, FormsModule, ReactiveFormsModule, MatInputModule, 
      MatSelectModule, MatButtonModule, MatIconModule, MatExpansionModule
    ]
})

export class OfficialSupportComponent implements OnInit {
  officialSupportDetails: Array<OfficialSupportEntity> = [];
  filteredDetails: Array<OfficialSupportEntity> = [];
  loader = true;
  form: FormGroup = this.fb.group({provider: null, type: null});
  openedSteps: Array<Number> = [1,3];
  
  constructor(
    private commonSupportService: CommonSupportService, 
    private storageService: StorageService, 
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    if (this.storageService.getUserDetails()?.user_id) {
      this.commonSupportService.getOfficialSupport(this.storageService.getUserDetails().user_id.toString()).pipe(first()).subscribe({
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