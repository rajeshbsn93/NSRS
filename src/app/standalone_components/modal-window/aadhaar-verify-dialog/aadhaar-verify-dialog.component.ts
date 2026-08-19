import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { StorageService } from 'src/app/_common/services/common-services/storage.service';
import { EncryptionService } from 'src/app/_common/services/innerPagesServices/encryption.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-aadhaar-verify-dialog',
  templateUrl: './aadhaar-verify-dialog.component.html',
  styleUrls: ['./aadhaar-verify-dialog.component.css'],
  standalone:true,
  imports:[]
})
export class AadhaarVerifyDialogComponent implements OnInit {
  userSessionData:any;
    navigateUrl:any
  constructor(
    public activeModal:NgbActiveModal,
    private storageService:StorageService,
    private encrytDecryptService:EncryptionService
  ) { }

  ngOnInit() {
    this.userSessionData = this.storageService.getUserProfileDataFromSessionRes();
  }
  verifyAadhar(){
    let stateVal=this.userSessionData.userData.role_id+'_'+this.userSessionData.userData.user_id
    let encyVal = this.encrytDecryptService.encryptionAES(stateVal)
    if(environment.digiLockerAadhaar=='production'){
      this.navigateUrl = `https://digilocker.meripehchaan.gov.in/public/oauth2/1/authorize?response_type=code&client_id=TZ041DAA02&redirect_uri=https://nsrs.kheloindia.gov.in/digilocker&state=${encyVal}&code_challenge=j7ArcsN1DD1SDHIUSsDOXaJkb6YVaUEDelo1wpempko&code_challenge_method=S256`
    }else{
      this.navigateUrl = `https://digilocker.meripehchaan.gov.in/public/oauth2/1/authorize?response_type=code&client_id=US8F7809DD&redirect_uri=http://192.168.23.254:105&state=${encyVal}&code_challenge=j7ArcsN1DD1SDHIUSsDOXaJkb6YVaUEDelo1wpempko&code_challenge_method=S256`
    }
    window.open(this.navigateUrl,'_blank')
  }

}
