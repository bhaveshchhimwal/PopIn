export default function Filters() {
  const categories = [
    "All",
    "Arts",
    "Business",
    "Music and Theater",
    "Culture",
    "Sports",
    "Education",
    "Others"
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 mt-6 sm:mt-8">
      <div className="flex overflow-x-auto sm:flex-wrap gap-3 sm:gap-6 justify-start sm:justify-center pb-2 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            className="flex-shrink-0 px-4 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-green-100 hover:border-green-400 font-medium transition text-sm sm:text-base"
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
