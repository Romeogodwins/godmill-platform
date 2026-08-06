export type RoomType = "Executive Room" | "Standard Double" | "Family 3 Sleeper";
export type AirconPreference = "Aircon" | "Non-Aircon";

export interface BookingFormState {
  checkIn: string;
  checkOut: string;
  adults: string;
  children: string;
  roomType: RoomType;
  aircon: AirconPreference;
  breakfast: boolean;
  guestName: string;
  email: string;
  phone: string;
  specialRequests: string;
}

export type BookingErrors = Partial<Record<keyof BookingFormState, string>>;
