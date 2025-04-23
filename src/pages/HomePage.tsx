import { categories } from "@/data/categories";
import { useState, useEffect } from "react";
import { getMostViewedArticle } from "@/data/articles";
import FeaturedArticle from "@/components/FeaturedArticle";
import CategoryCard from "@/components/CategoryCard";
import ArticleCard from "@/components/ArticleCard";
import { initializeArticles } from "@/data/newsArticles.js";

const HomePage = () => {
  const [recentArticles, setRecentArticles] = useState([]);
  const [featuredArticle, setFeaturedArticle] = useState({
    id: "",
    title: "",
    summary: "",
    body: "",
    authors: "",
    date: "",
    image: "",
    url: "",
    source: "",
    category: "",
    likes: 0,
    dislikes: 0,
    views: 0,
  });

  useEffect(() => {
    document.title = "TechDigest - The Latest in Technology News";

    const loadArticles = async () => {
      const articles = await initializeArticles();
      setRecentArticles(articles);

      if (articles.length > 0) {
        const topViewedArticle = getMostViewedArticle(articles);
        setFeaturedArticle(topViewedArticle);
      }
    };

    loadArticles();
  }, []);

  return (
    <div>
      <section className="mb-12">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-tech-dark-gray">
            Most Popular Article
          </h2>
          <div className="h-1 w-20 bg-tech-purple mt-2"></div>
        </div>
        {featuredArticle.id ? (
          <FeaturedArticle article={featuredArticle} />
        ) : (
          <div className="bg-gray-100 p-6 rounded-lg animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
            <div className="h-64 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        )}
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
          <h2 className="text-2xl font-bold text-tech-dark-gray">
            Recent Articles
          </h2>
          <div className="h-1 w-20 bg-tech-purple mt-2"></div>
        </div>
        {recentArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentArticles.slice(0, 6).map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-gray-100 p-4 rounded-lg animate-pulse">
                <div className="h-40 bg-gray-200 rounded mb-3"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
