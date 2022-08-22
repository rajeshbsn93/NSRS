import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
//import { EncryptionService } from '../services/encryption.service';
import { Common } from '../common/common';
import { CountingService } from '../services/counting.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  //constructor(private encryptt:EncryptionService) { }
countinData:any = [];

  constructor(private countingService:CountingService) { }

  user = {
    username: 'Rajesh',
    userpassword: 'jjh2355'
  }
 encryptPwd:any;
 decryptPwd:any;
 inp:any;

 
  ngOnInit(): void {
    this.keyPressNumber;
    this.getCounting();

  }

  async getCounting(){
    this.countingService.getCounting().subscribe((res:any) =>{
     this.countinData = res;
    })
  }

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: false,
    pullDrag: false,
    dots: true,
    navSpeed: 700,
    //navText: ['', ''],
    nav: false,
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
    
  }

  login(){
    console.log()
  }

  keyPressNumber(event:any){
    // this.inp = (event.which) ? event.which : event.keyCode;
    // // Only Numbers 0-9
    // if ((this.inp < 48 || this.inp > 57)) {
    //   event.preventDefault();
    //   console.log(this.inp)
    //   return false;
    // } else {
    //   return true;
    // }

    this.inp = String.fromCharCode(event.keyCode);
    // Allow numbers, alpahbets, space, underscore
    if (/[a-z.A-Z0-9-_ ]/.test(this.inp)) {
      console.log(this.inp)
      return true;
    } else {
      event.preventDefault();
      return false;
    }
    
    
  }
  encrypt(){
    this.encryptPwd = Common.Encrypt(this.user.userpassword)
  }
  decrypt(){
    this.decryptPwd = Common.Decrypt(this.encryptPwd)
  }
  

}
