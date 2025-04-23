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
import { useTheme } from '../context/ThemeContext'; // Add this import for theme support

interface ArticleCardProps {
  article: Article;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  const { theme } = useTheme(); // Add theme hook
  const formattedDate = format(new Date(article.date), "MMM dd, yyyy");

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    const target = e.target as HTMLImageElement;
    target.src = "/src/components/ui/placeholder.png";
    target.onerror = null;
  };

  return (
    <Card className={`overflow-hidden h-full transition-shadow hover:shadow-lg ${theme === 'light' ? 'bg-card text-card-foreground' : 'bg-card-dark text-card-foreground-dark'}`}>
      <Link to={`/article/${article.id}`} state={{ articleData: article }}>
        <div className="aspect-video relative overflow-hidden">
          <img
            src={article.image}
            alt={article.title}
            className="object-cover w-full h-full"
            onError={handleImageError}
          />
          <div className="absolute bottom-0 left-0 bg-primary text-primary-foreground px-3 py-1 text-sm">
            {article.category}
          </div>
        </div>

        <CardHeader className="p-4">
          <CardTitle className={`text-xl line-clamp-2 ${theme === 'light' ? 'text-foreground' : 'text-foreground-dark'}`}>
            {article.title}
          </CardTitle>
        </CardHeader>

        <CardContent className="p-4 pt-0">
          <p className={`line-clamp-3 ${theme === 'light' ? 'text-muted-foreground' : 'text-muted-foreground-dark'}`}>
            {article.summary}
          </p>
        </CardContent>

        <CardFooter className={`p-4 flex justify-between text-sm ${theme === 'light' ? 'text-muted-foreground' : 'text-muted-foreground-dark'}`}>
          <div>{formattedDate}</div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Eye className={`h-4 w-4 mr-1 ${theme === 'light' ? 'text-muted-foreground' : 'text-muted-foreground-dark'}`} />
              <span>{article.views}</span>
            </div>
            <div className="flex items-center">
              <ThumbsUp className={`h-4 w-4 mr-1 ${theme === 'light' ? 'text-muted-foreground' : 'text-muted-foreground-dark'}`} />
              <span>{article.likes}</span>
            </div>
            <div className="flex items-center">
              <ThumbsDown className={`h-4 w-4 mr-1 ${theme === 'light' ? 'text-muted-foreground' : 'text-muted-foreground-dark'}`} />
              <span>{article.dislikes}</span>
            </div>
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
};

export default ArticleCard;