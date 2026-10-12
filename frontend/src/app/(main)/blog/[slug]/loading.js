export default function BlogArticleLoading() {
  return (
    <div className="min-h-screen bg-[#fffdf9] font-['IRANSansX'] py-12">
      <article className="max-w-3xl mx-auto px-5 space-y-8 animate-pulse">
        {/* Category & Date */}
        <div className="flex gap-4 items-center">
          <div className="h-6 w-24 bg-amber-300 rounded-md" />
          <div className="h-4 w-32 bg-stone-200 rounded" />
        </div>

        {/* Title & Author */}
        <div className="h-12 w-full bg-stone-300 rounded-xl" />
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-stone-300" />
          <div className="h-4 w-28 bg-stone-200 rounded" />
        </div>

        {/* Cover image */}
        <div className="h-80 w-full bg-stone-200 border-2 border-[#292827] rounded-3xl shadow-[5px_5px_0px_#292827]" />

        {/* Body content */}
        <div className="space-y-4 pt-4">
          <div className="h-4 w-full bg-stone-200 rounded" />
          <div className="h-4 w-11/12 bg-stone-200 rounded" />
          <div className="h-4 w-4/5 bg-stone-200 rounded" />
          <div className="h-8 w-1/2 bg-amber-200/60 rounded-lg my-6" />
          <div className="h-4 w-full bg-stone-200 rounded" />
          <div className="h-4 w-5/6 bg-stone-200 rounded" />
        </div>
      </article>
    </div>
  );
}
