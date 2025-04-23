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

const ArticlePage = () => {
  const { articleId } = useParams<{ articleId: string }>();
  const location = useLocation();

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
    if (articleId) {
      const likedArticles = JSON.parse(
        localStorage.getItem("likedArticles") || "{}"
      );
      const dislikedArticles = JSON.parse(
        localStorage.getItem("dislikedArticles") || "{}"
      );

      setHasLiked(!!likedArticles[articleId]);
      setHasDisliked(!!dislikedArticles[articleId]);
    }
  }, [articleId, passedArticle]);

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
  }, [articleId, hasLiked, hasDisliked, likes, dislikes]);

  const handleDislike = useCallback(async () => {
    if (!articleId) return;

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
  }, [articleId, hasLiked, hasDisliked, likes, dislikes]);

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

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading article...</div>;
  }

  if (!article) {
    return <div className="flex justify-center p-8">Article not found</div>;
  }

  const formattedDate = format(new Date(article.date), "MMMM dd, yyyy");

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6 md:p-8">
          <div className="mb-4 text-sm text-gray-500">
            {article.category} • {formattedDate}
          </div>

          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl md:text-4xl font-bold">{article.title}</h1>
            <Button
              onClick={handleShowSummary}
              className="px-4 py-2 rounded-md bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90 transition"
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
              <div className="font-medium">{article.authors}</div>
              <div className="text-sm text-gray-500">Author</div>
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
            <Card className="mb-8 border-l-4 border-blue-500 bg-blue-50/50">
              <CardContent className="p-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 p-2 bg-blue-100 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-blue-600"
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
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      AI Summary
                    </h3>
                    {isSummarizing ? (
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-4/6"></div>
                      </div>
                    ) : (
                      <p className="text-gray-700">
                        {summary || "No summary available"}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="prose max-w-none mb-8">
            <p className="mb-4 text-lg leading-relaxed">{article.summary}</p>
            {article.body.split("\n\n").map((paragraph, idx) => (
              <p key={idx} className="mb-4">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between border-t border-b py-4 mb-8">
            <div className="flex items-center space-x-6 mb-4 md:mb-0">
              <Button
                variant="ghost"
                className={`flex items-center px-2 py-1 rounded-md ${
                  hasLiked ? "bg-blue-100 text-blue-700" : "hover:bg-blue-50"
                } transition`}
                onClick={handleLike}
              >
                <ThumbsUp
                  className={`h-5 w-5 mr-2 ${hasLiked ? "fill-current" : ""}`}
                />{" "}
                {likes}
              </Button>
              <Button
                variant="ghost"
                className={`flex items-center px-2 py-1 rounded-md ${
                  hasDisliked ? "bg-red-100 text-red-700" : "hover:bg-red-50"
                } transition`}
                onClick={handleDislike}
              >
                <ThumbsDown
                  className={`h-5 w-5 mr-2 ${
                    hasDisliked ? "fill-current" : ""
                  }`}
                />{" "}
                {dislikes}
              </Button>
              <div className="flex items-center text-gray-500">
                <Eye className="h-5 w-5 mr-2" /> {views} Views
              </div>
            </div>

            <Button
              onClick={handleShowSummary}
              className="px-4 py-2 rounded-md bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90 transition"
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
        </div>
      </div>
    </div>
  );
};

export default ArticlePage;
