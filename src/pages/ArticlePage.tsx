import { useParams, useLocation } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import {
  getArticleById,
  getArticlesByCategory,
  updateArticle,
} from "@/data/articles";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Eye, ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { toast } from "@/components/ui/sonner";
import { summarizeText } from "@/services/openai";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from '@/context/ThemeContext'; // Add this import

const ArticlePage = () => {
  const { articleId } = useParams<{ articleId: string }>();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { isDarkMode } = useTheme(); // Add theme hook

  const passedArticle = location.state?.articleData;

  const [article, setArticle] = useState(passedArticle);
  const [hasLiked, setHasLiked] = useState(false);
  const [hasDisliked, setHasDisliked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [views, setViews] = useState(0);
  const [viewCounted, setViewCounted] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isLoading, setIsLoading] = useState(!passedArticle);
  const [summary, setSummary] = useState("");
  const [comments, setComments] = useState([]); // Add state for comments
  const [comment, setComment] = useState(""); // Add state for new comment

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    const target = e.target as HTMLImageElement;
    target.src = "/src/components/ui/placeholder.png";
    target.onerror = null;
  };

  useEffect(() => {
    const fetchArticle = async () => {
      if (!passedArticle && articleId) {
        setIsLoading(true);

        let foundArticle = await getArticleById(articleId);

        if (!foundArticle) {
          const categories = [
            "AI",
            "ML",
            "Blockchain",
            "IoT",
            "Quantum Computing",
            "Robotics",
            "VR/AR",
            "Networking",
          ];

          for (const category of categories) {
            const categoryArticles = await getArticlesByCategory(category);
            foundArticle = categoryArticles.find((art) => art.id === articleId);
            if (foundArticle) break;
          }
        }

        if (foundArticle) {
          setArticle(foundArticle);
          setLikes(foundArticle.likes || 0);
          setDislikes(foundArticle.dislikes || 0);
          setViews(foundArticle.views || 0);
        }

        setIsLoading(false);
      } else if (passedArticle) {
        setLikes(passedArticle.likes || 0);
        setDislikes(passedArticle.dislikes || 0);
        setViews(passedArticle.views || 0);
      }
    };

    fetchArticle();
    if (articleId && isAuthenticated) {
      const likedArticles = JSON.parse(
        localStorage.getItem("likedArticles") || "{}"
      );
      const dislikedArticles = JSON.parse(
        localStorage.getItem("dislikedArticles") || "{}"
      );

      setHasLiked(!!likedArticles[articleId]);
      setHasDisliked(!!dislikedArticles[articleId]);
    }
  }, [articleId, passedArticle, isAuthenticated]);

  useEffect(() => {
    const updateViewCount = async () => {
      if (article && articleId && !viewCounted) {
        const viewedArticles = JSON.parse(
          sessionStorage.getItem("viewedArticles") || "{}"
        );

        if (!viewedArticles[articleId]) {
          const newViewCount = views + 1;
          setViews(newViewCount);
          setViewCounted(true);

          viewedArticles[articleId] = true;
          sessionStorage.setItem(
            "viewedArticles",
            JSON.stringify(viewedArticles)
          );
          await updateArticle("views", newViewCount, articleId);
        }
      }
    };

    if (article) {
      document.title = `${article.title} - TechDigest`;
      updateViewCount();
    }
  }, [article, articleId, viewCounted, views]);

  const handleLike = useCallback(async () => {
    if (!articleId) return;

    if (!isAuthenticated) {
      toast.error("Please log in to like articles");
      return;
    }

    if (hasLiked) {
      toast.warning("You've already liked this article!");
      return;
    }

    if (hasDisliked) {
      const newDislikeCount = Math.max(0, dislikes - 1);
      setDislikes(newDislikeCount);
      setHasDisliked(false);

      await updateArticle("dislikes", newDislikeCount, articleId);

      const dislikedArticles = JSON.parse(
        localStorage.getItem("dislikedArticles") || "{}"
      );
      delete dislikedArticles[articleId];
      localStorage.setItem(
        "dislikedArticles",
        JSON.stringify(dislikedArticles)
      );
    }

    const newLikeCount = likes + 1;
    setLikes(newLikeCount);
    setHasLiked(true);

    await updateArticle("likes", newLikeCount, articleId);

    const likedArticles = JSON.parse(
      localStorage.getItem("likedArticles") || "{}"
    );
    likedArticles[articleId] = true;
    localStorage.setItem("likedArticles", JSON.stringify(likedArticles));

    toast.success("Article liked!");
  }, [articleId, hasLiked, hasDisliked, likes, dislikes, isAuthenticated]);

  const handleDislike = useCallback(async () => {
    if (!articleId) return;

    if (!isAuthenticated) {
      toast.error("Please log in to dislike articles");
      return;
    }

    if (hasDisliked) {
      toast.warning("You've already disliked this article!");
      return;
    }

    if (hasLiked) {
      const newLikeCount = Math.max(0, likes - 1);
      setLikes(newLikeCount);
      setHasLiked(false);

      await updateArticle("likes", newLikeCount, articleId);

      const likedArticles = JSON.parse(
        localStorage.getItem("likedArticles") || "{}"
      );
      delete likedArticles[articleId];
      localStorage.setItem("likedArticles", JSON.stringify(likedArticles));
    }

    const newDislikeCount = dislikes + 1;
    setDislikes(newDislikeCount);
    setHasDisliked(true);

    await updateArticle("dislikes", newDislikeCount, articleId);

    const dislikedArticles = JSON.parse(
      localStorage.getItem("dislikedArticles") || "{}"
    );
    dislikedArticles[articleId] = true;
    localStorage.setItem("dislikedArticles", JSON.stringify(dislikedArticles));

    toast.error("Article disliked!");
  }, [articleId, hasLiked, hasDisliked, likes, dislikes, isAuthenticated]);

  const handleShowSummary = async () => {
    try {
      if (showSummary) {
        setShowSummary(false);
        return;
      }

      setIsSummarizing(true);
      toast.info("Generating AI summary...");

      if (article) {
        const data = article.body;
        const summary = await summarizeText(data);
        setSummary(summary);
        setShowSummary(true);
        toast.success("Article summarized with AI!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to summarize article. Please try again.");
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("Please log in to post comments");
      return;
    }
    if (!comment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    const newComment = {
      id: Date.now().toString(),
      author: user?.username || "Anonymous",
      text: comment,
      date: new Date(),
    };

    setComments([...comments, newComment]);
    setComment("");
    toast.success("Comment posted!");
  };

  if (isLoading) {
    return <div className={`flex justify-center p-8 ${isDarkMode ? 'text-foreground-dark' : 'text-foreground'}`}>Loading article...</div>;
  }

  if (!article) {
    return <div className={`flex justify-center p-8 ${isDarkMode ? 'text-foreground-dark' : 'text-foreground'}`}>Article not found</div>;
  }

  const formattedDate = format(new Date(article.date), "MMMM dd, yyyy");

  return (
    <div className="max-w-4xl mx-auto">
      <div className={`shadow-md rounded-lg overflow-hidden ${isDarkMode ? 'bg-card-dark text-card-foreground-dark' : 'bg-card text-card-foreground'}`}>
        <div className="p-6 md:p-8">
          <div className={`mb-4 text-sm ${isDarkMode ? 'text-muted-foreground-dark' : 'text-muted-foreground'}`}>
            {article.category} • {formattedDate}
          </div>

          <div className="flex items-center justify-between mb-6">
            <h1 className={`text-3xl md:text-4xl font-bold ${isDarkMode ? 'text-foreground-dark' : 'text-foreground'}`}>
              {article.title}
            </h1>
            <Button
              onClick={handleShowSummary}
              className={`px-4 py-2 rounded-md bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90 transition`}
              disabled={isSummarizing}
            >
              {isSummarizing ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Generating...
                </span>
              ) : showSummary ? (
                "Hide Summary"
              ) : (
                "Summarize with AI"
              )}
            </Button>
          </div>

          <div className="flex items-center mb-8">
            <Avatar className="h-10 w-10">
              <AvatarFallback>
                {typeof article.authors === "string" ? article.authors[0] : "A"}
              </AvatarFallback>
            </Avatar>
            <div className="ml-3">
              <div className={`font-medium ${isDarkMode ? 'text-foreground-dark' : 'text-foreground'}`}>
                {article.authors}
              </div>
              <div className={`text-sm ${isDarkMode ? 'text-muted-foreground-dark' : 'text-muted-foreground'}`}>
                Author
              </div>
            </div>
          </div>

          <div className="aspect-video mb-8">
            <img
              src={article.image}
              alt={article.title}
              onError={handleImageError}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>

          {showSummary && (
            <Card className={`mb-8 border-l-4 border-blue-500 ${isDarkMode ? 'bg-blue-50/20' : 'bg-blue-50/50'}`}>
              <CardContent className="p-6">
                <div className="flex items-start">
                  <div className={`flex-shrink-0 p-2 rounded-full ${isDarkMode ? 'bg-blue-100/20' : 'bg-blue-100'}`}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-6 w-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className={`text-lg font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-900'} mb-2`}>
                      AI Summary
                    </h3>
                    {isSummarizing ? (
                      <div className="space-y-2">
                        <div className={`h-4 rounded ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'} animate-pulse`}></div>
                        <div className={`h-4 rounded ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'} animate-pulse w-5/6`}></div>
                        <div className={`h-4 rounded ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'} animate-pulse w-4/6`}></div>
                      </div>
                    ) : (
                      <p className={isDarkMode ? 'text-gray-400' : 'text-gray-700'}>
                        {summary || "No summary available"}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className={`prose max-w-none mb-8 ${isDarkMode ? 'text-foreground-dark' : 'text-foreground'}`}>
            <p className={`text-xl leading-relaxed mb-8 font-serif ${isDarkMode ? 'text-muted-foreground-dark' : 'text-muted-foreground'}`}>
              {article.summary}
            </p>
            {article.body.split("\n\n").map((paragraph, idx) => (
              <p key={idx} className="mb-4">
                {paragraph}
              </p>
            ))}
          </div>

          <div className={`flex flex-wrap items-center justify-between border-t border-b py-4 mb-8 ${isDarkMode ? 'border-border-dark' : 'border-border'}`}>
            <div className="flex items-center space-x-6 mb-4 md:mb-0">
              <Button
                variant="ghost"
                className={`flex items-center px-2 py-1 rounded-md ${
                  hasLiked ? (isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700') : (isDarkMode ? 'hover:bg-blue-500/10' : 'hover:bg-blue-50')
                } transition`}
                onClick={handleLike}
                title={
                  isAuthenticated
                    ? "Like this article"
                    : "Log in to like this article"
                }
              >
                <ThumbsUp
                  className={`h-5 w-5 mr-2 ${hasLiked ? "fill-current" : ""}`}
                />{" "}
                {likes}
              </Button>
              <Button
                variant="ghost"
                className={`flex items-center px-2 py-1 rounded-md ${
                  hasDisliked ? (isDarkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-700') : (isDarkMode ? 'hover:bg-red-500/10' : 'hover:bg-red-50')
                } transition`}
                onClick={handleDislike}
                title={
                  isAuthenticated
                    ? "Dislike this article"
                    : "Log in to dislike this article"
                }
              >
                <ThumbsDown
                  className={`h-5 w-5 mr-2 ${hasDisliked ? "fill-current" : ""}`}
                />{" "}
                {dislikes}
              </Button>
              <div className={`flex items-center ${isDarkMode ? 'text-muted-foreground-dark' : 'text-muted-foreground'}`}>
                <Eye className={`h-5 w-5 mr-2 ${isDarkMode ? 'text-muted-foreground-dark' : 'text-muted-foreground'}`} /> {views} Views
              </div>
            </div>
          </div>

          <div className={`border-t pt-8 ${isDarkMode ? 'border-border-dark' : 'border-border'}`}>
            <h3 className={`text-xl font-bold ${isDarkMode ? 'text-foreground-dark' : 'text-foreground'} mb-4`}>Comments ({comments.length})</h3>
            <p className={`mb-4 text-sm ${isDarkMode ? 'text-muted-foreground-dark' : 'text-muted-foreground'}`}>
              Please keep comments respectful and on-topic.
            </p>
            
            <form onSubmit={handleCommentSubmit} className="mb-6">
              <Textarea 
                value={comment} 
                onChange={(e) => setComment(e.target.value)} 
                placeholder="Add a comment..." 
                className={`mb-3 ${isDarkMode ? 'bg-background-dark text-foreground-dark border-border-dark' : 'bg-background text-foreground border-border'}`}
              />
              <Button type="submit">Post Comment</Button>
            </form>
            
            {comments.length > 0 ? (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className={`border-b pb-4 ${isDarkMode ? 'border-border-dark' : 'border-border'}`}>
                    <div className="flex items-center mb-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{comment.author[0]}</AvatarFallback>
                      </Avatar>
                      <div className="ml-2">
                        <div className={`font-medium ${isDarkMode ? 'text-foreground-dark' : 'text-foreground'}`}>{comment.author}</div>
                        <div className={`text-xs ${isDarkMode ? 'text-muted-foreground-dark' : 'text-muted-foreground'}`}>
                          {format(new Date(comment.date), "MMM dd, yyyy 'at' h:mm a")}
                        </div>
                      </div>
                    </div>
                    <p className={isDarkMode ? 'text-foreground-dark' : 'text-foreground'}>{comment.text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className={`text-muted-foreground flex items-center justify-center py-8 ${isDarkMode ? 'text-muted-foreground-dark' : 'text-muted-foreground'}`}>
                <MessageSquare className={`mr-2 h-5 w-5 ${isDarkMode ? 'text-muted-foreground-dark' : 'text-muted-foreground'}`} />
                No comments yet. Be the first to comment!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticlePage;