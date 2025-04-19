
import { Article } from "@/data/articles";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Eye } from "lucide-react";

interface FeaturedArticleProps {
  article: Article;
}

const FeaturedArticle: React.FC<FeaturedArticleProps> = ({ article }) => {
  return (
    <div className="rounded-lg overflow-hidden shadow-lg bg-white mb-8">
      <div className="md:flex">
        <div className="md:w-1/2">
          <div className="h-64 md:h-full relative">
            <img 
              src={article.imageUrl} 
              alt={article.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 bg-tech-purple text-white px-3 py-1 rounded-md text-sm font-medium">
              {article.category}
            </div>
          </div>
        </div>
        
        <div className="md:w-1/2 p-6">
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <span>{new Date(article.date).toLocaleDateString()}</span>
            <span className="mx-2">•</span>
            <span className="flex items-center">
              <Eye className="h-4 w-4 mr-1" />
              {article.views} views
            </span>
          </div>
          
          <h2 className="text-2xl md:text-3xl font-bold mb-4">{article.title}</h2>
          <p className="text-gray-600 mb-6 line-clamp-3">{article.preview}</p>
          
          <div className="flex justify-between items-center">
            <div className="font-medium">{article.author}</div>
            <Link to={`/article/${article.id}`}>
              <Button variant="outline" className="flex items-center">
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
