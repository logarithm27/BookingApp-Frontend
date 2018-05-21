import { AdminauthGuard } from './_guards/adminauth.guard';
import { BookingHeaderComponent } from './bookingHeader/bookingHeader.component';
import { Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { MessagesComponent } from "./messages/messages.component";
import { BookingComponent } from "./booking/booking.component";
import { ManageComponent } from "./manage/manage.component";
import { GalleryComponent } from "./gallery/gallery.component";
import { ActivitiesComponent } from "./activities/activities.component";
import { LoginComponent } from "./login/login.component";
import { ContactComponent } from "./contact/contact.component";
import { ReservationComponent } from "./reservation/reservation.component";

export const appRoutes: Routes = [
  { path: "home", component: HomeComponent },
  { path: "activities", component: ActivitiesComponent },
  { path: "bookinghead", component: BookingHeaderComponent },
  { path: "booking", component: BookingComponent },
  { path: "login", component: LoginComponent },
  { path: "gallery", component: GalleryComponent },
  { path: "contact", component: ContactComponent },
  {
    path:'',
    runGuardsAndResolvers:'always',
    canActivate:[AdminauthGuard],
    children : [
      { path: "manage", component: ManageComponent},
      { path: "reservation", component: ReservationComponent },
      { path: "messages", component: MessagesComponent },
    ]
  },
  { path: "**", redirectTo: "home", pathMatch: "full" }
];
