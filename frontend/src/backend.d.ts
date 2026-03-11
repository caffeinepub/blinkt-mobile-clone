import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Article {
    id: string;
    title: string;
    thumbnail: ExternalBlob;
    source: string;
    snippet: string;
    timestamp: Time;
    category: Category;
    articleUrl: string;
}
export type Time = bigint;
export interface ArticleWithBookmark {
    article: Article;
    isBookmarked: boolean;
}
export interface UserProfile {
    name: string;
}
export enum Category {
    entertainment = "entertainment",
    technology = "technology",
    business = "business",
    general = "general",
    sports = "sports"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addArticle(id: string, title: string, source: string, timestamp: Time, snippet: string, thumbnail: ExternalBlob, articleUrl: string, category: Category): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    bookmarkArticle(articleId: string): Promise<void>;
    getAllArticles(): Promise<Array<ArticleWithBookmark>>;
    getArticlesByCategory(category: Category): Promise<Array<ArticleWithBookmark>>;
    getArticlesByCategoryOffset(category: Category, limit: bigint, offset: bigint): Promise<Array<ArticleWithBookmark>>;
    getArticlesOffset(limit: bigint, offset: bigint): Promise<Array<ArticleWithBookmark>>;
    getBookmarkedArticles(): Promise<Array<Article>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchArticles(keyword: string): Promise<Array<ArticleWithBookmark>>;
}
