import { useParams, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, ExternalLink, Clock, Tag } from 'lucide-react';
import { useArticleDetail } from '../hooks/useQueries';
import { formatDistanceToNow } from 'date-fns';
import BookmarkButton from '../components/BookmarkButton';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

export default function ArticleDetailPage() {
  const { id } = useParams({ from: '/article/$id' });
  const navigate = useNavigate();
  const { data: articleData, isLoading, isError } = useArticleDetail(id);

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-6">
        <Skeleton className="mb-4 h-10 w-32" />
        <Skeleton className="mb-4 h-64 w-full rounded-lg" />
        <Skeleton className="mb-2 h-8 w-3/4" />
        <Skeleton className="mb-4 h-4 w-1/2" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (isError || !articleData) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-12 text-center">
        <h2 className="mb-4 text-2xl font-bold">Article not found</h2>
        <Button onClick={() => navigate({ to: '/' })}>Go back home</Button>
      </div>
    );
  }

  const { article, isBookmarked } = articleData;
  const timeAgo = formatDistanceToNow(new Date(Number(article.timestamp) / 1000000), { addSuffix: true });
  const thumbnailUrl = article.thumbnail ? article.thumbnail.getDirectURL() : '/assets/generated/article-placeholder.dim_400x300.png';

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-3xl px-4 py-6">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => navigate({ to: '/' })} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        {/* Article Content */}
        <article className="space-y-6">
          {/* Thumbnail */}
          <div className="overflow-hidden rounded-lg">
            <img src={thumbnailUrl} alt={article.title} className="h-64 w-full object-cover" />
          </div>

          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-3xl font-bold leading-tight text-foreground">{article.title}</h1>
              <BookmarkButton articleId={article.id} isBookmarked={isBookmarked} />
            </div>

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{article.source}</span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {timeAgo}
              </span>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Tag className="h-3 w-3" />
                {article.category}
              </Badge>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p className="text-lg leading-relaxed text-foreground/90">{article.snippet}</p>
          </div>

          {/* Read More Button */}
          <div className="pt-4">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <a href={article.articleUrl} target="_blank" rel="noopener noreferrer">
                Read Full Article
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </article>
      </div>
    </div>
  );
}
