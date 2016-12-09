/**
 * Created by SergejFilatov on 12/7/2016.
 */
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router, private authService: AuthenticationService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        let url: string = state.url;

        return this.checkLogin(url);
    }

    checkLogin(url: string): boolean {

        if (this.authService.isLoggedIn)
        {
            return true;
        }

        // Store the attempted URL for redirecting
        this.authService.redirectUrl = url;

        // Navigate to the login page
        this.router.navigate(['/login']);

        return false;
    }
}