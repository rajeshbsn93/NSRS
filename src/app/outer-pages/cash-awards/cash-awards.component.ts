import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-cash-awards',
  templateUrl: './cash-awards.component.html',
  styleUrls: ['./cash-awards.component.css']
})
export class CashAwardsComponent implements OnInit {
  messageForm!:FormGroup;
  formSubmitted:boolean = false;
  namePattern: RegExp = new RegExp(/^[A-Za-z]+([a-zA-Z .-])*$/);
  emailPattern: string = '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$';
  mobilePattern:string = "^((\\+91-?)|0)?[0-9]{10}$";
  loader:boolean = false
  constructor(
    private fb:FormBuilder
  ) { }

  ngOnInit() {
    this.messageFormInit();
  }
  messageFormInit(){
    this.messageForm = this.fb.group({
      FullName:['', [Validators.required, Validators.pattern(this.namePattern)]],     
      email:['', [Validators.required, Validators.pattern(this.emailPattern)]],     
      phone :['', [Validators.required, Validators.pattern(this.mobilePattern)]],     
      message :['', Validators.required],     
    })
  }

  downloadManualList = [
    [
      {
        pdfIcon:'/assets/images/cash-reward-annual-report.svg',
        title:'How to register?',
        pdfLink:'/assets/pdf/cash-award/Registeration_Athlete_SupportStaff_Academy.pdf',
        linkText:'Read More'
      },
      {
        pdfIcon:'/assets/images/cash-reward-annual-report.svg',
        title:'How to update basic information?',
        pdfLink:'/assets/pdf/cash-award/Update Basic details on NSRS.pdf',
        linkText:'Read More'
      }
    ],
    [
      {
        pdfIcon:'/assets/images/cash-reward-annual-report.svg',
        title:'How to verify Aadhaar through DigiLocker?',
        pdfLink:'/assets/pdf/cash-award/Verify Aadhar on NSRS.pdf',
        linkText:'Read More'
      },
      {
        pdfIcon:'/assets/images/cash-reward-annual-report.svg',
        title:'How to update banking informatrion?',
        pdfLink:'javascript:void(0)',
        linkText:'Read More'
      }
    ],
    [
      {
        pdfIcon:'/assets/images/cash-reward-annual-report.svg',
        title:'How to map/link coaches with athletes?',
        pdfLink:'javascript:void(0)',
        linkText:'Read More'
      },
      {
        pdfIcon:'/assets/images/cash-reward-annual-report.svg',
        title:'How to nominate coaches for cash incentive scheme?',
        pdfLink:'javascript:void(0)',
        linkText:'Read More'
      }
    ],
  ]
  customOptions2: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['<', '>'],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 2
      },
      940: {
        items: 3
      }
    },
    nav: true
  }
  downloadDocumentList = [
    {
      pdfIcon:'/assets/images/my-reward-pdf.svg',
      title:'Revision of Scheme of Cash Awards',
      // pdfLink:'https://yas.nic.in/sites/default/files/Revision%20of%20Scheme%20of%20Cash%20Awards%20to%20Medal%20Winners%20In%20International%20Sports_0.pdf',
      pdfLink:'/assets/pdf/cash-award/Revision of Scheme of Cash Awards to Medal Winners In International Sports_0.pdf',
      viewText:'VIEW FILE'
    },
    {
      pdfIcon:'/assets/images/my-reward-pdf.svg',
      title:'Guidelines for quicker disbursal of cash incentive',
      pdfLink:'/assets/pdf/cash-award/Cash Award Scheme.pdf',
      viewText:'VIEW FILE'      
    }
  ]
  customOption3: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['<', '>'],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 2
      },
      940: {
        items: 2
      }
    },
    nav: true
  }
  customOption4: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
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
    nav: false,
  }
  keyupPhone(event:KeyboardEvent){
    // console.log(event)
    if(event.keyCode == 8 || event.keyCode == 0 || event.keyCode == 13){
      return null
    }else if(event.charCode >= 48 && event.charCode <= 57){
      return true
    }else{
      return false
    }
  }
  submitForm(){
    this.messageForm.updateValueAndValidity();
    this.formSubmitted = true
    if(this.messageForm.valid){
      console.log(this.messageForm.value)
    }else this.messageForm.markAllAsTouched();
  }
  

}
