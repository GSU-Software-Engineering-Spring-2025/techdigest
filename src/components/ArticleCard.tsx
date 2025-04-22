import { Article } from "@/data/articles";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, ThumbsUp, ThumbsDown } from "lucide-react";
import { format } from "date-fns";

interface ArticleCardProps {
  article: Article;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  const formattedDate = format(new Date(article.date), "MMM dd, yyyy");
  
  return (
    <Card className="overflow-hidden h-full transition-shadow hover:shadow-lg bg-card text-card-foreground">
      <Link to={`/article/${article.id}`}>
        <div className="aspect-video relative overflow-hidden">
          <img
            src={article.imageUrl} 
            alt={article.title}
            className="object-cover w-full h-full"
          />
          <div className="absolute bottom-0 left-0 bg-primary text-primary-foreground px-3 py-1 text-sm">
            {article.category}
          </div>
        </div>
        
        <CardHeader className="p-4">
          <CardTitle className="text-xl line-clamp-2 text-foreground">{article.title}</CardTitle>
        </CardHeader>
        
        <CardContent className="p-4 pt-0">
          <p className="text-muted-foreground line-clamp-3">{article.preview}</p>
        </CardContent>
        
        <CardFooter className="p-4 flex justify-between text-sm text-muted-foreground">
          <div>{formattedDate}</div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Eye className="h-4 w-4 mr-1 text-muted-foreground" />
              <span>{article.views}</span>
            </div>
            <div className="flex items-center">
              <ThumbsUp className="h-4 w-4 mr-1 text-muted-foreground" />
              <span>{article.likes}</span>
            </div>
            <div className="flex items-center">
              <ThumbsDown className="h-4 w-4 mr-1 text-muted-foreground" />
              <span>{article.dislikes}</span>
            </div>
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
};

export default ArticleCard;