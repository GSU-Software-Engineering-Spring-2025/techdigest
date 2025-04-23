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
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<
    Array<{ id: number; author: string; text: string; date: Date }>
  >([]);
  const [isLoading, setIsLoading] = useState(!passedArticle);

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
        let foundArticle = getArticleById(articleId);

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
      // Increment views for demo purposes
      setViews((prev) => prev + 1);
    }
  }, [article]);

  const handleLike = () => {
    setLikes((prev) => prev + 1);
    toast.success("Article liked!");
    // TODO: Send like to API
  };

  const handleDislike = () => {
    setDislikes((prev) => prev + 1);
    toast.error("Article disliked!");
    // TODO: Send dislike to API
  };

  const handleShowSummary = () => {
    // TODO: Call AI summary API
    setShowSummary(true);
    toast.success("Article summarized with AI!");
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

          <h1 className="text-3xl md:text-4xl font-bold mb-6">
            {article.title}
          </h1>

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
                className="flex items-center"
                onClick={handleLike}
              >
                <ThumbsUp className="h-5 w-5 mr-2" /> {likes}
              </Button>
              <Button
                variant="ghost"
                className="flex items-center"
                onClick={handleDislike}
              >
                <ThumbsDown className="h-5 w-5 mr-2" /> {dislikes}
              </Button>
              <div className="flex items-center text-gray-500">
                <Eye className="h-5 w-5 mr-2" /> {views} Views
              </div>
            </div>

            <Button onClick={handleShowSummary}>Summarize with AI</Button>
          </div>

          {showSummary && (
            <Card className="mb-8 border-l-4 border-tech-purple">
              <CardContent className="p-4">
                <h3 className="font-bold mb-2">AI Summary</h3>
                <p>
                  This article discusses {article.title.toLowerCase()} and its
                  implications for the technology industry. The key points
                  include advancements in {article.category}, potential
                  applications, and future developments in this field. The
                  author highlights the significance of these technologies and
                  how they might impact various industries in the coming years.
                </p>
              </CardContent>
            </Card>
          )}

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
              <Button type="submit">Post Comment</Button>
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
