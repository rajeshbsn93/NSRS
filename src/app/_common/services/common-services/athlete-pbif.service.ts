import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AthletePbifService {

constructor(private http:HttpClient) { }

atheltePBIF(PlayerDetailId:number){
  return this.http.get<boolean>(`${environment.apiURL}Athlete/IsAtheltePBIF?PlayerDetailId=${PlayerDetailId}`)
}
}
