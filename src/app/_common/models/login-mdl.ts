export class LoginMdl {
    username! :string;
    password! :string;
    captcha!:string;
    token?: string;
}

export class loginAccessToken{
acces_token: string = '';
refresh_token:string = '';
expires:number = 0;
}

