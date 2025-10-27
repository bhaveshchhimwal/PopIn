export default function EventCard() {
  return (
    <div className="bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-lg transition">
      <img
        src="/assets/sample-event.jpg"
        alt="Event"
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Tech Conference 2025
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Chandigarh • Nov 3, 2025
        </p>
        <button className="mt-4 w-full bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-600">
          Book Ticket
        </button>
      </div>
    </div>
  );
}
