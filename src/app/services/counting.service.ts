import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Common } from '../common/common';

@Injectable({
  providedIn: 'root'
})
export class CountingService {

  constructor(private http:HttpClient) { }

  getCounting(){
    return this.http.get(`${Common.APIUrl}Home/Get`);
  }
} 
