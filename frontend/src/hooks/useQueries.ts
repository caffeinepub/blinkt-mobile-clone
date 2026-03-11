import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import { Category, UserProfile, ArticleWithBookmark, Article } from '../backend';
import { toast } from 'sonner';

const ARTICLES_PER_PAGE = 10;

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      toast.success('Profile saved successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to save profile');
    },
  });
}

// Articles Queries
export function useArticles() {
  const { actor, isFetching: actorFetching } = useActor();

  return useInfiniteQuery<ArticleWithBookmark[]>({
    queryKey: ['articles'],
    queryFn: async ({ pageParam = 0 }) => {
      if (!actor) return [];
      return actor.getArticlesOffset(BigInt(ARTICLES_PER_PAGE), BigInt(pageParam as number));
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < ARTICLES_PER_PAGE) return undefined;
      return allPages.length * ARTICLES_PER_PAGE;
    },
    initialPageParam: 0,
    enabled: !!actor && !actorFetching,
  });
}

export function useArticlesByCategory(category: Category) {
  const { actor, isFetching: actorFetching } = useActor();

  return useInfiniteQuery<ArticleWithBookmark[]>({
    queryKey: ['articles', 'category', category],
    queryFn: async ({ pageParam = 0 }) => {
      if (!actor) return [];
      return actor.getArticlesByCategoryOffset(category, BigInt(ARTICLES_PER_PAGE), BigInt(pageParam as number));
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < ARTICLES_PER_PAGE) return undefined;
      return allPages.length * ARTICLES_PER_PAGE;
    },
    initialPageParam: 0,
    enabled: !!actor && !actorFetching,
  });
}

export function useArticleDetail(articleId: string) {
  const { actor, isFetching: actorFetching } = useActor();
  const queryClient = useQueryClient();

  return useQuery<ArticleWithBookmark | null>({
    queryKey: ['article', articleId],
    queryFn: async () => {
      if (!actor) return null;

      // Try to find in cached articles first
      const cachedArticles = queryClient.getQueriesData<{ pages: ArticleWithBookmark[][] }>({ queryKey: ['articles'] });
      
      for (const [, data] of cachedArticles) {
        if (data?.pages) {
          for (const page of data.pages) {
            const found = page.find((a) => a.article.id === articleId);
            if (found) return found;
          }
        }
      }

      // If not in cache, fetch all articles (backend doesn't have single article endpoint)
      const allArticles = await actor.getAllArticles();
      return allArticles.find((a) => a.article.id === articleId) || null;
    },
    enabled: !!actor && !actorFetching && !!articleId,
  });
}

export function useSearchArticles(keyword: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ArticleWithBookmark[]>({
    queryKey: ['articles', 'search', keyword],
    queryFn: async () => {
      if (!actor || !keyword) return [];
      return actor.searchArticles(keyword);
    },
    enabled: !!actor && !actorFetching && !!keyword,
  });
}

// Bookmark Queries
export function useBookmarkedArticles() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<Article[]>({
    queryKey: ['bookmarkedArticles'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getBookmarkedArticles();
    },
    enabled: !!actor && !actorFetching && !!identity,
  });
}

export function useBookmarkArticle() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (articleId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.bookmarkArticle(articleId);
    },
    onSuccess: () => {
      // Invalidate all article queries to refresh bookmark status
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      queryClient.invalidateQueries({ queryKey: ['bookmarkedArticles'] });
      toast.success('Bookmark updated');
    },
    onError: (error: any) => {
      const message = error.message || 'Failed to update bookmark';
      if (message.includes('already bookmarked')) {
        // Article was bookmarked, now unbookmarked
        queryClient.invalidateQueries({ queryKey: ['articles'] });
        queryClient.invalidateQueries({ queryKey: ['bookmarkedArticles'] });
        toast.success('Bookmark removed');
      } else {
        toast.error(message);
      }
    },
  });
}
