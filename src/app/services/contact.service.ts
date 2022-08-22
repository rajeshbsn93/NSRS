import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Common } from '../common/common';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor(private http:HttpClient) {}
 
  sendContact(data:any){
    debugger;
   return this.http.post(`${Common.APIUrl}Home/ContactUs`, data)
  }

}
