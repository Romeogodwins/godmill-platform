export type BookingStatus = "Pending" | "Confirmed" | "Checked In" | "Checked Out" | "Cancelled";
export type RoomStatus = "Occupied" | "Available" | "Cleaning" | "Maintenance";
export type CalendarStatus = "Available" | "Booked" | "Cleaning" | "Maintenance";

export interface Booking {
  id: number;
  guestName: string;
  phone: string;
  room: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  breakfast: boolean;
  status: BookingStatus;
}

export interface RoomItem {
  id: string;
  roomNumber: string;
  roomType: string;
  price: string;
  status: RoomStatus;
  cleaningStatus: string;
}

export interface CalendarDay {
  day: number;
  status: CalendarStatus;
  label: string;
}

export const bookings: Booking[] = [
  {
    id: 1042,
    guestName: "Anele Mokoena",
    phone: "079 058 2637",
    room: "Executive Room",
    checkIn: "06 Aug",
    checkOut: "08 Aug",
    guests: 2,
    breakfast: true,
    status: "Confirmed",
  },
  {
    id: 1043,
    guestName: "Lerato Tlhapi",
    phone: "061 413 7405",
    room: "Family Aircon",
    checkIn: "07 Aug",
    checkOut: "10 Aug",
    guests: 4,
    breakfast: true,
    status: "Pending",
  },
  {
    id: 1044,
    guestName: "Sibusiso Dlamini",
    phone: "074 112 9988",
    room: "Standard Room Aircon",
    checkIn: "08 Aug",
    checkOut: "09 Aug",
    guests: 2,
    breakfast: false,
    status: "Checked In",
  },
  {
    id: 1045,
    guestName: "Palesa Molefe",
    phone: "078 221 7744",
    room: "Standard Room Non-Aircon",
    checkIn: "09 Aug",
    checkOut: "11 Aug",
    guests: 1,
    breakfast: true,
    status: "Checked Out",
  },
  {
    id: 1046,
    guestName: "Thabo Maseko",
    phone: "073 404 5500",
    room: "Family Non-Aircon",
    checkIn: "10 Aug",
    checkOut: "12 Aug",
    guests: 3,
    breakfast: false,
    status: "Cancelled",
  },
];

export const rooms: RoomItem[] = [
  { id: "E-01", roomNumber: "101", roomType: "Executive Room", price: "R750", status: "Occupied", cleaningStatus: "Ready" },
  { id: "S-01", roomNumber: "102", roomType: "Standard Room Aircon", price: "R600", status: "Available", cleaningStatus: "Ready" },
  { id: "S-02", roomNumber: "103", roomType: "Standard Room Non-Aircon", price: "R500", status: "Cleaning", cleaningStatus: "In progress" },
  { id: "F-01", roomNumber: "104", roomType: "Family Aircon", price: "R850", status: "Available", cleaningStatus: "Ready" },
  { id: "F-02", roomNumber: "105", roomType: "Family Non-Aircon", price: "R750", status: "Maintenance", cleaningStatus: "Pending" },
];

export const calendarDays: CalendarDay[] = [
  { day: 1, status: "Booked", label: "Anele" },
  { day: 2, status: "Available", label: "Open" },
  { day: 3, status: "Cleaning", label: "Clean" },
  { day: 4, status: "Booked", label: "Lerato" },
  { day: 5, status: "Available", label: "Open" },
  { day: 6, status: "Maintenance", label: "Repair" },
  { day: 7, status: "Booked", label: "Sibusiso" },
  { day: 8, status: "Available", label: "Open" },
  { day: 9, status: "Booked", label: "Palesa" },
  { day: 10, status: "Available", label: "Open" },
  { day: 11, status: "Cleaning", label: "Clean" },
  { day: 12, status: "Booked", label: "Thabo" },
  { day: 13, status: "Available", label: "Open" },
  { day: 14, status: "Booked", label: "Nomsa" },
  { day: 15, status: "Available", label: "Open" },
  { day: 16, status: "Available", label: "Open" },
  { day: 17, status: "Booked", label: "Kagiso" },
  { day: 18, status: "Cleaning", label: "Clean" },
  { day: 19, status: "Available", label: "Open" },
  { day: 20, status: "Booked", label: "Mpho" },
  { day: 21, status: "Available", label: "Open" },
  { day: 22, status: "Booked", label: "Dineo" },
  { day: 23, status: "Available", label: "Open" },
  { day: 24, status: "Cleaning", label: "Clean" },
  { day: 25, status: "Booked", label: "Tshepo" },
  { day: 26, status: "Available", label: "Open" },
  { day: 27, status: "Booked", label: "Kabelo" },
  { day: 28, status: "Available", label: "Open" },
  { day: 29, status: "Booked", label: "Zinhle" },
  { day: 30, status: "Available", label: "Open" },
  { day: 31, status: "Cleaning", label: "Clean" },
];

export const businessInfo = {
  name: "Godmill City Guesthouse",
  address: ["No. 217 Khibitswane", "Taung", "Cokonyane Road", "Near Boemma Waters"],
  phones: ["079 058 2637", "061 413 7405"],
  breakfast: "R120 per person",
  roomPrices: [
    { name: "Executive", price: "R750" },
    { name: "Standard Aircon", price: "R600" },
    { name: "Standard Non-Aircon", price: "R500" },
    { name: "Family Aircon", price: "R850" },
    { name: "Family Non-Aircon", price: "R750" },
  ],
};

