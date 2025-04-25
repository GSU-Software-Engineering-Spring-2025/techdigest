import axios from 'axios';
import supabase from '../lib/supabase';

const API_URL = 'https://tiger-diegest-40937983b1dd.herokuapp.com';

async function upsertToArticleTable(articles) {
    try {
        const upsertPromises = articles.map(async (article) => {
            const { data, error } = await supabase
                .from('articles')
                .upsert(article)
                .select();

            if (error) throw new Error(error.message);
            return data[0];
        });

        const results = await Promise.all(upsertPromises);

        return results;
    } catch (error) {

        return [];
    }
}

export const fetchArticles = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/articles/trending`);
        if (response.status === 200) {
            return await upsertToArticleTable(response.data);
        }
        console.error('Error fetching articles:', response.status);
        return [];
    } catch (error) {
        console.error('Error fetching articles:', error);
        return [];
    }
};

export const fetchArticlesByCat = async (category) => {
    try {
        const response = await axios.get(`${API_URL}/api/articles/${category}`);
        if (response.status === 200) {
            return await upsertToArticleTable(response.data);
        }
        console.error('Error fetching articles:', response.status);
        return [];
    } catch (error) {
        console.error('Error fetching articles:', error);
        return [];
    }
};

let cachedArticles = [];

// The issue is here - incorrect export syntax
export const initializeArticles = async () => {
    if (cachedArticles.length === 0) {
        cachedArticles = await fetchArticles();
    }
    return cachedArticles;
};

// This is the articles export that's being awaited in articles.js
export const articles = fetchArticles();