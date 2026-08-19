import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable()
 export class FilePathExcludeInterceptor implements HttpInterceptor{

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let instanceBody = req.body instanceof FormData
        
        if ((req.method.includes("POST") || req.method.includes("post")) && !instanceBody) {
            const modifiedRequest = req.clone({
              body: this.removeSessionIdUploadFile(req.body)
            });
      
            return next.handle(modifiedRequest);
        }
        return next.handle(req)
    }
    private removeSessionIdUploadFile(data:any){
        const fileExtensions = ['.jpg', '.png', '.pdf', '.jpeg', '.xlsx', '.xls','.csv']
        // Recursive function to traverse the object
        const traverse = (obj:any)=>{
          for(const key in obj){
            if(obj.hasOwnProperty(key)){
                const value = obj[key]
                // If the value is a string and contains a file extension and contains ?pd
                if(typeof value === 'string' && fileExtensions.some((ext)=>value.toLocaleLowerCase().includes(ext)) && value.includes('?pd')){
                    obj[key] =  value.split('?pd')[0]   
                }
                // If the value is an object or array, recursively traverse it
                else if(typeof value === 'object' && value !=null){
                    traverse(value)
                }
            }
          }  
        }
        traverse(data)
        return data
    }
 } 
 