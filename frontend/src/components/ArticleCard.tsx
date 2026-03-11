import { Link } from '@tanstack/react-router';
import { Clock } from 'lucide-react';
import { ArticleWithBookmark } from '../backend';
import { formatDistanceToNow } from 'date-fns';
import BookmarkButton from './BookmarkButton';
import { Card, CardContent } from '@/components/ui/card';

interface ArticleCardProps {
  articleData: ArticleWithBookmark;
}

export default function ArticleCard({ articleData }: ArticleCardProps) {
  const { article, isBookmarked } = articleData;

  const timeAgo = formatDistanceToNow(new Date(Number(article.timestamp) / 1000000), { addSuffix: true });

  const thumbnailUrl = article.thumbnail ? article.thumbnail.getDirectURL() : '/assets/generated/article-placeholder.dim_400x300.png';

  return (
    <Card className="group overflow-hidden transition-shadow hover:shadow-md">
      <Link to="/article/$id" params={{ id: article.id }} className="block">
        <div className="flex gap-4 p-4">
          {/* Thumbnail */}
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-muted">
            <img
              src={thumbnailUrl}
              alt={article.title}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          </div>

          {/* Content */}
          <div className="flex flex-1 flex-col justify-between">
            <div>
              <h3 className="line-clamp-2 font-semibold leading-tight text-foreground group-hover:text-primary">
                {article.title}
              </h3>
              <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                <span className="font-medium">{article.source}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {timeAgo}
                </span>
              </div>
            </div>
          </div>

          {/* Bookmark Button */}
          <div className="shrink-0">
            <BookmarkButton articleId={article.id} isBookmarked={isBookmarked} />
          </div>
        </div>
      </Link>
    </Card>
  );
}
