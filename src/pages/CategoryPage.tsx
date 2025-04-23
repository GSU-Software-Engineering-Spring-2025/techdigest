import { useParams } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { getArticlesByCategory } from "@/data/articles";
import { getCategoryById } from "@/data/categories";
import ArticleCard from "@/components/ArticleCard";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Article } from '@/data/articles';
import { useTheme } from '@/context/ThemeContext'; // Add this import

type SortOption = "az" | "za" | "newest" | "oldest";

const CategoryPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { isDarkMode } = useTheme(); // Add theme hook
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [articles, setArticles] = useState<Article[]>([]);
  const [category, setCategory] = useState(getCategoryById(categoryId || ""));
  const [categoryArticles, setCategoryArticles] = useState<any[]>([]);
  const [sortedArticles, setSortedArticles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (categoryId) {
        const cat = getCategoryById(categoryId);
        setCategory(cat);

        if (cat) {
          // Simulate network delay for demo purposes (remove in production)
          await new Promise((resolve) => setTimeout(resolve, 1000));
          const articles = await getArticlesByCategory(cat.name);
          setCategoryArticles(articles);
          setSortedArticles(articles);
          document.title = `${cat.name} Articles - TechDigest`;
        }
        setIsLoading(false);
      }
    };

    fetchData();
  }, [categoryId]);

  useEffect(() => {
    if (categoryArticles.length > 0) {
      const articles = [...categoryArticles];

      switch (sortOption) {
        case "az":
          articles.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case "za":
          articles.sort((a, b) => b.title.localeCompare(a.title));
          break;
        case "newest":
          articles.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );
          break;
        case "oldest":
          articles.sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          );
          break;
      }

      setSortedArticles(articles);
    }
  }, [sortOption, categoryArticles]);

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-8">
        {/* Header Skeleton */}
        <div className={`h-40 rounded-lg mb-8 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>

        {/* Tabs Skeleton */}
        <div className="flex items-center justify-between mb-6">
          <div className={`h-8 w-48 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
          <div className="flex space-x-2">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className={`h-10 w-20 rounded-md ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
              ></div>
            ))}
          </div>
        </div>

        {/* Articles Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-4">
              <div className={`h-48 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
              <div className={`h-4 rounded w-3/4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
              <div className={`h-4 rounded w-1/2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
              <div className={`h-4 rounded w-1/4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-4xl mb-4">😕</div>
        <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          Category not found
        </h2>
        <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
          The category you're looking for doesn't exist.
        </p>
      </div>
    );
  }

  return (
    <div>
      <header className={`p-8 rounded-lg mb-8 ${category.color} ${isDarkMode ? 'text-foreground-dark' : 'text-foreground'}`}>
        <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-foreground-dark' : 'text-foreground'}`}>
          {category.name}
        </h1>
        <p className={`mt-2 ${isDarkMode ? 'text-foreground-dark' : 'text-foreground'}`}>
          {category.description}
        </p>
      </header>

      <div className="mb-6">
        <Tabs
          defaultValue="newest"
          onValueChange={(value) => setSortOption(value as SortOption)}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-xl font-bold ${isDarkMode ? 'text-foreground-dark' : 'text-foreground'}`}>
              Articles
            </h2>
            <TabsList>
              <TabsTrigger value="newest">Newest</TabsTrigger>
              <TabsTrigger value="oldest">Oldest</TabsTrigger>
              <TabsTrigger value="az">A-Z</TabsTrigger>
              <TabsTrigger value="za">Z-A</TabsTrigger>
            </TabsList>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default CategoryPage;