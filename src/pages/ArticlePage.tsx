
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getArticleById } from "@/data/articles";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Eye, ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { toast } from "@/components/ui/sonner";

const ArticlePage = () => {
  const { articleId } = useParams<{ articleId: string }>();
  const article = getArticleById(articleId || "");
  
  const [likes, setLikes] = useState(article?.likes || 0);
  const [dislikes, setDislikes] = useState(article?.dislikes || 0);
  const [views, setViews] = useState(article?.views || 0);
  const [showSummary, setShowSummary] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<Array<{id: number; author: string; text: string; date: Date}>>([]);
  
  useEffect(() => {
    // TODO: Fetch article data from API
    // TODO: Track article view
    if (article) {
      document.title = `${article.title} - TechDigest`;
      // Increment views for demo purposes
      setViews(article.views + 1);
    }
  }, [article]);
  
  const handleLike = () => {
    setLikes(prev => prev + 1);
    toast.success("Article liked!");
    // TODO: Send like to API
  };
  
  const handleDislike = () => {
    setDislikes(prev => prev + 1);
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
        date: new Date()
      };
      setComments(prev => [newComment, ...prev]);
      setComment("");
      toast.success("Comment posted!");
      // TODO: Send comment to API
    }
  };
  
  if (!article) {
    return <div>Article not found</div>;
  }
  
  const formattedDate = format(new Date(article.date), "MMMM dd, yyyy");
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6 md:p-8">
          <div className="mb-4 text-sm text-gray-500">
            {article.category} • {formattedDate}
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-6">{article.title}</h1>
          
          <div className="flex items-center mb-8">
            <Avatar className="h-10 w-10">
              <AvatarFallback>{article.author[0]}</AvatarFallback>
            </Avatar>
            <div className="ml-3">
              <div className="font-medium">{article.author}</div>
              <div className="text-sm text-gray-500">Author</div>
            </div>
          </div>
          
          <div className="aspect-video mb-8">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          
          <div className="prose max-w-none mb-8">
            <p className="mb-4 text-lg leading-relaxed">{article.preview}</p>
            {article.content.split('\n\n').map((paragraph, idx) => (
              <p key={idx} className="mb-4">{paragraph}</p>
            ))}
          </div>
          
          <div className="flex flex-wrap items-center justify-between border-t border-b py-4 mb-8">
            <div className="flex items-center space-x-6 mb-4 md:mb-0">
              <Button variant="ghost" className="flex items-center" onClick={handleLike}>
                <ThumbsUp className="h-5 w-5 mr-2" /> {likes}
              </Button>
              <Button variant="ghost" className="flex items-center" onClick={handleDislike}>
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
                <p>This article discusses {article.title.toLowerCase()} and its implications for the technology industry. The key points include advancements in {article.category}, potential applications, and future developments in this field. The author highlights the significance of these technologies and how they might impact various industries in the coming years.</p>
              </CardContent>
            </Card>
          )}
          
          <div className="border-t pt-8">
            <h3 className="text-xl font-bold mb-4">Comments ({comments.length})</h3>
            
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
                        <div className="text-xs text-gray-500">{format(comment.date, "MMM dd, yyyy 'at' h:mm a")}</div>
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
