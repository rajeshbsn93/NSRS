import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OtherRolePersonalDetailsComponent } from "../../modal-window/other-role-dashboard-modals/other-role-personal-details/other-role-personal-details.component";
import { OtherRoleKitSizeModalComponent } from "../../modal-window/other-role-dashboard-modals/other-role-kit-size-modal/other-role-kit-size-modal.component";
import { OtherRoleAddressModalComponent } from "../../modal-window/other-role-dashboard-modals/other-role-address-modal/other-role-address-modal.component";
import { OtherRoleAdditionalInfoDocumentModalComponent } from "../../modal-window/other-role-dashboard-modals/other-role-additional-info-document-modal/other-role-additional-info-document-modal.component";
import { OtherRoleSportModalComponent } from "../../modal-window/other-role-dashboard-modals/other-role-sport-modal/other-role-sport-modal.component";
import { KheloIndiaGamesViewModalComponent } from "src/app/standalone_components/modal-window/khelo-india-games-view-modal/khelo-india-games-view-modal.component";
import { OtherRoleNsfModalComponent } from "../../modal-window/other-role-dashboard-modals/other-role-nsf-modal/other-role-nsf-modal.component";
import { StorageService } from "src/app/_common/services/common-services/storage.service";
import { CoachBankDetailsModalComponent } from "../../coach-dashboard/coach-modals/coach-bank-details-modal/coach-bank-details-modal.component";

@Component({
  selector: 'app-nodal-officer-profile',
  templateUrl: './nodal-officer-profile.component.html',
  styleUrls: ['./nodal-officer-profile.component.css']
})
export class NodalOfficerProfileComponent implements OnInit {

  userDetails:any;
      constructor(
          private modalService:NgbModal,
          private storageService:StorageService,
          ){}
      ngOnInit(): void {
          this.userDetails = this.storageService.getUserDetails();        
      }
      personalDetail(){
          this.openModal(OtherRolePersonalDetailsComponent)
      }
      kheloIndiaGames(){
          //rowData
          this.modalService.open(KheloIndiaGamesViewModalComponent, { size:'xl', centered:true, backdrop: 'static', keyboard: false });    
      }
  
      kitSize(){
          this.openModal(OtherRoleKitSizeModalComponent)
      }
      contactInfo(){
          this.openModal(OtherRoleAddressModalComponent)
      }
  
      additionalInfo(){
          this.openModal(OtherRoleAdditionalInfoDocumentModalComponent)
      }
      nsf(){
          this.openModal(OtherRoleNsfModalComponent)
      }
  
      sport(){
          this.openModal(OtherRoleSportModalComponent)
      }
      bankInfo(){
          this.openModal(CoachBankDetailsModalComponent)
      }
      
  
      openModal(modalComponent: any) {
          this.modalService.open(modalComponent, { size:'xl', centered:true, backdrop: 'static', keyboard: false });    
        }
  
      ngOnDestroy(): void {
          this.modalService.dismissAll();
      }

}
