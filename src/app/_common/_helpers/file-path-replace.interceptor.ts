import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable, Injector } from "@angular/core";
import { Observable, tap } from "rxjs";
import { AuthenticationService } from "../services/innerPagesServices/authentication.service";
import { environment } from "src/environments/environment";

@Injectable()

export class FilePathReplaceInterceptor implements HttpInterceptor{
    constructor(
        private injector:Injector
    ){}
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
			tap((response) => {
			  if (response instanceof HttpResponse && response.body) {
				response = response.clone({
				  body: this.replaceFileExtensions(response.body,req)
				});
			  }
			})
		  );
    }
    private replaceFileExtensions(data: any, request:any): any {
		let authService:any=this.injector.get(AuthenticationService)
		const fileExtensions = ['.jpg', '.png', '.pdf', '.jpeg', '.xlsx', '.xls','.csv'];
		// let sessionId = authService.getSessionId()
		let sessionId:any
		if(request.url.includes('GetSessionData')){
			sessionId = request.body.sessionId
		}else{
			sessionId = authService.getSessionId()
		}
	
		// Recursive function to traverse the object
		const traverse = (obj: any) => {
		  for (const key in obj) {
				if (obj.hasOwnProperty(key)) {
					const value = obj[key];			
					// If the value is a string and contains a file extension
					if (typeof value === 'string' && fileExtensions.some((ext) => value.toLowerCase().includes(ext))) {
						const extension = value.substring(value.lastIndexOf('.'));
						obj[key] = value.replace(extension, `${extension}?pd=${sessionId}&appId=${environment.encrAppId}`);
					}			
					// If the value is an object or array, recursively traverse it
					else if (typeof value === 'object' && value !== null) {
						traverse(value);
					}
				}
			}
		};
		traverse(data);
		return data;
	}
}