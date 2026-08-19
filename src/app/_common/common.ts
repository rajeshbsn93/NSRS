import { environment } from "src/environments/environment";
import * as CryptoJS from "crypto-js";

export class Common {

    public static APIUrl:string = environment.apiURL;

    public static Encrypt(value: string): string {
        let _key = CryptoJS.enc.Utf8.parse(environment.enc_Key);
        let _iv = CryptoJS.enc.Utf8.parse(environment.ency_iv);
        let encrypted = CryptoJS.AES.encrypt(value, _key, {
          iv: _iv,
          mode: CryptoJS.mode.CBC,
        }).toString();
        return encrypted;
      }
      public static Decrypt(value: string): string {
        let _key = CryptoJS.enc.Utf8.parse(environment.enc_Key);
        let _iv = CryptoJS.enc.Utf8.parse(environment.ency_iv);
        let decrypt = CryptoJS.AES.decrypt(value, _key, {
          iv: _iv,
          mode: CryptoJS.mode.CBC,
        }).toString(CryptoJS.enc.Utf8);
        return decrypt;
      }
}
