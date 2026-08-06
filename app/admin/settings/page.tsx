import AdminShell from "../../components/admin/AdminShell";
import { businessInfo } from "../../components/admin/mockData";

export default function AdminSettingsPage() {
  return (
    <AdminShell title="Settings" subtitle="Business details and pricing configuration">
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[1.75rem] border border-white/10 bg-[#101010] p-6">
          <h2 className="text-xl font-semibold text-white">Business information</h2>
          <p className="mt-2 text-sm text-gray-400">Primary guesthouse details for reception and booking support</p>

          <div className="mt-6 space-y-4 text-sm text-gray-300">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-[#d4b16f]">Property</p>
              <p className="mt-2 font-semibold text-white">{businessInfo.name}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-[#d4b16f]">Address</p>
              <div className="mt-2 space-y-1">
                {businessInfo.address.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-[#d4b16f]">Phones</p>
              <div className="mt-2 space-y-1">
                {businessInfo.phones.map((phone) => (
                  <p key={phone}>{phone}</p>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-white/10 bg-[#101010] p-6">
          <h2 className="text-xl font-semibold text-white">Pricing & breakfast</h2>
          <p className="mt-2 text-sm text-gray-400">Mock rates used by the booking engine and admin tools</p>

          <div className="mt-6 space-y-3 text-sm text-gray-300">
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <span>Breakfast</span>
              <span className="font-semibold text-white">{businessInfo.breakfast}</span>
            </div>
            {businessInfo.roomPrices.map((price) => (
              <div key={price.name} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <span>{price.name}</span>
                <span className="font-semibold text-white">{price.price}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
