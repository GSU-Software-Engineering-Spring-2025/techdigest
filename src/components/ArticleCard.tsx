import { useState } from "react";
import { Article } from "@/data/articles";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, ThumbsUp, ThumbsDown } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { summarizeText } from "@/services/openai";

interface ArticleCardProps {
  article: Article;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  const [summary, setSummary] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const formattedDate = format(new Date(article.date), "MMM dd, yyyy");

  const handleSummarize = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    if (isLoading) return;

    setIsLoading(true);
    try {
      const result = await summarizeText(article.content);
      setSummary(result);
    } catch (error) {
      console.error("Failed to summarize:", error);
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
          {isLoading ? "Summarizing..." : "Summarize with AI"}
        </Button>
        {summary && (
          <div className="mt-3 p-3 bg-gray-50 rounded-md text-sm">
            {summary}
          </div>
        )}
      </div>
      <Link to={`/article/${article.id}`}>
        {/* ...existing code... */}
      </Link>
    </Card>
  );
};

export default ArticleCard;
