/* 
Maftoul Omar (c)
MIT LICENCE.
*/
import { RoomComponent } from "../room/room.component";
import { ActivatedRoute } from "@angular/router";
import { AlertifyService } from "../_services/alertify.service";
import { RoomsService } from "../_services/rooms.service";
import { Rooms } from "../_models/Rooms";
import { Reservation } from "../_models/Reservation";
import { Customers } from "../_models/Customers";
import { BsDatepickerConfig } from "ngx-bootstrap";
import { AuthAdminService } from "../_services/authAdmin.service";
import { Component, EventEmitter, OnInit, Output, Input } from "@angular/core";
import { ICountry, CountryPickerService } from "ngx-country-picker";
import { FormGroup, FormControl, Validators } from "@angular/forms";


@Component({
  selector: "app-booking",
  templateUrl: "./booking.component.html",
  styleUrls: ["./booking.component.css"]
})
export class BookingComponent implements OnInit {
  model: any = {};
  model2: any = {};
  @Output() cancelBooking = new EventEmitter();
  minDate: Date;
  maxDate: Date;
  bsConfig: Partial<BsDatepickerConfig>;
  customer: Customers;
  reservation: Reservation;
  @Input() room: Rooms;
  rooms: Rooms[];
  @Output() roomCheckedBookingComp: boolean = false;
  roomId: number;
  roomName: string;
  roomPrice: number;
  value1: any = 0;
  days: number;
  bookingSuccess: boolean = false;
  customerLeavingIfTaken: Date;
  taken: boolean = false;
  customers: Customers[];
  secondMinDate: Date;
  images:HTMLImageElement[];
  image:HTMLImageElement;
  modalView:boolean=false;
  country:string;
  bookingForm:FormGroup;
  useOnlySpecialCharacters = /^[a-zA-Z0-9]*$/;
  maxNumOfBeds:number;
  numberOfPersonsAllowed:number[];
  
  public countries: any[];
  constructor(
    private authService: AuthAdminService,
    private roomService: RoomsService,
    private alertify: AlertifyService,
    private route: ActivatedRoute
  ) {
    this.minDate = new Date();
    this.minDate.setDate(this.minDate.getDate());
    this.bsConfig = Object.assign({}, { containerClass: "theme-orange" });
  }

  ngOnInit() {
    this.roomService.getMaxNumberOfBeds().subscribe(
      (MxNumberOfBeds : number)=>
      {
        this.initializeMaxOfBeds(MxNumberOfBeds);
      },
      error=>
      {
        this.alertify.error(error);
      }
    )
  }

  initializeMaxOfBeds(maxNumOfBeds:number)
  {
    this.maxNumOfBeds=maxNumOfBeds;
    this.numberOfPersonsAllowed=[];
    for(var i=1;i<=this.maxNumOfBeds;i++)
    {
      this.numberOfPersonsAllowed.push(i);
    }
  }

  firemindate() {
    this.secondMinDate = new Date(
      this.model.dateOfArriving.getTime() + 1000 * 60 * 60 * 24
    );
  }

  changedDay()
  {
    //this.loadRoomsByPersons(this.value1);
    if(this.model.dateOfArriving!=null &&  this.model.dateOfLeaving!=null)
    {
      
      this.firemindate();
      this.daysBetween(this.model.dateOfArriving, this.model.dateOfLeaving);
      if(this.days < 0 )
      this.days=0;   
     if( this.roomCheckedBookingComp === true)
     {
      this.laodCustomers(this.model.dateOfArriving, this.room.id);
     }
    }       
    //console.log(date);
  }
  loadReservationNumberIfBookedSuccess(
    firstname: string,
    lastname: string,
    email: string
  ) {
    this.roomService
      .getReservationNumberIfBookedSuccess(firstname, lastname, email)
      .subscribe(
        (customer: Customers) => {
          this.customer = customer;
          setTimeout((this.bookingSuccess = !this.bookingSuccess), 5000);
          // console.log(this.customer.phoneNumber);
          // this.bookingSuccess=!this.bookingSuccess;
        },
        error => {
          this.alertify.error(error);
        }
      );
  }

  daysBetween(date1: Date, date2: Date) {
    //Get 1 day in milliseconds
    var one_day = 1000 * 60 * 60 * 24;

    // Convert both dates to milliseconds
    var date1_ms = date1.getTime();
    var date2_ms = date2.getTime();

    // Calculate the difference in milliseconds
    var difference_ms = date2_ms - date1_ms;

    // Convert back to days and return
    this.days = Math.round(difference_ms / one_day);
  }

  booking() {
    this.model.price = (this.roomPrice * this.days);
    this.authService.booking(this.model).subscribe(
      () => {
        // this.model2=this.model;
        console.log("Booked !");
        this.loadReservationNumberIfBookedSuccess(
          this.model.firstname,
          this.model.lastname,
          this.model.email
        );
        this.daysBetween(this.model.dateOfArriving, this.model.dateOfLeaving);
        window.scrollTo(0, 0);
        //   setTimeout(function(){console.log("yes");},3000);
      },
      error => {
        if(this.roomCheckedBookingComp===false)
        {
          this.alertify.error("You Should select a room ! Please Select A Room");
        }
        if(this.days===0 || this.days < 0)
        {
          this.alertify.error("Please Select a Valid Date");
        }
        console.log(error);
      }
    );
    // this.loadReservationNumberIfBookedSuccess(this.model.firstname,this.model.lastname,
    //   this.model.email);
  }
  cancel() {
    this.cancelBooking.emit(false);
    console.log("cancelled");
  }

  callType(value) {
    this.loadRoomsByPersons(value);
    this.value1 = value;
    this.daysBetween(this.model.dateOfArriving, this.model.dateOfLeaving);
    this.taken = false;
  }

  callCountry(country)
  {
    this.model.countryOfOrigin=country;
  }

  selectRoom(room: any) {
    this.roomCheckedBookingComp = !this.roomCheckedBookingComp;
    this.room = room;
    console.log(this.room.id);
    if (this.roomCheckedBookingComp == true) {
      this.rooms = [this.room];
      this.model.roomId = this.room.id;
      this.roomName = this.room.nameOfChambre;
      this.roomPrice = this.room.price;
      this.model.numberOfClient = this.value1;
      this.laodCustomers(this.model.dateOfArriving, this.room.id);
    }
    if (this.roomCheckedBookingComp == false) {
      if (this.value1 != 0) {
        this.loadRoomsByPersons(this.value1);
        this.taken = false;
      }
    }
  }

  laodCustomers(date: Date, roomid: number) {
    let dateofcustomer: Date;
    this.roomService.getCustomers2().subscribe(
      (customers: Customers[]) => {
        this.customers = customers;
        for (let cust of customers) {
          //if(cust.dateOfArriving===date && cust.roomId==roomid)
          var datecustom = new Date(cust.dateOfArriving);
          var datecustomleaving = new Date(cust.dateOfLeaving);
          var sameDay = date.getDate() === datecustom.getDate();
          var sameMonth = date.getMonth() === datecustom.getMonth();
          var sameYear = date.getFullYear() === datecustom.getFullYear();
          var sameDate =
            sameDay === true && sameMonth === true && sameYear === true;
          //If date choosen is between a range of days of a booked room
          if (
            date > datecustom &&
            date < datecustomleaving &&
            cust.roomId === roomid
          ) {
            this.customerLeavingIfTaken = cust.dateOfLeaving;
            this.taken = !this.taken;
            break;
          }
          //If date choosen equals to an existing booked room
          if (sameDate && cust.roomId === roomid) {
            this.customerLeavingIfTaken = cust.dateOfLeaving;
            this.taken = !this.taken;
            break;
          }
          if(sameDate===false)
          {
            this.taken=false;
          }
        }
      },
      error => {
        this.alertify.error(error);
      }
    );
  }

  //Unique Customer
  loadRoomsByPersons(num: number) {
    this.roomService.getAvRoomsByBed(num).subscribe(
      (rooms: Rooms[]) => {
        this.rooms = rooms;
      },
      error => {
        this.alertify.error(error);
      }
    );
  }

  carousel(url:string,nameOfChambre:string) {
    var modal = document.getElementById('myModal') as HTMLElement;

    // Get the image and insert it inside the modal - use its "alt" text as a caption
    let image:HTMLImageElement;
    let modalImg = document.getElementById("img01") as HTMLImageElement;
    var captionText = document.getElementById("caption");
    modal.style.display = "block";
    modalImg.src = url;
    captionText.innerHTML = nameOfChambre;
    
    
    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0] as HTMLElement;
    
    // When the user clicks on <span> (x), close the modal
    span.onclick = function() { 
      modal.style.display = "none";
    }
    modal.onclick = function() { 
      modal.style.display = "none";
    }
  }

print()
{
    var printButton = document.getElementById("printbutton") as HTMLImageElement;
    var alertinfo = document.getElementById("alertinfo") as HTMLImageElement;
    var layer = document.getElementById("Layer_1") as HTMLImageElement;
        //Set the print button visibility to 'hidden' 
    printButton.style.visibility = 'hidden';
    alertinfo.style.visibility = 'hidden';
    layer.style.visibility = 'hidden';
    (window as any).print();
    printButton.style.visibility = 'visible';
    alertinfo.style.visibility = 'visible';
    layer.style.visibility = 'visible';
}
}
