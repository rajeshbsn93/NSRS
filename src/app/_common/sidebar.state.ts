import { inject, Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { StorageService } from "./services/common-services/storage.service";

@Injectable({
    providedIn:"root"
})

export class SideBarNavStateService{

    private _storage = inject(StorageService)
    private _academySideBar$ :BehaviorSubject<any> = new BehaviorSubject('')
    readonly academySideBar = this._academySideBar$.asObservable()

    SetAcademyDetailData(data:any){
        let response:LoginUserData =  this._storage.getUserProfileDataFromSessionRes()
        if (response.userData.role_name =='Athlete' ||
          response.userData.role_name?.toLowerCase() =='coach' ||
          response.userData.role_name?.toLowerCase() =='sportsscientist' ||
          response.userData.role_id == 4 ||
          response.userData.role_id == 3 ||
          response.userData.role_id == 1006 ||
          response.userData.role_id == 666 ||
          response.userData.role_id == 112
        ) {
          response.profileData.fullName = data.name;
          response.userData.name = data.name;
        }else {
          response.profileData.fullName = data.academyName;
          response.userData.name = data.academyName
        }
        localStorage.setItem('sessiondata',
            JSON.stringify(response)
          );
        this._academySideBar$.next(data)
    }

}

export interface AcademyBasicDetail {
    type:string,
    registrationNo:string
    status:string
    academyName:string
    year:string
}


export interface LoginUserData {
    userData: UserData
    profileData: ProfileData
    expiryTime: string
    sessionId: string
    alreadyLoggedIn: boolean
    jwtToken: string
  }
  
  export interface UserData {
    name: string
    username: string
    nsrs_id: string
    user_id: number
    role_id: number
    role_name: string
    isStake_Holder: boolean
    dashboard: string
    allowedApps: string
    redirection: string
  }
  
  export interface ProfileData {
    fullName: string
    designation: string
    gender: string
    date_of_birth: any
    profile_photo: any
    sport_id: string
    sport_name: string
    mobileNo: string
    emailId: string
    fullAddress: string
    city: string
    state: string
    pincode: any
    postedLocation: string
    postedSince: any
  }
  