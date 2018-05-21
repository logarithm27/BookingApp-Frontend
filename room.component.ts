import { Rooms } from '../_models/Rooms';
import { Component, Input, OnInit } from '@angular/core';
import { BookingComponent } from '../booking/booking.component';
@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {
@Input() room:Rooms;
@Input() roomChecked: boolean = false;
@Input() roomId:number

  constructor() { }

  ngOnInit() {
  }
  selectRoom(){
    this.roomChecked = !this.roomChecked;
    console.log(this.room.id);
    this.roomId=this.room.id;
  }

}
