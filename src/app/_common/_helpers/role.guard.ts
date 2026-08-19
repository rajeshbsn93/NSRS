import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { catchError, first, map, Observable, of } from 'rxjs';
import { StorageService } from '../services/common-services/storage.service';
import { AuthenticationService } from '../services/innerPagesServices/authentication.service';

@Injectable({
  providedIn: 'root'
})


export class RoleGuard implements CanActivate {
  
  constructor(private storageService:StorageService, private authenticateService: AuthenticationService, private router: Router) {}
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if (this.storageService.getUserPermissions()?.some((item: any) => item === route?.url?.[0]?.path)) return true;
      else return this.authenticateService.getDashboardMenu(this.storageService.getUserDetails().role_id).pipe(first(), map((res: any) => {
        if (res.map((item: any) => item.menu_component).some((item: any) => item === route?.url?.[0]?.path)) return true;
        else {
          this.router.navigate(['/home']);
          return false;
        }
      }),
      catchError(() => {
        this.router.navigate(['/home']);
        return of(false);
      })
      )
  }
}
