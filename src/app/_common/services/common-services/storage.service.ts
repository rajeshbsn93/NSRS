import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs'
@Injectable({
  providedIn: 'root'
})

export class StorageService{
    private menuData = new BehaviorSubject("")
    menuData$ = this.menuData.asObservable();
    data:any
    temp:any
    constructor(){}

    getUserDetails(){
      return 'loginUserdata' in localStorage && localStorage.getItem('loginUserdata')
      ? JSON.parse(localStorage.getItem('loginUserdata')!)
      : null;
    }

    getAcademyDetails(){
      this.temp = localStorage.getItem('sessiondata');
      var tempData = JSON.parse(this.temp);
      this.temp=tempData.userData
      return this.temp
    }

    getUserProfileDataFromSessionRes(){
      this.temp=localStorage.getItem('sessiondata');
      this.temp=JSON.parse(this.temp)
      return this.temp
    }

    getState(){
      return this.menuData.getValue()
    }

    getUserPermissions() {
      return 'userPermissions' in localStorage && localStorage.getItem('userPermissions')
      ? JSON.parse(localStorage.getItem('userPermissions')!)
      : null;
    }

    //receive menu data from sidebar component and send to another components (currently in 4 components getting from getDashboardMenu() service)
    sendMenuData(data:any){
        this.menuData.next(data)
    }

    setState(data:any){
      localStorage.setItem('menuData',JSON.stringify(data))
    }
    
    newGetState(){
      let data:any = localStorage.getItem('menuData')
      if(data=="undefined"){
        // return JSON.parse(data)
      }else{
        return JSON.parse(data)
      }
    }


}

export interface IUserDetails {
  name: string
  username: string
  nsrs_id: any
  user_id: number
  role_id: number
  role_name: string
  isStake_Holder: boolean
  isSuper_Admin: boolean
  dashboard: string
  allowedApps: string
  redirection: string
}


export interface IKICRoleId{
  kic:82,
  state:1005,
  rc:46,
  ho:68
}