import List "mo:core/List";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";

actor {
  // Initialize the access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  type Article = {
    id : Text;
    title : Text;
    source : Text;
    timestamp : Time.Time;
    snippet : Text;
    thumbnail : Storage.ExternalBlob;
    articleUrl : Text;
    category : Category;
  };

  type Category = {
    #technology;
    #business;
    #sports;
    #entertainment;
    #general;
  };

  type ArticleWithBookmark = {
    article : Article;
    isBookmarked : Bool;
  };

  public type UserProfile = {
    name : Text;
  };

  let articles = Map.empty<Text, Article>();
  let bookmarks = Map.empty<Principal, List.List<Text>>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // User profile management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Article management - Admin only
  public shared ({ caller }) func addArticle(id : Text, title : Text, source : Text, timestamp : Time.Time, snippet : Text, thumbnail : Storage.ExternalBlob, articleUrl : Text, category : Category) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add articles");
    };
    let article : Article = {
      id;
      title;
      source;
      timestamp;
      snippet;
      thumbnail;
      articleUrl;
      category;
    };
    articles.add(id, article);
  };

  // Bookmark management - Authenticated users only
  public shared ({ caller }) func bookmarkArticle(articleId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can bookmark articles");
    };
    let articleExists = articles.containsKey(articleId);
    if (not articleExists) {
      Runtime.trap("Article does not exist");
    };
    let userBookmarks = switch (bookmarks.get(caller)) {
      case (null) {
        let newBookmarks = List.empty<Text>();
        newBookmarks.add(articleId);
        newBookmarks;
      };
      case (?existingBookmarks) {
        if (existingBookmarks.contains(articleId)) {
          Runtime.trap("Article already bookmarked");
        };
        existingBookmarks.add(articleId);
        existingBookmarks;
      };
    };
    bookmarks.add(caller, userBookmarks);
  };

  public query ({ caller }) func getBookmarkedArticles() : async [Article] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access bookmarks");
    };
    switch (bookmarks.get(caller)) {
      case (null) { [] };
      case (?userBookmarks) {
        userBookmarks.toArray().map(func(articleId) { articles.get(articleId) }).values().toArray().reverse().map(func(article) { switch (article) { case (null) { Runtime.trap("Article does not exist") }; case (?a) { a } } });
      };
    };
  };

  // Public read operations - Available to all users including guests
  public query ({ caller }) func getArticlesByCategory(category : Category) : async [ArticleWithBookmark] {
    articles.values().toArray().filter(func(article) { article.category == category }).map(func(article) { { article = article; isBookmarked = isArticleBookmarked(caller, article.id) } }).reverse();
  };

  public query ({ caller }) func searchArticles(keyword : Text) : async [ArticleWithBookmark] {
    articles.values().toArray().filter(func(article) { article.title.contains(#text(keyword)) or article.snippet.contains(#text(keyword)) }).map(func(article) { { article = article; isBookmarked = isArticleBookmarked(caller, article.id) } }).reverse();
  };

  public query ({ caller }) func getAllArticles() : async [ArticleWithBookmark] {
    articles.values().toArray().map(func(article) { { article = article; isBookmarked = isArticleBookmarked(caller, article.id) } }).reverse();
  };

  public query ({ caller }) func getArticlesOffset(limit : Nat, offset : Nat) : async [ArticleWithBookmark] {
    articles.values().toArray().map(func(article) { { article = article; isBookmarked = isArticleBookmarked(caller, article.id) } }).reverse().sliceToArray(offset, offset + limit);
  };

  public query ({ caller }) func getArticlesByCategoryOffset(category : Category, limit : Nat, offset : Nat) : async [ArticleWithBookmark] {
    articles.values().toArray().filter(func(article) { article.category == category }).map(func(article) { { article = article; isBookmarked = isArticleBookmarked(caller, article.id) } }).reverse().sliceToArray(offset, offset + limit);
  };

  func isArticleBookmarked(user : Principal, articleId : Text) : Bool {
    switch (bookmarks.get(user)) {
      case (null) { false };
      case (?userBookmarks) { userBookmarks.contains(articleId) };
    };
  };
};
