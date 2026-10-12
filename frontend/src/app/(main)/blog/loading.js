export default function BlogLoading() {
  return (
    <div className="min-h-screen bg-[#fffdf9] font-['IRANSansX'] py-12">
      <div className="max-w-6xl mx-auto px-5 space-y-10">
        {/* Header Hero skeleton */}
        <div className="text-center max-w-2xl mx-auto space-y-4 animate-pulse">
          <div className="h-10 w-64 bg-amber-300/60 rounded-xl mx-auto" />
          <div className="h-4 w-96 max-w-full bg-stone-200 rounded-md mx-auto" />
        </div>

        {/* Featured Article Skeleton */}
        <div className="bg-white border-2 border-[#292827] rounded-3xl p-6 md:p-8 shadow-[6px_6px_0px_#292827] animate-pulse grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="h-64 bg-stone-200 rounded-2xl" />
          <div className="space-y-4">
            <div className="h-6 w-24 bg-amber-200 rounded-md" />
            <div className="h-8 w-4/5 bg-stone-300 rounded-xl" />
            <div className="h-4 w-full bg-stone-200 rounded" />
            <div className="h-4 w-3/4 bg-stone-200 rounded" />
            <div className="h-10 w-32 bg-amber-400 rounded-xl pt-2" />
          </div>
        </div>

        {/* Articles Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="bg-white border-2 border-[#292827] rounded-2xl p-5 shadow-[4px_4px_0px_#292827] animate-pulse space-y-4"
            >
              <div className="h-40 bg-stone-200 rounded-xl" />
              <div className="h-5 w-24 bg-amber-200/70 rounded-md" />
              <div className="h-6 w-5/6 bg-stone-300 rounded-md" />
              <div className="h-4 w-2/3 bg-stone-200 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
