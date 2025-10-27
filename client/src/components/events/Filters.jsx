export default function Filters() {
  const dateFilters = [
    "All", "Today", "Tomorrow", "This Week", "Next Week",
    "This Month", "Next Month", "This Year"
  ];
  const categories = [
    "All", "Arts", "Business", "Music and Theater",
    "Culture", "Sports", "Education"
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 mt-8">
      <div className="flex flex-wrap gap-3 justify-center text-gray-700 font-medium">
        {dateFilters.map((filter) => (
          <button key={filter} className="px-4 py-2 rounded-full border hover:bg-green-100">
            {filter}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-6 justify-center mt-8">
        {categories.map((cat) => (
          <span key={cat} className="cursor-pointer text-gray-700 hover:text-green-600 font-semibold">
            {cat}
          </span>
        ))}
      </div>
    </div>
  );
}
