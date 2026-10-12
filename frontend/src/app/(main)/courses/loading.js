export default function CoursesLoading() {
  return (
    <div className="ch-page font-['IRANSansX']">
      {/* Hero Skeleton */}
      <div className="ch-hero animate-pulse">
        <div className="ch-hero-inner max-w-6xl mx-auto px-5">
          <div className="h-5 w-40 bg-amber-200/50 rounded-lg mb-6" />
          <div className="h-10 w-72 bg-amber-300/50 rounded-xl mb-4" />
          <div className="h-5 w-96 max-w-full bg-amber-200/40 rounded-lg" />
        </div>
      </div>

      {/* Grid Skeleton */}
      <div className="max-w-6xl mx-auto px-5 pt-12 space-y-12">
        <div>
          <div className="h-8 w-48 bg-stone-200 rounded-lg mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="bg-white border-2 border-[#292827] rounded-2xl p-5 shadow-[4px_4px_0px_#292827] animate-pulse space-y-4"
              >
                <div className="h-44 bg-stone-200 rounded-xl" />
                <div className="h-6 w-3/4 bg-stone-200 rounded-md" />
                <div className="h-4 w-1/2 bg-stone-200 rounded-md" />
                <div className="pt-4 border-t border-stone-200 flex justify-between items-center">
                  <div className="h-6 w-20 bg-stone-200 rounded-md" />
                  <div className="h-8 w-24 bg-amber-300/60 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
