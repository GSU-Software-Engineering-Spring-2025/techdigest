import { useParams, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { getArticleById, getArticlesByCategory } from "@/data/articles";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Eye, ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { toast } from "@/components/ui/sonner";
import { updateArticle } from "@/data/articles";
import { summarizeText } from "@/services/openai";

const ArticlePage = () => {
  const { articleId } = useParams<{ articleId: string }>();
  const location = useLocation();

  // Try to get article from location state (passed from CategoryPage)
  const passedArticle = location.state?.articleData;

  const [article, setArticle] = useState(passedArticle);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [views, setViews] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<
    Array<{ id: number; author: string; text: string; date: Date }>
  >([]);
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
      // If article wasn't passed via state, try to fetch it
      if (!passedArticle && articleId) {
        setIsLoading(true);

        // First try the standard method
        let foundArticle = await getArticleById(articleId);

        // If not found, we need to find which category it belongs to and fetch it
        if (!foundArticle) {
          // This approach requires checking each category
          // You might want to add a new API endpoint that gets article by ID directly
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
        // Initialize with passed article data
        setLikes(passedArticle.likes || 0);
        setDislikes(passedArticle.dislikes || 0);
        setViews(passedArticle.views || 0);
      }
    };

    fetchArticle();
  }, [articleId, passedArticle]);

  useEffect(() => {
    if (article) {
      document.title = `${article.title} - TechDigest`;
      setViews((prev) => prev + 1);
      updateArticle("views", views + 1, articleId);
      setViews(article.views + 1); // Increment views for demo purposes
    }
  }, [article]);

  const handleLike = () => {
    setLikes((prev) => prev + 1);
    updateArticle("likes", likes + 1, articleId);
    toast.success("Article liked!");
  };

  const handleDislike = () => {
    setDislikes((prev) => prev + 1);
    toast.error("Article disliked!");
    updateArticle("dislikes", dislikes + 1, articleId);
  };

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

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      const newComment = {
        id: Date.now(),
        author: "Anonymous User",
        text: comment,
        date: new Date(),
      };
      setComments((prev) => [newComment, ...prev]);
      setComment("");
      toast.success("Comment posted!");
      // TODO: Send comment to API
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

          {/* Header with title and top right summarize button */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl md:text-4xl font-bold">{article.title}</h1>
            <Button
              onClick={handleShowSummary}
              className="px-4 py-2 rounded-md bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90 transition"
            >
              Summarize with AI
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

          {/* AI Summary appears at the top before the content */}
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

          {/* Bottom controls including summarize button */}
          <div className="flex flex-wrap items-center justify-between border-t border-b py-4 mb-8">
            <div className="flex items-center space-x-6 mb-4 md:mb-0">
              <Button
                variant="ghost"
                className="flex items-center px-2 py-1 rounded-md hover:bg-blue-50 transition"
                onClick={handleLike}
              >
                <ThumbsUp className="h-5 w-5 mr-2" /> {likes}
              </Button>
              <Button
                variant="ghost"
                className="flex items-center px-2 py-1 rounded-md hover:bg-red-50 transition"
                onClick={handleDislike}
              >
                <ThumbsDown className="h-5 w-5 mr-2" /> {dislikes}
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

          <div className="border-t pt-8">
            <h3 className="text-xl font-bold mb-4">
              Comments ({comments.length})
            </h3>

            <form onSubmit={handleCommentSubmit} className="mb-6">
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                className="mb-3"
              />
              <Button
                type="submit"
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Post Comment
              </Button>
            </form>

            {comments.length > 0 ? (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="border-b pb-4">
                    <div className="flex items-center mb-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{comment.author[0]}</AvatarFallback>
                      </Avatar>
                      <div className="ml-2">
                        <div className="font-medium">{comment.author}</div>
                        <div className="text-xs text-gray-500">
                          {format(comment.date, "MMM dd, yyyy 'at' h:mm a")}
                        </div>
                      </div>
                    </div>
                    <p>{comment.text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 flex items-center justify-center py-8">
                <MessageSquare className="mr-2 h-5 w-5" />
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
