export interface Apartment {
  id: string;
  number: string;
  name: string;
  street?: string;
  zipCode?: string;
  rooms: ApartmentRoom[];
}

export interface ApartmentRoom {
  number: string;
  area: string;
  price: string;
}

export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  nationality: string;
  birthDate: string;
  bookings: [];
}

export interface ClientBooking {
  createdAt: Date;
  updatedAt: Date;
  room: ApartmentRoom;
}

export interface Room {
  id: string;
  number: string;
  area: string;
  price: string;
  apartment: RoomApartment;
}

export interface RoomApartment {
  number: string;
  name: string;
}

export interface Booking {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  client: Client;
  room: Room;
}
