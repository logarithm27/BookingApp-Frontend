import { Rooms } from './Rooms';
export interface Customers
{
    id?:number;
    firstName:string;
    lastName:string;
    countryOfOrigin:string;
    email:string;
    phoneNumber?:string;
    dateOfArriving:Date;
    dateOfLeaving:Date;
    numberOfClient:number;
    numberOfMale?:number;
    numberOfFemale?:number;
    numberOfChildren?:number;
    numberOfNight?:number;
    room?:Rooms;
    roomId:number;
}