// import { Article } from "@/data/articles";
import {
  articles as newsArticles,
  fetchArticlesByCat,
} from "@/data/newsArticles.js";
import supabase from "@/lib/supabase";

export interface Article {
  id: string;
  title: string;
  summary: string;
  body: string;
  authors: string;
  date: string;
  image: string;
  url: string;
  source: string;
  category: string;
  likes: number;
  dislikes: number;
  views: number;
}

console.log(newsArticles);
export const articles = await newsArticles;

export const getMostViewedArticle = (): Article => {
  return articles.reduce((prev, current) =>
    prev.views > current.views ? prev : current
  );
};

export const getArticlesByCategory = async (
  category: string
): Promise<Article[]> => {
  return await fetchArticlesByCat(category);
};

export const getArticleById = async (
  id: string
): Promise<Article | undefined> => {
  try {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    if (data) {
      const article: Article = {
        id: data.id,
        title: data.title,
        summary: data.summary,
        body: data.body,
        authors: data.authors,
        date: data.date,
        image: data.image,
        url: data.url,
        source: data.source,
        category: data.category,
        likes: data.likes,
        dislikes: data.dislikes,
        views: data.views,
      };
      return article;
    } else {
      return undefined;
    }
  } catch (error) {
    console.error("Error fetching article:", error.message);
    return undefined;
  }
};

export const updateArticle = async (
  col: string,
  value: any,
  articleId: string
): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from("articles")
      .update({
        [col]: value,
      })
      .eq("id", articleId)
      .select();
    if (error) throw error;
    console.log("Article updated:", data);
  } catch (error) {
    console.error("Error updating article:", error.message);
  }
};
