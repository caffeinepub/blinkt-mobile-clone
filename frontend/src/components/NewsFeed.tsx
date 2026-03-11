import { useEffect, useRef } from 'react';
import { useArticles, useArticlesByCategory } from '../hooks/useQueries';
import { Category } from '../backend';
import ArticleCard from './ArticleCard';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';

interface NewsFeedProps {
  category?: Category | null;
}

export default function NewsFeed({ category }: NewsFeedProps) {
  const observerTarget = useRef<HTMLDivElement>(null);

  // Always call both hooks, but only use one based on category
  const allArticlesQuery = useArticles();
  const categoryArticlesQuery = useArticlesByCategory(category || Category.technology);

  // Select the appropriate query based on whether category is set
  const articlesQuery = category ? categoryArticlesQuery : allArticlesQuery;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, error } = articlesQuery;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
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
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertCircle className="mb-4 h-12 w-12 text-destructive" />
        <h3 className="mb-2 text-lg font-semibold">Failed to load articles</h3>
        <p className="text-sm text-muted-foreground">{error?.message || 'An error occurred'}</p>
      </div>
    );
  }

  const articles = data?.pages.flatMap((page) => page) || [];

  if (articles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-lg text-muted-foreground">No articles found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {articles.map((articleData) => (
        <ArticleCard key={articleData.article.id} articleData={articleData} />
      ))}

      {/* Infinite scroll trigger */}
      <div ref={observerTarget} className="py-4">
        {isFetchingNextPage && (
          <div className="flex gap-4 rounded-lg border border-border p-4">
            <Skeleton className="h-24 w-24 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
