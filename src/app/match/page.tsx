import MatchResults from '@/components/MatchResults';

export default function MatchPage() {
  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">
        AI-Powered Resume Matching
      </h1>
      <MatchResults />
    </main>
  );
}