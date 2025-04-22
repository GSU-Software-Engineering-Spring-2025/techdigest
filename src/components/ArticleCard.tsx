import { Article } from "@/data/articles";
import { Link } from "react-router-dom";
import { Eye, ThumbsUp, ThumbsDown } from "lucide-react";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ArticleCardProps {
  article: Article;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  const formattedDate = format(new Date(article.date), "MMM dd, yyyy");

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    const target = e.target as HTMLImageElement;
    target.src = "/src/components/ui/placeholder.png";
    target.onerror = null;
  };

  return (
    <Card className="overflow-hidden h-full transition-shadow hover:shadow-lg">
      <Link to={`/article/${article.id}`}>
        <div className="aspect-video relative overflow-hidden">
          <img
            src={article.image}
            alt={article.title}
            className="object-cover w-full h-full"
            onError={handleImageError}
          />
          <div className="absolute bottom-0 left-0 bg-tech-purple text-white px-3 py-1 text-sm">
            {article.category}
          </div>
        </div>

        <CardHeader className="p-4">
          <CardTitle className="text-xl line-clamp-2">
            {article.title}
          </CardTitle>
        </CardHeader>

        <CardContent className="p-4 pt-0">
          <p className="text-gray-600 line-clamp-3">{article.summary}</p>
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
