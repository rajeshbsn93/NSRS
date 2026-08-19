import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ContactService } from 'src/app/_common/services/innerPagesServices/contact.service';
import { Subject, takeUntil } from 'rxjs';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { noJavaScriptValidator } from 'src/app/_common/validators/no-javascript.validator';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit, OnDestroy {
  submitted:boolean = false;
  contactForm!:UntypedFormGroup;
  namePattern: RegExp = new RegExp(/^[A-Za-z]+([a-zA-Z .-])*$/);
  emailPattern: string = '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$';
  mobilepattern:string = "^((\\+91-?)|0)?[0-9]{10}$";
  passwordPattern:string = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,}$";
  loaderMain:boolean = false;
  unSubscribeSubject:Subject<any> = new Subject()
//formData:any;

  constructor(private formBuilder:UntypedFormBuilder, private contactService:ContactService, private alertService: AlertService) { }

  ngOnInit(): void {
    this.contactForm = this.formBuilder.group({
      FullName: new UntypedFormControl('', [Validators.required, Validators.pattern(this.namePattern)]),
      EmailAddress: new UntypedFormControl('', [Validators.required, Validators.pattern(this.emailPattern)]),
      PhoneNo: new UntypedFormControl('', [Validators.required,Validators.pattern(this.mobilepattern)]),
      Message: new UntypedFormControl('',[Validators.required, noJavaScriptValidator()]),  
    }   
    )
  }

  get loginFormControl():{[key:string]:AbstractControl}{
    return this.contactForm.controls;
  }

  onSubmitForm(){
    this.submitted = true; 
    if(this.contactForm.invalid){
      this.alertService.swalPopWarning('The fields contains invalid or unsafe content. Please remove any code or scripting elements.')
      return;
    }
    //this.formData = this.contactForm.value;
    this.loaderMain = true
    this.contactService.sendContact(this.contactForm.value).pipe(takeUntil(this.unSubscribeSubject))
    .subscribe({
      next:(res:any)=>{
        this.loaderMain = false
        if(res > 0){
          this.contactForm.reset();
          this.alertService.swalPopSuccessTimer('You have successfully submitted your query. We will Contact You Soon!');
          this.submitted = false;
        }
      },
      error:(error)=>{
        console.error("error caught in submit contact")
        this.loaderMain=false  
      }
    });
    
     
    
  }

  ngOnDestroy(): void {
    this.unSubscribeSubject.unsubscribe();    
  }


  

}
