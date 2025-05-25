import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 px-6 py-12 text-gray-800">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl font-bold text-blue-800 mb-3">Agentic AI Hiring Assistant</h1>
          <p className="text-lg text-gray-700">
            Upload resumes, match them with job descriptions, and summarize top candidates. All powered by OpenAI + FAISS.
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FeatureCard
            title="📄 Upload Resumes"
            description="Upload resumes in PDF/DOCX format. We extract and store them for AI matching."
            link="/upload"
            color="bg-white"
          />
          <FeatureCard
            title="🎯 Match Candidates"
            description="Paste job descriptions and instantly get best-matching resumes with AI-generated summaries."
            link="/match"
            color="bg-white"
          />
          <FeatureCard
            title="📆 Schedule Interviews"
            description="Book interviews directly with matched candidates. Integrated with Google Calendar."
            link="/scheduler"
            color="bg-white"
          />
          <FeatureCard
            title="📊 Hiring Insights (Coming Soon)"
            description="AI-powered analytics and summaries on your hiring pipeline."
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
