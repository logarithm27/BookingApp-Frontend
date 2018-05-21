import { Router } from '@angular/router';
import { AlertifyService } from '../_services/alertify.service';
import { AuthAdminService } from "../_services/authAdmin.service";
import { Component, EventEmitter, OnInit, Output } from "@angular/core";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  model: any = {};
  constructor(private authService: AuthAdminService, private alertMessage:AlertifyService,
  private router:Router) {}

  ngOnInit() {}
  login() {
    this.authService.login(this.model).subscribe(
      data => {
        this.alertMessage.success("logged in successfully");
      },
      error => {
        this.alertMessage.error("failed to login");
      },
      ()=>
      {
        this.router.navigate(['/manage']);
      }
    );
  }
  logout() {
    this.authService.userToken = null;
    localStorage.removeItem("token");
    this.alertMessage.message("logged out");
    this.router.navigate(['/home']);
  }
  loggedIn() {
    return this.authService.loggedIn();
  }
}
