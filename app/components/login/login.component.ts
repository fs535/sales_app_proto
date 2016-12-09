/**
 * Created by SergejFilatov on 12/7/2016.
 */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
    selector: 'login-page',
    templateUrl: '/app/components/login/login.component.html'
})

export class LoginComponent implements OnInit {
    submitted:boolean = false;
    username:string = '';
    password:string = '';
    loading = false;
    message:String;

    constructor(
        private router: Router, private authenticationService: AuthenticationService) { }

    ngOnInit() {
        // reset login status
        this.authenticationService.logout();
    }

    isValid(value:string){
        return value != '';
    }

    performLogin() {

        this.message = null;

        this.submitted = true;
        if (!this.isValid(this.username) || !this.isValid(this.password)){
            return;
        }

        this.loading = true;

        this.authenticationService.login(this.username, this.password)
            .then((responseData) => {
                this.loading = false;

                this.authenticationService.isLoggedIn = true;
                // proceed further
                this.router.navigate([`..${this.authenticationService.redirectUrl}`]);
            }).catch((error) => {
                this.loading = false;

                let msg:any = error.json();
                this.message = msg.error + " : " + msg["error_description"];
            });
    }
}