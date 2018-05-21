import { AlertifyService } from '../_services/alertify.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthAdminService } from '../_services/authAdmin.service';

@Injectable()
export class AdminauthGuard implements CanActivate {
  constructor(private authService : AuthAdminService,private router:Router,private alertify:AlertifyService){

  }
  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    if(this.authService.loggedIn()){
      return true;
    }
    this.router.navigate(['/home']);
    return false;
  }
  
}
