
import { categories } from "@/data/categories";
import CategoryCard from "@/components/CategoryCard";
import { useEffect } from "react";

const CategoriesPage = () => {
  useEffect(() => {
    // TODO: Fetch categories from API
    document.title = "Categories - TechDigest";
  }, []);
  
  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-tech-dark-gray">Categories</h1>
        <p className="text-gray-500 mt-2">
          Explore tech news by topic - from AI to quantum computing
        </p>
      </header>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
};

export default CategoriesPage;
