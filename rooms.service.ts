import { Rooms } from "../_models/Rooms";
import { Observable } from "rxjs/Rx";
import { AuthHttp } from "angular2-jwt";
import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response } from "@angular/http";
import { Customers } from "../_models/Customers";

@Injectable()
export class RoomsService {
  baseUrlAvRooms = "http://localhost:5000/api/room/";
  baseUrlForAdminBooking="http://localhost:5000/api/CustomerBooking/";
  constructor(private authHttp: Http) {}

  getRooms(): Observable<Rooms[]> {
    return this.authHttp
      .get(this.baseUrlAvRooms + "available")
      .map(response => <Rooms[]>response.json())
      .catch(this.handleError);
  }
  updateStatusOfBookingByAdming(firstname:string,customer:Customers)
  {
    return this.authHttp
    .post(this.baseUrlForAdminBooking+firstname, customer, this.requestNewOptions())
    .catch(this.handleError);
    // return this.authHttp.put(this.baseUrlForAdminBooking+firstname,customer)
    // .catch(this.handleError);
  }

  private requestNewOptions() {
    const headers = new Headers({ "Content-type": "application/json" });
    return new RequestOptions({ headers: headers });
  }

  getUnavailableRooms(): Observable<Rooms[]> {
    return this.authHttp
      .get(this.baseUrlAvRooms + "unavailable")
      .map(response => <Rooms[]>response.json())
      .catch(this.handleError);
  }

  getAvRoomsByBed(numOfBeds): Observable<Rooms[]> {
    return this.authHttp
      .get(this.baseUrlAvRooms + "rommbybed/" + numOfBeds)
      .map(response => <Rooms[]>response.json())
      .catch(this.handleError);
  }

  getCustomers():Observable<Customers[]>
  {
    //manageCalendar
    return this.authHttp
      .get(this.baseUrlAvRooms + "manageCalendar")
      .map(response => <Customers[]>response.json())
      .catch(this.handleError);
  }

  getRoomStatus(dateOfArriving:Date,roomId:number): Observable<Customers>
  {
    return this.authHttp
    .get(this.baseUrlAvRooms + dateOfArriving+"/"+roomId)
    .map(response => <Customers>response.json())
    .catch(this.handleError);
  }

  getReservationNumberIfBookedSuccess(
    firstname: string,
    lastname: string,
    email: string
  ): Observable<Customers> {
    return this.authHttp
      .get(
        this.baseUrlAvRooms +
          "booksuccess/" +
          firstname +
          "/" +
          lastname +
          "/" +
          email
      )
      .map(response => <Customers>response.json())
      .catch(this.handleError);
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
