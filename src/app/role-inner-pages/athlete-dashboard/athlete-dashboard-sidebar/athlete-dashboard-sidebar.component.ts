import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CarouselModule, OwlOptions } from "ngx-owl-carousel-o";
import { ActivatedRoute } from "@angular/router";
import { StorageService } from "src/app/_common/services/common-services/storage.service";
import Swal from "sweetalert2";
import { EncryptionService } from "src/app/_common/services/innerPagesServices/encryption.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ViewAadhaarComponent } from "src/app/standalone_components/modal-window/view-aadhar/view-aadhar.component";
import { environment } from "src/environments/environment";


@Component({
    selector:'app-athlete-dashboard-sidebar',
    templateUrl:'./athlete-dashboard-sidebar.component.html',
    styleUrls:['./athlete-dashboard-sidebar.component.css'],
    standalone:true,
    imports:[CommonModule,CarouselModule]
})

export class AthleteDashboardSidebarComponent implements OnInit, AfterViewInit{
  date: any;
  nowTime: any;
  navigateUrl:any
  // targetDate: any = new Date('2024-07-26T00:00:00+02:00');
  // targetDate: any = new Date(2024,6,26);
  // targetDate: any = new Date('Fri Jul 27 2024 02:16:20 GMT+0530 (India Standard Time)');
  // targetDate: any = new Date('Fri Jul 26 2024 23:30:40 GMT+0530 (India Standard Time)');
  targetDate: any = new Date('Sat Sep 18 2026 23:59:59 GMT+0530 (India Standard Time)');
  
  
  // targetTime: any = this.targetDate.getTime();
  targetTime: any;
  difference!: number;
  days!:number;
  hours!:number;
  minutes!:number;
  seconds!:number;
  currentUrl:any;
  userSessionData:any;
  hideVerifyViewAadhaar = [4 ,3 ,1006, 666 , 112]
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: true,
    navSpeed: 700,
    // navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 1
      },
      940: {
        items: 1
      }
    },
    nav: false
  }
    constructor(private _activateRoute:ActivatedRoute,private storageService:StorageService,
      private encrytDecryptService:EncryptionService,private modalService:NgbModal){
        this.targetDate.setHours(this.targetDate.getHours() + 3);
        this.targetDate.setMinutes(this.targetDate.getMinutes() + 30);
        this.targetTime = this.targetDate.getTime();
      }
    
    ngOnInit(): void { 
      
      this.userSessionData = this.storageService.getUserProfileDataFromSessionRes();
      // console.log(this.userSessionData)
      this.currentUrl = this._activateRoute.snapshot.url[0].path
      // console.log('http://localhost:5001/redirect-nsrs'+`?baseUrl=${window.location.origin}&mainUrl=${this.currentUrl}`)
      if(this._activateRoute.snapshot.queryParamMap.get('name') !=null){
        let name= this._activateRoute.snapshot.queryParamMap.get('name')
        let agen= this._activateRoute.snapshot.queryParamMap.get('gender')
        let adob= this._activateRoute.snapshot.queryParamMap.get('dob')
        let msgText =  this._activateRoute.snapshot.queryParamMap.get('message')
        let valueText =  this._activateRoute.snapshot.queryParamMap.get('value')
        // window.location.replace(window.location.origin+'/#/'+this.currentUrl)
        Swal.fire({
          icon:Number(valueText) == 1 ? 'success' : 'warning',
          text:`${msgText}`,
        })
      }    
    }
    ngAfterViewInit(): void {
      setInterval(()=>{
        this.difference = this.targetTime - this.nowTime;
        this.timeCal()
        // this.difference = this.difference / (1000 * 60 * 60 * 24);
        // !isNaN(this.days.nativeElement.innerText)
        // ? (this.days.nativeElement.innerText = Math.floor(this.difference / (1000 * 60 * 60 * 24)))
        // : (this.days.nativeElement.innerHTML = `<img src="https://i.gifer.com/VAyR.gif" />`);
      },1000)
    }
    timeCal(){
      this.date = new Date(new Date);
      this.nowTime = this.date.getTime();
      this.days = Math.floor(this.difference / (1000 * 60 * 60 * 24));
      this.hours = (Math.floor((this.difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
      this.minutes = Math.floor((this.difference % (1000 * 60 * 60)) / (1000 * 60));
      this.seconds = Math.floor((this.difference % (1000 * 60)) / 1000);
    }

    verifyAadhar(){
      // if(this.userSessionData.userData.role_id === 1) window.location.replace('http://localhost:5001/landing'+`?baseUrl=${window.location.origin}&mainUrl=${this.currentUrl}&role_id=${this.userSessionData.userData.role_id}&user_id=${this.userSessionData.userData.user_id}&jwtToken=${this.userSessionData.jwtToken}&sessionId=${this.userSessionData.sessionId}`)
      // let stateVal=`${window.location.origin,this.currentUrl,this.userSessionData.userData.role_id,this.userSessionData.userData.user_id}`
      let stateVal=this.userSessionData.userData.role_id+'_'+this.userSessionData.userData.user_id
      let encyVal = this.encrytDecryptService.encryptionAES(stateVal)
      // console.log(encyVal)
      //https://nsrs.kheloindia.gov.in/digilocker
      //http://192.168.23.254:105

      //production url
      // this.navigateUrl = `https://digilocker.meripehchaan.gov.in/public/oauth2/1/authorize?response_type=code&client_id=TZ041DAA02&redirect_uri=https://nsrs.kheloindia.gov.in/digilocker&state=${encyVal}&code_challenge=j7ArcsN1DD1SDHIUSsDOXaJkb6YVaUEDelo1wpempko&code_challenge_method=S256`
      // staging Url
      // this.navigateUrl = `https://digilocker.meripehchaan.gov.in/public/oauth2/1/authorize?response_type=code&client_id=US8F7809DD&redirect_uri=http://192.168.23.254:105&state=${encyVal}&code_challenge=j7ArcsN1DD1SDHIUSsDOXaJkb6YVaUEDelo1wpempko&code_challenge_method=S256`
      if(environment.digiLockerAadhaar=='production'){
        this.navigateUrl = `https://digilocker.meripehchaan.gov.in/public/oauth2/1/authorize?response_type=code&client_id=TZ041DAA02&redirect_uri=https://nsrs.kheloindia.gov.in/digilocker&state=${encyVal}&code_challenge=j7ArcsN1DD1SDHIUSsDOXaJkb6YVaUEDelo1wpempko&code_challenge_method=S256`
      }else{
        this.navigateUrl = `https://digilocker.meripehchaan.gov.in/public/oauth2/1/authorize?response_type=code&client_id=US8F7809DD&redirect_uri=http://192.168.23.254:105&state=${encyVal}&code_challenge=j7ArcsN1DD1SDHIUSsDOXaJkb6YVaUEDelo1wpempko&code_challenge_method=S256`
      }
      window.open(this.navigateUrl,'_blank')
    }

    viewAadhaar(){
       const modalRef = this.modalService.open(ViewAadhaarComponent,{size:'lg', centered:true,backdrop:'static'})
    }

    


}