import Link from "next/link";

const groups = [
  {
    title: "Technical SEO",
    tasks: [
      ["Domain connected to official website", true],
      ["Google Search Console verified", true],
      ["XML sitemap submitted", true],
      ["Canonical URLs configured", true],
      ["Mobile navigation available", true],
      ["Structured lodging data added", true],
      ["Monitor indexing of new landing pages", false],
    ],
  },
  {
    title: "Google Business Profile",
    tasks: [
      ["Official website updated", true],
      ["Business name corrected", true],
      ["Business categories reviewed", true],
      ["Hotel amenities reviewed", true],
      ["Review link captured", true],
      ["Request recent genuine reviews", false],
      ["Respond consistently to new reviews", false],
      ["Add new original property photos", false],
    ],
  },
  {
    title: "Local Authority",
    tasks: [
      ["Consistent name, address and phone on website", true],
      ["Build reputable local citations", false],
      ["Review accommodation directory listings", false],
      ["Pursue relevant local backlinks", false],
      ["Strengthen tourism/business references", false],
    ],
  },
  {
    title: "Content & Conversion",
    tasks: [
      ["Primary accommodation landing page live", true],
      ["Guesthouse landing page live", true],
      ["Affordable accommodation page live", true],
      ["Family accommodation page live", true],
      ["Business accommodation page live", true],
      ["Rooms landing page live", true],
      ["Full gallery live", true],
      ["Publish useful Taung visitor content", false],
      ["Continue improving direct-booking conversion", false],
    ],
  },
];

export default function SeoChecklistPage() {
  const tasks = groups.flatMap((group) => group.tasks);
  const completed = tasks.filter((task) => task[1]).length;
  const percentage = Math.round(
    (completed / tasks.length) * 100
  );

  return (
    <div className="mx-auto max-w-7xl">
      <Link
        href="/admin/seo"
        className="text-sm font-semibold text-[#d4b16f]"
      >
        ← SEO Command Centre
      </Link>

      <p className="mt-8 uppercase tracking-[0.25em] text-[#d4b16f]">
        Execution
      </p>

      <h1 className="mt-3 text-4xl font-bold text-white">
        SEO Ranking Checklist
      </h1>

      <p className="mt-4 max-w-3xl leading-7 text-gray-400">
        Track the work required to strengthen Godmill&apos;s search
        visibility and direct-booking presence.
      </p>

      <div className="mt-10 rounded-3xl border border-white/10 bg-[#111] p-7">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm text-gray-400">
              Implementation progress
            </p>

            <p className="mt-2 text-4xl font-bold text-white">
              {percentage}%
            </p>
          </div>

          <p className="text-sm text-gray-400">
            {completed} of {tasks.length} tasks completed
          </p>
        </div>

        <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-[#d4b16f]"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      <div className="mt-10 grid gap-6 xl:grid-cols-2">
        {groups.map((group) => (
          <section
            key={group.title}
            className="rounded-3xl border border-white/10 bg-[#111] p-7"
          >
            <h2 className="text-xl font-bold text-white">
              {group.title}
            </h2>

            <div className="mt-6 space-y-3">
              {group.tasks.map(([task, done]) => (
                <div
                  key={String(task)}
                  className="flex items-start gap-3 rounded-2xl bg-white/[0.03] p-4"
                >
                  <span
                    className={
                      done
                        ? "text-green-400"
                        : "text-yellow-300"
                    }
                  >
                    {done ? "✓" : "○"}
                  </span>

                  <div>
                    <p
                      className={
                        done
                          ? "text-gray-300"
                          : "font-medium text-white"
                      }
                    >
                      {String(task)}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {done ? "Completed" : "Action required"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}