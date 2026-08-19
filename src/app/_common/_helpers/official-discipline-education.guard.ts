import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { CoachDashboardService } from '../services/role-inner-pages-services/coach-services/coach-dashboard.service';
import Swal, { SweetAlertResult } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class OfficialDisciplineEducationGuard implements CanActivate {

  constructor(private coachDashboardService: CoachDashboardService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if (this.coachDashboardService.getLoginUserData()?.has_recieved_discipline_specific_education !== null) return true;
      else {
        Swal.fire({
          title: 'ACCESS DENIED!',
          icon: 'warning',
          text: `Please upload ${
            this.coachDashboardService.getLoginUserData().role_id === 2 ? 'sports' : 'discipline'
          } specific education documents to open this page!`,
          showCancelButton: false,
          confirmButtonText: 'Okay',
          allowOutsideClick: false,
        })
          .then((result: SweetAlertResult<any>) => {
            this.router.navigate([`${this.coachDashboardService.getLoginUserData().role_id === 2 ? 'coach' : 'sport-scientist'}-dashboard`]);
          })
          .catch(() => {});
        return false;
      }
  }
  
}
