import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GenerateCaptchaService {
  captchaText = '';
  possibleCaptcha = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
   
  constructor() { }

  public makecaptcha() {
    for (var i = 0; i < 5; i++){
    this.captchaText += this.possibleCaptcha.charAt(Math.floor(Math.random() * this.possibleCaptcha.length));
  }  
  return this.captchaText
}
public refreshcaptha(){
  this.captchaText = '';
  return this.makecaptcha();
}
}
