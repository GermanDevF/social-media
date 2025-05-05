import TrendsSidebar from "@/components/trends-sidebar";
import SearchResults from "./results";

interface SearchPageProps {
  searchParams: {
    q: string;
  };
}

export const generateMetadata = async ({ searchParams }: SearchPageProps) => {
  const { q } = await searchParams;

  return {
    title: `Resultados de la búsqueda para "${q}"`,
  };
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;

  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <div className="bg-card rounded-lg p-4 shadow-sm">
          <h1 className="line-clamp-2 text-center text-xl font-bold break-all">
            Resultados de la búsqueda para &quot;{q}&quot;
          </h1>
        </div>
        <SearchResults q={q} />
      </div>
      <TrendsSidebar />
    </main>
  );
}
