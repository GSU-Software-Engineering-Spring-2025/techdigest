
import { Category } from "@/data/categories";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

interface CategoryCardProps {
  category: Category;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  return (
    <Link to={`/category/${category.id}`}>
      <Card className={`h-32 transition-transform hover:scale-105 overflow-hidden relative ${category.color}`}>
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/70"></div>
        <CardContent className="p-4 flex flex-col justify-end h-full relative z-10">
          <h3 className="text-xl font-bold text-white">{category.name}</h3>
          <p className="text-white/80 text-sm line-clamp-1">{category.description}</p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default CategoryCard;
