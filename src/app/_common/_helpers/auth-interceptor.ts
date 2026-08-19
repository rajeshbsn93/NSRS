import { HttpErrorResponse, HttpInterceptor } from '@angular/common/http';
import { Injectable,Injector } from '@angular/core';
import { catchError, EMPTY} from 'rxjs';
import { AuthenticationService } from '../services/innerPagesServices/authentication.service';
import { EncryptionService } from '../services/innerPagesServices/encryption.service';



@Injectable()
export class AuthInterceptor implements HttpInterceptor {

	constructor(private injector:Injector) { }

	intercept(req:any,next:any) {
		let authService:any=this.injector.get(AuthenticationService)
		let encryptionService = this.injector.get(EncryptionService)
		let token=JSON.parse(authService.getToken());
		let tokenizedReq=req.clone({
			setHeaders:{
				authorization:`Bearer ${token}`,
				sessionId: authService.getSessionId(),
				Loggedin_user:`${authService.getLoggedInUser()?.user_id ? authService.getLoggedInUser()?.user_id : null}`,
				Loggedin_role: `${authService.getLoggedInUser()?.role_id ? authService.getLoggedInUser()?.role_id : null}`,
				pmatsemit:encryptionService.encryptionAES(Date.now()),
				'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'

			}
		});
		return next.handle(tokenizedReq)
		// .pipe(catchError((error: HttpErrorResponse) => {
		// 	console.log(error, error.status);
		// 	return EMPTY;
		// }))
		
	}	
}
