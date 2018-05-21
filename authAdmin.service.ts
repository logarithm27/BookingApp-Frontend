import { Customers } from '../_models/Customers';
import { Observable } from "rxjs/Rx";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Headers, Http, RequestOptions, Response } from "@angular/http";
import { Injectable } from "@angular/core";
import {tokenNotExpired , JwtHelper} from 'angular2-jwt';

@Injectable()
export class AuthAdminService {
  baseUrl = 'http://localhost:5000/api/AuthAdmin/';
  baseUrlBooking = 'http://localhost:5000/api/CustomerBooking/';
  userToken: any;
  customer:Customers;
    //Decode token to retrieve the username 
  decodedToken:any;
  jwtHelper: JwtHelper = new JwtHelper();
  constructor(private http: Http) {}
  login(model: any) {
    return this.http
      .post(this.baseUrl + "login", model, this.requestNewOptions())
      .map((response: Response) => {
        const user = response.json();
        if (user) {
          localStorage.setItem("token", user.tokenString);
          //Decoding token to retrive the username by token
          this.decodedToken=this.jwtHelper.decodeToken(user.tokenString);
          this.userToken = user.tokenString;
        }
      })
      .catch(this.handleError);
  }
  booking(model: any) {
    return this.http
      .post(this.baseUrlBooking + "booking", model, this.requestNewOptions())
      .catch(this.handleError);
  }
  loggedIn() {
    return tokenNotExpired("token");
  }
  private requestNewOptions() {
    const headers = new Headers({ "Content-type": "application/json" });
    return new RequestOptions({ headers: headers });
  }
  private handleError(error: any) {
    const applicationError = error.headers.get("Application-Error");
    if (applicationError) {
      return Observable.throw(applicationError);
    }
    const serverError = error.json();
    let modelStateErrors = "";
    if (serverError) {
      for (const key in serverError) {
        if (serverError[key]) {
          modelStateErrors += serverError[key] + "\n";
        }
      }
    }
    return Observable.throw(modelStateErrors || "Server error");
  }
}
