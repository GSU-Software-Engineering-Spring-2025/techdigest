
import { categories } from "@/data/categories";
import { getMostViewedArticle, articles } from "@/data/articles";
import FeaturedArticle from "@/components/FeaturedArticle";
import CategoryCard from "@/components/CategoryCard";
import ArticleCard from "@/components/ArticleCard";
import { useEffect } from "react";

const HomePage = () => {
  const featuredArticle = getMostViewedArticle();
  const recentArticles = [...articles].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  }).slice(0, 6);
  
  useEffect(() => {
    // TODO: Fetch featured articles and categories from API
    document.title = "TechDigest - The Latest in Technology News";
  }, []);
  
  return (
    <div>
      <section className="mb-12">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-tech-dark-gray">Most Popular Article</h2>
          <div className="h-1 w-20 bg-tech-purple mt-2"></div>
        </div>
        <FeaturedArticle article={featuredArticle} />
      </section>
      
      <section className="mb-12">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-tech-dark-gray">Categories</h2>
          <div className="h-1 w-20 bg-tech-purple mt-2"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>
      
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-tech-dark-gray">Recent Articles</h2>
          <div className="h-1 w-20 bg-tech-purple mt-2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
