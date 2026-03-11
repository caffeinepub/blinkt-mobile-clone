import { Bookmark } from 'lucide-react';
import { useBookmarkArticle } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface BookmarkButtonProps {
  articleId: string;
  isBookmarked: boolean;
}

export default function BookmarkButton({ articleId, isBookmarked }: BookmarkButtonProps) {
  const { identity } = useInternetIdentity();
  const { mutate: toggleBookmark, isPending } = useBookmarkArticle();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!identity) {
      toast.error('Please login to bookmark articles');
      return;
    }

    toggleBookmark(articleId);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleClick}
      disabled={isPending}
      className="h-8 w-8 text-muted-foreground hover:text-foreground"
    >
      <Bookmark className={`h-5 w-5 ${isBookmarked ? 'fill-current text-primary' : ''}`} />
    </Button>
  );
}
