import { Article } from "@/data/articles";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Eye } from "lucide-react";
import { useTheme } from '../context/ThemeContext'; // Add this import for theme support

interface FeaturedArticleProps {
  article: Article;
}

const FeaturedArticle: React.FC<FeaturedArticleProps> = ({ article }) => {
  const { theme } = useTheme(); // Add theme hook
  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    const target = e.target as HTMLImageElement;
    target.src = "/src/components/ui/placeholder.png";
    target.onerror = null;
  };

  return (
    <div className={`rounded-lg overflow-hidden shadow-lg ${theme === 'light' ? 'bg-card text-card-foreground' : 'bg-[hsl(262,83.3%,10%)] text-card-foreground-dark'} mb-8 border ${theme === 'light' ? 'border-border' : 'border-border-dark'} shadow-xl hover:scale-[1.02] transition-transform duration-300`}>
      <div className="md:flex">
        <div className="md:w-1/2">
          <div className="h-64 md:h-full relative">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover"
              onError={handleImageError}
            />
            <div className={`absolute top-4 left-4 ${theme === 'light' ? 'bg-primary text-primary-foreground' : 'bg-primary-dark text-primary-foreground-dark'} px-3 py-1 rounded-md text-sm font-medium shadow-md`}>
              {article.category}
            </div>
          </div>
        </div>

        <div className="md:w-1/2 p-6">
          <div className={`flex items-center text-sm ${theme === 'light' ? 'text-muted-foreground' : 'text-muted-foreground-dark'} mb-2`}>
            <span>{new Date(article.date).toLocaleDateString()}</span>
            <span className="mx-2">•</span>
            <span className="flex items-center">
              <Eye className={`h-4 w-4 mr-1 ${theme === 'light' ? 'text-muted-foreground' : 'text-muted-foreground-dark'}`} />
              {article.views} views
            </span>
          </div>

          <h2 className={`text-2xl md:text-3xl font-bold ${theme === 'light' ? 'text-foreground' : 'text-foreground-dark'} mb-4`}>
            {article.title}
          </h2>
          <p className={`mb-6 line-clamp-3 ${theme === 'light' ? 'text-muted-foreground' : 'text-muted-foreground-dark'}`}>
            {article.summary}
          </p>

          <div className="flex justify-between items-center">
            <div className={`font-medium ${theme === 'light' ? 'text-foreground' : 'text-foreground-dark'}`}>
              {article.authors}
            </div>
            <Link to={`/article/${article.id}`}>
              <Button variant="outline" className={`px-4 py-2 flex items-center ${theme === 'light' ? '' : 'border-border-dark text-foreground-dark'}`}>
                Read More <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedArticle;