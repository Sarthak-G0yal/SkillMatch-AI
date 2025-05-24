import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 px-6 py-12 text-gray-800">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl font-bold text-blue-800 mb-3">Agentic AI Hiring Assistant</h1>
          <p className="text-lg text-gray-700">
            Smart, semantic, and streamlined recruitment. Upload resumes, match job descriptions,
            and schedule interviews – all powered by AI.
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FeatureCard
            title="📄 Resume Uploader"
            description="Upload candidate resumes in .pdf or .docx format. We extract and store them for AI matching."
            link="/upload"
            color="bg-white"
          />
          <FeatureCard
            title="🎯 Job Matching"
            description="Paste your job description and instantly find top-matching resumes using OpenAI embeddings + FAISS."
            link="/match"
            color="bg-white"
          />
          <FeatureCard
            title="📆 Interview Scheduler"
            description="Book interview slots with top candidates. (Calendar API integration coming soon.)"
            link="/scheduler"
            color="bg-white"
          />
          <FeatureCard
            title="📊 Insights (coming soon)"
            description="View analytics and hiring funnel metrics. Get AI summaries of hiring performance."
            link="#"
            color="bg-white"
          />
        </section>
      </div>
    </main>
  );
}

function FeatureCard({
  title,
  description,
  link,
  color,
}: {
  title: string;
  description: string;
  link: string;
  color: string;
}) {
  return (
    <div className={`rounded-xl shadow-md p-6 border ${color}`}>
      <h2 className="text-xl font-semibold text-blue-700 mb-2">{title}</h2>
      <p className="text-gray-600 mb-4">{description}</p>
      <Link
        href={link}
        className="inline-block text-sm text-blue-600 font-medium hover:underline"
      >
        Go to {title.split(" ")[1]}
      </Link>
    </div>
  );
}
