import { CalendarDays, CheckCircle } from "lucide-react";

export function SellerHero() {
  return (
    <div className="w-full max-w-2xl mx-auto mb-6">
      <div className="bg-white border-l-4 border-blue-500 shadow-sm rounded-md p-4 flex items-start space-x-3">
        <div className="flex-shrink-0 mt-1">
          <CalendarDays className="w-6 h-6 text-blue-500" />
        </div>
        <div className="flex-1">
          <h2 className="text-md font-semibold text-slate-800 mb-2 ml-[6px]">
            PopIn Organizer
          </h2>
          <ul className="text-sm text-slate-500 space-y-1 ml-[6px]">
            <li className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              Manage your events
            </li>
            <li className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              Track registrations & sales
            </li>
            <li className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              Control all event details
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
