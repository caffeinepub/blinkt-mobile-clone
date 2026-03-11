import { useNavigate, useSearch } from '@tanstack/react-router';
import { ArrowLeft, Search as SearchIcon } from 'lucide-react';
import { useSearchArticles } from '../hooks/useQueries';
import ArticleCard from '../components/ArticleCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function SearchResultsPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: '/search' });
  const query = (search as any)?.q || '';

  const { data: articles, isLoading, isError } = useSearchArticles(query);

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-6">
        <Skeleton className="mb-6 h-10 w-64" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-4 rounded-lg border border-border p-4">
              <Skeleton className="h-24 w-24 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-3xl px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate({ to: '/' })} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Search Results</h1>
          <p className="mt-2 text-muted-foreground">
            {query ? (
              <>
                Showing results for "<span className="font-medium text-foreground">{query}</span>"
                {articles && ` (${articles.length} found)`}
              </>
            ) : (
              'Enter a search query'
            )}
          </p>
        </div>

        {/* Results */}
        {isError ? (
          <div className="py-12 text-center">
            <p className="text-destructive">Failed to search articles</p>
          </div>
        ) : !query ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <SearchIcon className="mb-4 h-16 w-16 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">No search query</h3>
            <p className="text-sm text-muted-foreground">Use the search bar to find articles</p>
          </div>
        ) : articles && articles.length > 0 ? (
          <div className="space-y-4">
            {articles.map((articleData) => (
              <ArticleCard key={articleData.article.id} articleData={articleData} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <SearchIcon className="mb-4 h-16 w-16 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">No results found</h3>
            <p className="mb-6 text-sm text-muted-foreground">Try different keywords or browse all articles</p>
            <Button onClick={() => navigate({ to: '/' })}>Browse Articles</Button>
          </div>
        )}
      </div>
    </div>
  );
}
