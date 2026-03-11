import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Bookmark as BookmarkIcon } from 'lucide-react';
import { useBookmarkedArticles } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import ArticleCard from '../components/ArticleCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function BookmarksPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: articles, isLoading, isError } = useBookmarkedArticles();

  if (!identity) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-12 text-center">
        <BookmarkIcon className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
        <h2 className="mb-2 text-2xl font-bold">Login Required</h2>
        <p className="mb-6 text-muted-foreground">Please login to view your bookmarked articles</p>
        <Button onClick={() => navigate({ to: '/' })}>Go back home</Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-6">
        <Skeleton className="mb-6 h-10 w-48" />
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
          <h1 className="text-3xl font-bold text-foreground">Bookmarked Articles</h1>
          <p className="mt-2 text-muted-foreground">
            {articles && articles.length > 0 ? `${articles.length} saved article${articles.length !== 1 ? 's' : ''}` : 'No bookmarks yet'}
          </p>
        </div>

        {/* Articles */}
        {isError ? (
          <div className="py-12 text-center">
            <p className="text-destructive">Failed to load bookmarks</p>
          </div>
        ) : articles && articles.length > 0 ? (
          <div className="space-y-4">
            {articles.map((article) => (
              <ArticleCard key={article.id} articleData={{ article, isBookmarked: true }} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <BookmarkIcon className="mb-4 h-16 w-16 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">No bookmarks yet</h3>
            <p className="mb-6 text-sm text-muted-foreground">Start bookmarking articles to read them later</p>
            <Button onClick={() => navigate({ to: '/' })}>Browse Articles</Button>
          </div>
        )}
      </div>
    </div>
  );
}
