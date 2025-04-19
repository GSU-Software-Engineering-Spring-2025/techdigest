
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getArticlesByCategory } from "@/data/articles";
import { getCategoryById } from "@/data/categories";
import ArticleCard from "@/components/ArticleCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type SortOption = "az" | "za" | "newest" | "oldest";

const CategoryPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  
  const category = getCategoryById(categoryId || "");
  const categoryArticles = getArticlesByCategory(category?.name || "");
  
  const [sortedArticles, setSortedArticles] = useState(categoryArticles);
  
  useEffect(() => {
    // TODO: Fetch articles by category from API
    if (category) {
      document.title = `${category.name} Articles - TechDigest`;
    }
    
    const articles = [...categoryArticles];
    
    switch (sortOption) {
      case "az":
        articles.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "za":
        articles.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "newest":
        articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case "oldest":
        articles.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
    }
    
    setSortedArticles(articles);
  }, [category, categoryArticles, sortOption]);
  
  if (!category) {
    return <div>Category not found</div>;
  }
  
  return (
    <div>
      <header className={`p-8 rounded-lg mb-8 ${category.color} text-white`}>
        <h1 className="text-3xl font-bold">{category.name}</h1>
        <p className="mt-2">{category.description}</p>
      </header>
      
      <div className="mb-6">
        <Tabs defaultValue="newest" onValueChange={(value) => setSortOption(value as SortOption)}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Articles</h2>
            <TabsList>
              <TabsTrigger value="newest">Newest</TabsTrigger>
              <TabsTrigger value="oldest">Oldest</TabsTrigger>
              <TabsTrigger value="az">A-Z</TabsTrigger>
              <TabsTrigger value="za">Z-A</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="newest">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="oldest">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="az">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="za">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CategoryPage;
