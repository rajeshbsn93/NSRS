import { Injectable, TemplateRef } from '@angular/core';
import { HttpRequest,	HttpHandler, HttpEvent,	HttpInterceptor,	HttpErrorResponse} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from '../services/common-services/alert.service';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
	constructor(
		private _router: Router,private swalAlert:AlertService,
		private modalService:NgbModal,
	) { }
	msg: any
	intercept(
		request: HttpRequest<any>,
		next: HttpHandler
	): Observable<HttpEvent<any>> {
		return next.handle(request).pipe(
			catchError((err) => {
				if(err instanceof HttpErrorResponse){}
				if (err.status === 401 
					// || err.status === 403 || err.status === 503
					) {
					
					// err.error.errors.forEach(
					// 	(element: { message: string | TemplateRef<any>; }) => {
					// 		// this.toast.show(element.message, { delay: 10000 });
					// 		this.msg = element.message
					// 		console.log(this.msg,'logout msg')
					// 		this.swalAlert.swalPopError('Session Time Out. Please Login Again!!')
					// 		this._router.navigate(['/login'])
					// 	}
					// );
					this.swalAlert.swalPopError('Session Time Out. Please Login Again!!')
					 localStorage.clear()
					 this._router.navigate(['/pagenotFound']);
					 this.modalService.dismissAll();
				} 
				else if (err.status === 0) {
					/* Api Connection Refused*/
					this.swalAlert.swalPopError('Something Went Wrong. Please Try Again!!')
					// localStorage.clear()
					// this._router.navigate(['/login']);
					// this.modalService.dismissAll();
				}
				 else if (err.status === 404) {
					// this.toast.show('Not Found', { delay: 10000 });
					// this.swalAlert.swalPopError('Not Found!')
					// localStorage.clear()
					// this._router.navigate(['/pagenotFound']);
					// this.modalService.dismissAll();
				}
				else if (err.status === 420) {
					/*IF user logined with another session */
					this.swalAlert.swalPopErrorTimer('User Login with Another session')
					this._router.navigateByUrl('/home');
					localStorage.clear();
					this.modalService.dismissAll();
				}
				else if (err.status === 421) {
					/*IF user logined with another session */
					this.swalAlert.swalPopErrorTimer('User Login with Another session')
					this._router.navigateByUrl('/home');
					localStorage.clear();
					this.modalService.dismissAll();
				}
				else if (err.status === 500 || err.status === 400) {
					// this.swalAlert.swalPopError('Internal Server Error (Bad Request).')
					// this._router.navigateByUrl('/home');
					// localStorage.clear()
					// this.modalService.dismissAll();
				}
				else {
					this.swalAlert.swalPopErrorTimer('An error occurred. If the problem persists please contact Administrator')
					this._router.navigateByUrl('/home');
					// localStorage.clear();
					this.modalService.dismissAll();
				}
				return throwError(err);
				throw err;
			})
		);
	}
}
