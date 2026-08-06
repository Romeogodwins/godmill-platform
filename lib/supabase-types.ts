export interface BookingRecord {
  id: number;
  booking_reference: string;
  guest_name: string;
  phone: string;
  email: string;
  room_type: string;
  aircon: string;
  adults: number;
  children: number;
  breakfast: boolean;
  check_in: string;
  check_out: string;
  nights: number;
  room_total: number;
  breakfast_total: number;
  grand_total: number;
  status: string;
  created_at: string;
}

export interface RoomRecord {
  id: number;
  room_number: string;
  room_type: string;
  aircon: string;
  price: number;
  status: string;
}

export interface GuestRecord {
  id: number;
  full_name: string;
  phone: string;
  email: string;
  created_at: string;
}
