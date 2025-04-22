import axios from 'axios';

const API_URL = 'http://localhost:8000'; // Your FastAPI backend URL

const fetchArticles = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/articles`);
        return response.data;
    } catch (error) {
        console.error('Error fetching articles:', error);
        return [];
    }
};

export const fetchArticlesByCat = async (category) => {
    try {
        const response = await axios.get(`${API_URL}/api/articles/${category}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching articles:', error);
        return [];
    }

}

export const articles = await fetchArticles();