import { Customers } from './Customers';
import { Rooms } from './Rooms';
export interface Reservation 
{
    id:number;
    room:Rooms;
    customer:Customers;
    roomId:number;
    customerId:number;
}