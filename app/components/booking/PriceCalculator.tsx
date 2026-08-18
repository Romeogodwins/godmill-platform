import type { BookingFormState } from "./types";

interface PriceCalculatorProps {
  form: BookingFormState;
}

const roomRates: Record<string, number> = {
  "Executive Room": 750,
  "Standard Room": 600,
  "Family 3 Sleeper": 850,
};

const nonAirconRates: Record<string, number> = {
  "Executive Room": 750,
  "Standard Room": 500,
  "Family 3 Sleeper": 750,
};

export default function PriceCalculator({ form }: PriceCalculatorProps) {
  const adults = Number(form.adults || 0);
  const children = Number(form.children || 0);
  const nights = form.checkIn && form.checkOut
    ? Math.max(
        1,
        Math.round(
          (new Date(form.checkOut).getTime() - new Date(form.checkIn).getTime()) /
            (1000 * 60 * 60 * 24),
        ),
      )
    : 0;

  const roomRate =
    form.roomType === "Standard Room" || form.roomType === "Family 3 Sleeper"
      ? form.aircon === "Non-Aircon"
        ? nonAirconRates[form.roomType]
        : roomRates[form.roomType]
      : roomRates[form.roomType];

  const roomTotal = nights * roomRate;
  const breakfastPeople = adults + children;
  const breakfastTotal = form.breakfast ? breakfastPeople * 120 : 0;
  const grandTotal = roomTotal + breakfastTotal;

  return (
    <div className="space-y-3 rounded-3xl border border-[#d4b16f]/20 bg-[#111111] p-5">
      <div className="flex items-center justify-between text-sm text-gray-300">
        <span>Stay length</span>
        <span className="font-semibold text-white">{nights} night{nights === 1 ? "" : "s"}</span>
      </div>
      <div className="flex items-center justify-between text-sm text-gray-300">
        <span>Room total</span>
        <span className="font-semibold text-white">R{roomTotal.toLocaleString()}</span>
      </div>
      <div className="flex items-center justify-between text-sm text-gray-300">
        <span>Breakfast total</span>
        <span className="font-semibold text-white">R{breakfastTotal.toLocaleString()}</span>
      </div>
      <div className="flex items-center justify-between border-t border-white/10 pt-3 text-base font-semibold text-[#d4b16f]">
        <span>Grand total</span>
        <span>R{grandTotal.toLocaleString()}</span>
      </div>
    </div>
  );
}

