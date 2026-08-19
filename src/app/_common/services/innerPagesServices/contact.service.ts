import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Common } from '../../common';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor(private http:HttpClient) {}
 
  sendContact(data:any){
   return this.http.post(`${Common.APIUrl}Home/ContactUs`, data)
  }

}
