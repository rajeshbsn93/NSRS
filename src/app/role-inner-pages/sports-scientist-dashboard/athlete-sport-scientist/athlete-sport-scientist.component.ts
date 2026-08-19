import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { AthleteDashboardSidebarComponent } from "../../athlete-dashboard/athlete-dashboard-sidebar/athlete-dashboard-sidebar.component";

@Component({
    selector:'app-athlete-sport-scientist',
    templateUrl:'./athlete-sport-scientist.component.html',
    styleUrls:['./athlete-sport-scientist.component.css'],
    standalone:true,
    imports:[CommonModule,AthleteDashboardSidebarComponent]
})

export class AthleteSportScientistComponent{}