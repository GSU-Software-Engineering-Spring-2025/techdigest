import { useState } from "react";
import { Article } from "@/data/articles";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, ThumbsUp, ThumbsDown } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { summarizeText } from "@/services/openai";
import { toast } from "@/components/ui/use-toast";

interface ArticleCardProps {
  article: Article;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  const [summary, setSummary] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const formattedDate = format(new Date(article.date), "MMM dd, yyyy");

  const handleSummarize = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    try {
      // Log the content we're about to summarize
      console.log("Article content to summarize:", article.content || article.preview);
      
      const textToSummarize = article.content || article.preview;
      if (!textToSummarize || textToSummarize.length < 10) {
        throw new Error("Insufficient content to summarize");
      }

      // Trim and clean the text
      const cleanedText = textToSummarize.trim().replace(/\s+/g, ' ');
      
      // Log the API call
      console.log("Calling OpenAI API...");
      const result = await summarizeText(cleanedText);
      
      if (!result) {
        throw new Error("No summary received from API");
      }

      console.log("Summary received:", result);
      setSummary(result);
      
      // Show success toast
      toast({
        title: "Summary Generated",
        description: "The article has been successfully summarized.",
        variant: "default",
      });

    } catch (error) {
      console.error("Failed to summarize:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error 
          ? error.message 
          : "Failed to generate summary. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="overflow-hidden h-full transition-shadow hover:shadow-lg">
      <div className="p-4 border-b">
        <Button 
          onClick={handleSummarize}
          disabled={isLoading}
          variant="outline"
          className="w-full"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <span className="animate-spin">⏳</span>
              Summarizing...
            </div>
          ) : (
            "Summarize with AI"
          )}
        </Button>
        {summary && (
          <div className="mt-3 p-3 bg-gray-50 rounded-md text-sm">
            {summary}
          </div>
        )}
      </div>
      <Link to={`/article/${article.id}`}>
        <div className="aspect-video relative overflow-hidden">
          <img
            src={article.imageUrl} 
            alt={article.title}
            className="object-cover w-full h-full"
          />
          <div className="absolute bottom-0 left-0 bg-tech-purple text-white px-3 py-1 text-sm">
            {article.category}
          </div>
        </div>
        
        <CardHeader className="p-4">
          <CardTitle className="text-xl line-clamp-2">{article.title}</CardTitle>
        </CardHeader>
        
        <CardContent className="p-4 pt-0">
          <p className="text-gray-600 line-clamp-3">{article.preview}</p>
        </CardContent>
        
        <CardFooter className="p-4 flex justify-between text-sm text-gray-500">
          <div>{formattedDate}</div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Eye className="h-4 w-4 mr-1" />
              <span>{article.views}</span>
            </div>
            <div className="flex items-center">
              <ThumbsUp className="h-4 w-4 mr-1" />
              <span>{article.likes}</span>
            </div>
            <div className="flex items-center">
              <ThumbsDown className="h-4 w-4 mr-1" />
              <span>{article.dislikes}</span>
            </div>
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
};

export default ArticleCard;
