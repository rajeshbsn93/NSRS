import { Injectable } from '@angular/core';
import * as CryptoTs from 'crypto-js'

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {

  constructor() { }

  encryptionAES (plainText:any) {
    const encryptpassword = CryptoTs.AES.encrypt(plainText, '7739826323491690');
    return encryptpassword.toString();
  }

  decryptionAES(encryptedText:any){

    const decryptpassword = CryptoTs.AES.decrypt(encryptedText, '7739826323491690');
    const origionalText = decryptpassword.toString(CryptoTs.enc.Utf8);
    return origionalText;

  }
  
}
