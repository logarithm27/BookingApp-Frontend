import { ActivatedRoute } from "@angular/router";
import { AlertifyService } from "../_services/alertify.service";
import { RoomsService } from "../_services/rooms.service";
import { Rooms } from "../_models/Rooms";
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  Output,
  EventEmitter,
  ElementRef
} from "@angular/core";
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent
} from "angular-calendar";
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours
} from "date-fns";
import { Subject } from "rxjs/Subject";
import { Customers } from "../_models/Customers";
import { AuthAdminService } from "../_services/authAdmin.service";

const colors: any = {
  red: {
    primary: "#ad2121",
    secondary: "#FAE3E3"
  },
  blue: {
    primary: "#1e90ff",
    secondary: "#D1E8FF"
  },
  yellow: {
    primary: "#e3bc08",
    secondary: "#FDF1BA"
  }
};

@Component({
  selector: "app-manage",
  templateUrl: "./manage.component.html",
  styleUrls: ["./manage.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManageComponent implements OnInit {
  rooms: Rooms[];
  customers: any[];
  events: CalendarEvent[] = [];
  availabilityCicked: boolean = false;
  loadedRoomsAvailability: number = 0;
  imgString: string;
  imgAlt: string = "Disponible";
  imgAltUnav: string = "Non Disponible";
  imgStrings: string[] = [];
  redColor: boolean;
  greenColor: boolean = false;
  rColor: number = 0;
  availableToUnAvailable: boolean = false;
  unAvailableToAvailable: boolean = false;
  admin: Customers;
  availableTabActive: boolean = false;
  constructor(
    private roomService: RoomsService,
    private alertify: AlertifyService,
    private route: ActivatedRoute,
    private authService: AuthAdminService
  ) {}

  ngOnInit() {
    this.loadAvRooms();
    this.getCustomersToPopulateCalendar();
  }
  getCustomersToPopulateCalendar() {
    this.roomService.getCustomers().subscribe(
      (customers: Customers[]) => {
        this.customers = customers;
        //console.log(customers[1].firstName);
        this.addEvent(customers);
      },
      error => {
        this.alertify.error(error);
      }
    );
  }
  Availability() {
    this.availabilityCicked = true;
  }
  getCustomersToPopulateCalendar2(date: Date, roomId: number) {
    this.imgStrings = [];
    this.redColor = false;
    for (let cust of this.customers) {
      var datecustom = new Date(cust.dateOfArriving);
      var datecustomleaving = new Date(cust.dateOfLeaving);
      if (cust.roomId === roomId) {
        var sameDay = date.getDate() === datecustom.getDate();
        var sameMonth = date.getMonth() === datecustom.getMonth();
        var sameYear = date.getFullYear() === datecustom.getFullYear();
        var sameDate =
          sameDay === true && sameMonth === true && sameYear === true;
        if (sameDate === true && cust.numberOfChildren===1) {
          this.imgString = "assets/images/bedfalse.png";
          this.redColor = true;
          return this.imgString;
        }
        if (date > datecustom && date < datecustomleaving && cust.numberOfChildren===1) {
          this.imgString = "assets/images/bedfalse.png";
          this.redColor = true;
          return this.imgString;
        }
      }
    }
  }

  getCustomersToPopulateCalendar3(date: Date, roomId: number) {
    this.redColor = false;
    for (let cust of this.customers) {
      var datecustom = new Date(cust.dateOfArriving);
      var datecustomleaving = new Date(cust.dateOfLeaving);
      if (cust.roomId === roomId) {
        var sameDay = date.getDate() === datecustom.getDate();
        var sameMonth = date.getMonth() === datecustom.getMonth();
        var sameYear = date.getFullYear() === datecustom.getFullYear();
        var sameDate =
          sameDay === true && sameMonth === true && sameYear === true;
        if (sameDate === false && cust.numberOfChildren===0) {
          this.imgString = "assets/images/bedtrue.png";
          this.redColor = false;
          return this.imgString;
        }
      }
      if (cust.roomId !== roomId) {
        this.imgString = "assets/images/bedtrue.png";
        this.redColor = false;
        return this.imgString;
      }
    }
  }

  view: string = "month";

  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  refresh: Subject<any> = new Subject();

  activeDayIsOpen: boolean = true;
  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
        this.viewDate = date;
      }
    }
  }
  eventTimesChanged({
    event,
    newStart,
    newEnd
  }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.handleEvent("Dropped or resized", event);
    this.refresh.next();
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
  }

  addEvent(customers: any[]): void {
    for (let customer of customers) {
      if (customer.lastName !== "ADMIN") {
        this.events.push({
          title:
            customer.firstName +
            " " +
            customer.lastName +
            "'s Arriving \n: Room N° " +
            customer.roomId +
            "\n" +
            "country of origin : " +
            customer.countryOfOrigin,
          start: startOfDay(customer.dateOfArriving),
          color: colors.blue,
          draggable: false,
          resizable: {
            beforeStart: true,
            afterEnd: true
          }
        });
        this.refresh.next();
        this.events.push({
          title:
            customer.firstName +
            " " +
            customer.lastName +
            "'s Leaving \n: Room N° " +
            customer.roomId +
            "\n" +
            "country of origin : " +
            customer.countryOfOrigin,
          start: startOfDay(customer.dateOfLeaving),
          color: colors.red,
          draggable: false,
          resizable: {
            beforeStart: true,
            afterEnd: true
          }
        });
        this.refresh.next();
      }
    }
  }

  loadAvRooms() {
    this.roomService.getRooms().subscribe(
      (rooms: Rooms[]) => {
        this.rooms = rooms;
      },
      error => {
        this.alertify.error(error);
      }
    );
  }

  displayDate1(date: Date, roomId: number) {
    console.log(this.customers);
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    for (let cust of this.customers) {
      if (cust.roomId === roomId) {
        console.log(cust.firstName);
        console.log( "ADMIN" +
        new Date(date).toLocaleString('en-US',options).replace(/\s+/g, '').replace(/,/g, '').toUpperCase() +
        new Date(date.getTime() + 1000 * 60 * 60 * 24).toLocaleString('en-US',options).replace(/\s+/g, '').replace(/,/g, '').toUpperCase());
        if (
          cust.firstName ===
          "ADMIN" +
            new Date(date).toLocaleString('en-US',options).replace(/\s+/g, '').replace(/,/g, '').toUpperCase() +
            new Date(date.getTime() + 1000 * 60 * 60 * 24).toLocaleString('en-US',options).replace(/\s+/g, '').replace(/,/g, '').toUpperCase()
        ) {
          //Update numberOfChildren to Zero then return
          cust.numberOfChildren=0;
          this.roomService
            .updateStatusOfBookingByAdming(cust.firstName, cust)
            .subscribe(
              next => {
                console.log("test");
              },
              error => {
                this.alertify.error(error);
              }
            );
            this.alertify.success(roomId + " Available for " + date.toLocaleDateString('en-US',options));            
            setTimeout(function(){window.location.reload();},1500);
            break;            
        }
      }
    }
  }
  displayDate2(date: Date, idRoom: number) {

    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    var customer: Customers = {
      firstName:
        "admin" +
        new Date(date).toLocaleDateString('en-US',options).replace(/\s+/g, '').replace(/,/g, '') +
        new Date(date.getTime() + 1000 * 60 * 60 * 24).toLocaleDateString('en-US',options).replace(/\s+/g, '').replace(/,/g, ''),
      lastName: "admin",
      roomId: idRoom,
      dateOfArriving: new Date(date),
      dateOfLeaving: new Date(date.getTime() + 1000 * 60 * 60 * 24),
      email: "admin@hifes.com",
      countryOfOrigin: "HIFES",
      numberOfClient: 0
    };
    this.authService.booking(customer).subscribe(
      () => {
        // this.model2=this.model;
        this.alertify.success(idRoom + " blocked for " + date.toLocaleDateString('en-US',options));
        setTimeout(function(){window.location.reload();},1500);
        
      },
      error => {
        console.log(error);
      }
    );
  }
}
