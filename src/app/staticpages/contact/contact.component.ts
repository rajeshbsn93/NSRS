import { Component, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ContactService } from 'src/app/services/contact.service';
import { ConfirmValidator } from '../customvalidator';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  submitted:boolean = false;
  contactForm!:UntypedFormGroup;
  namePattern: RegExp = new RegExp(/^[A-Za-z]+([a-zA-Z .-])*$/);
  emailPattern: string = '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$';
  mobilepattern:string = "^((\\+91-?)|0)?[0-9]{10}$";
  passwordPattern:string = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,}$";
//formData:any;

  constructor(private formBuilder:UntypedFormBuilder, private contactService:ContactService) { }

  ngOnInit(): void {
    this.contactForm = this.formBuilder.group({
      FullName: new UntypedFormControl('', [Validators.required, Validators.pattern(this.namePattern)]),
      EmailAddress: new UntypedFormControl('', [Validators.required, Validators.pattern(this.emailPattern)]),
      PhoneNo: new UntypedFormControl('', [Validators.required, Validators.pattern(this.mobilepattern)]),
      Message: new UntypedFormControl(''),  
    }   
    )
  }

  get loginFormControl():{[key:string]:AbstractControl}{
    return this.contactForm.controls;
  }

  onSubmitForm(){
    this.submitted = true; 
    if(this.contactForm.invalid){
      return;
    }
    //this.formData = this.contactForm.value;
    this.contactService.sendContact(this.contactForm.value).subscribe((res)=>{
      if(res > 0){
        this.contactForm.reset();
        Swal.fire({
          position: 'center',
          icon: 'success',
          text: 'You have successfully submitted your query. We will Contact You Soon!',
          showConfirmButton: false,
          timer: 1500
        });
        this.submitted = false;
      }
      //return res;
    });
    
     
    
  }


  

}
