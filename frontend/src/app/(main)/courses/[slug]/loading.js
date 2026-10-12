export default function SingleCourseLoading() {
  return (
    <div className="min-h-screen bg-[#fffdf9] font-['IRANSansX'] py-10">
      <div className="max-w-6xl mx-auto px-5">
        {/* Top breadcrumb skeleton */}
        <div className="h-5 w-48 bg-stone-200 rounded-md animate-pulse mb-8" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content skeleton */}
          <div className="lg:col-span-2 space-y-6 animate-pulse">
            <div className="h-10 w-4/5 bg-stone-300 rounded-xl" />
            <div className="h-5 w-3/5 bg-stone-200 rounded-md" />
            <div className="h-72 bg-amber-100/60 border-2 border-[#292827] rounded-2xl shadow-[4px_4px_0px_#292827]" />
            <div className="space-y-3 pt-4">
              <div className="h-4 w-full bg-stone-200 rounded" />
              <div className="h-4 w-5/6 bg-stone-200 rounded" />
              <div className="h-4 w-4/6 bg-stone-200 rounded" />
            </div>
          </div>

          {/* Sidebar card skeleton */}
          <div className="bg-white border-2 border-[#292827] rounded-2xl p-6 shadow-[5px_5px_0px_#292827] animate-pulse space-y-6 h-fit">
            <div className="h-8 w-32 bg-amber-200 rounded-md" />
            <div className="space-y-3">
              <div className="h-4 w-full bg-stone-200 rounded" />
              <div className="h-4 w-full bg-stone-200 rounded" />
              <div className="h-4 w-full bg-stone-200 rounded" />
            </div>
            <div className="h-12 bg-amber-400/80 border-2 border-[#292827] rounded-xl shadow-[3px_3px_0px_#292827]" />
          </div>
        </div>
      </div>
    </div>
  );
}
