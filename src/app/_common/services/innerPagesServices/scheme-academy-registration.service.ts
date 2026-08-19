import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn:'root'
})

export class SchemeAcademyRegistrationService{
    constructor(private http:HttpClient){}
    schemeAcademyRegistration(user_display_name:string,email:string,enc_email:string,mobile:string,stateId:number,
        yearOfEstablishment:number,password:string,sportId:string,academyRole:number,username:string,mappedUser:number){
            return this.http.post<SchemeRegistrationEntity>(`${environment.apiURL}Registration/SchemeAcademyRegistration`,{
                user_display_name,email,enc_email,mobile,stateId,yearOfEstablishment,password,sportId,academyRole,username,
                mappedUser
            })
        }
}
export interface SchemeRegistrationEntity {
    user_display_name: string
    email: string
    enc_email: string
    mobile: string
    stateId: number
    yearOfEstablishment: number
    password: string
    sportId: string
    academyRole: number
    username: string
    mappedUser:number
    }