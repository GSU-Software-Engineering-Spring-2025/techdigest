from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from newsapi import NewsApiClient
import logging
from datetime import datetime, timedelta

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8081"],  # Your Vite dev server
    allow_methods=["GET"],
    allow_headers=["*"]
)

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize NewsAPI client
newsapi = NewsApiClient(api_key='cfc4a0e26c2b42feb0932b548e728c70')

# Define date range - last 30 days
# Define date range - last 2 years (730 days)
from_date = (datetime.now() - timedelta(days=30)).strftime('%Y-%m-%d')

@app.get("/api/articles")
async def getArticles():
    try:
        # Using get_everything for more comprehensive results
        articles = newsapi.get_everything(
            q='artificial intelligence OR AI technology',
            language='en',
            sort_by='relevancy',
            from_param=from_date,
            page_size=20
        )
        
        parsed_articles = []
        for article in articles["articles"]:
            # Skip articles with missing key fields
            if not article.get("title") or not article.get("url"):
                continue
            
            parsed_articles.append({
                "source": article["source"]["name"] if article.get("source") and article["source"].get("name") else "Unknown Source",
                "authors": article.get("author", "Unknown Author"),
                "title": article.get("title", ""),
                "summary": article.get("description", "No description available"),
                "id": article.get("url", ""),
                "url": article.get("url", ""),
                "image": article.get("urlToImage", ""),
                "date": article.get("publishedAt", ""),
                "body": article.get("content", "No content available"),
                "category": "Tech"
            })
            
        logger.info(f"Retrieved {len(parsed_articles)} general articles")
        return parsed_articles
    except Exception as e:
        logger.error(f"Error retrieving articles: {str(e)}")
        return []

# Dictionary defining enhanced search parameters for each category
CATEGORY_QUERIES = {
    "ai": {
        "query": "artificial intelligence OR AI advances OR ai ethics OR deep learning OR neural networks",
        "category": "AI"
    },
    "machine learning": {
        "query": "machine learning OR ML models OR data science OR predictive analytics OR neural networks OR ML algorithms",
        "category": "ML"
    },
    "iot": {
        "query": "internet of things OR IoT devices OR connected devices OR smart home OR industrial IoT OR IoT security",
        "category": "IoT"
    },
    "blockchain": {
        "query": "blockchain technology OR blockchain applications OR decentralized ledger OR smart contracts OR web3 OR blockchain security",
        "category": "Blockchain"
    },
    "quantum computing": {
        "query": "quantum computing OR quantum supremacy OR quantum processors OR quantum algorithms OR quantum cryptography OR qubits",
        "category": "Quantum Computing"
    },
    "virtual reality": {
        "query": "virtual reality OR augmented reality OR VR headsets OR metaverse OR AR applications OR VR gaming OR mixed reality",
        "category": "VR"
    },
    "cybersecurity": {
        "query": "cybersecurity OR network security OR data breaches OR information security OR ransomware OR cyber attacks OR cloud security",
        "category": "Networking"
    },
    "robotics": {
        "query": "robotics OR autonomous robots OR industrial automation OR robot learning OR humanoid robots OR robotic process automation",
        "category": "Robotics"
    }
}

async def getArticlesByCat(category):
    try:
        # Get the enhanced query for this category
        category_info = CATEGORY_QUERIES.get(category, {"query": category, "category": "Tech"})
        enhanced_query = category_info["query"]
        display_category = category_info["category"]
        
        logger.info(f"Fetching articles with query: {enhanced_query}")
        
        # Try getting everything first for more comprehensive results
        articles = newsapi.get_everything(
            q=enhanced_query,
            language='en',
            sort_by='relevancy',
            from_param=from_date,
            page_size=20
        )
        
        # If we don't get enough results, fall back to top headlines
        if len(articles["articles"]) < 5:
            logger.info(f"Not enough results from get_everything, falling back to top_headlines for {category}")
            articles = newsapi.get_top_headlines(
                q=category,
                category='technology',
                language='en',
                country='us',
                page_size=20
            )
        
        parsed_articles = []
        for article in articles["articles"]:
            # Skip articles with missing essential fields
            if not article.get("title") or not article.get("url"):
                continue
                
            parsed_articles.append({
                "source": article["source"]["name"] if article.get("source") and article["source"].get("name") else "Unknown Source",
                "authors": article.get("author", "Unknown Author"),
                "title": article.get("title", ""),
                "summary": article.get("description", "No description available"),
                "id": article.get("url", ""),
                "url": article.get("url", ""),
                "image": article.get("urlToImage", ""),
                "date": article.get("publishedAt", ""),
                "body": article.get("content", "No content available"),
                "category": display_category
            })
        
        logger.info(f"Retrieved {len(parsed_articles)} articles for category {category}")
        return parsed_articles
    except Exception as e:
        logger.error(f"Error retrieving articles for category {category}: {str(e)}")
        return []

@app.get("/api/articles/AI")
async def getArticlesAI():
    return await getArticlesByCat("ai")

@app.get("/api/articles/ML")
async def getArticlesML():
    return await getArticlesByCat("machine learning")

@app.get("/api/articles/IoT")
async def getArticlesIOT():
    return await getArticlesByCat("iot")

@app.get("/api/articles/Blockchain")
async def getArticlesBlockchain():
    return await getArticlesByCat("blockchain")

@app.get("/api/articles/quantum-computing")
async def getArticlesQuantumComputing():
    return await getArticlesByCat("quantum computing")

@app.get("/api/articles/vr")
async def getArticlesVirtualReality():
    return await getArticlesByCat("virtual reality")

@app.get("/api/articles/Networking")
async def getArticlesCybersecurity():
    return await getArticlesByCat("cybersecurity")

@app.get("/api/articles/Robotics")
async def getArticlesRobotics():
    return await getArticlesByCat("robotics")

# Add a trending tech endpoint
@app.get("/api/articles/trending")
async def getTrendingTech():
    try:
        articles = newsapi.get_top_headlines(
            category='technology',
            language='en',
            country='us',
            page_size=20
        )
        
        parsed_articles = []
        for article in articles["articles"]:
            if not article.get("title") or not article.get("url"):
                continue
                
            parsed_articles.append({
                "source": article["source"]["name"] if article.get("source") and article["source"].get("name") else "Unknown Source",
                "authors": article.get("author", "Unknown Author"),
                "title": article.get("title", ""),
                "summary": article.get("description", "No description available"),
                "id": article.get("url", ""),
                "url": article.get("url", ""),
                "image": article.get("urlToImage", ""),
                "date": article.get("publishedAt", ""),
                "body": article.get("content", "No content available"),
                "category": "Trending"
            })
            
        logger.info(f"Retrieved {len(parsed_articles)} trending articles")
        return parsed_articles
    except Exception as e:
        logger.error(f"Error retrieving trending articles: {str(e)}")
        return []

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)

# DND
# async def getArticles():
#     er = EventRegistry(apiKey = "812fa6b8-257c-4b3c-a6b4-55f412e1050a")
#     query = {
#   "$query": {
#     "$and": [
#       {
#         "$or": [
#           {
#             "keyword": "AI",
#             "keywordLoc": "title"
#           },
#           {
#             "$and": [
#               {
#                 "conceptUri": "http://en.wikipedia.org/wiki/Software"
#               },
#               {
#                 "conceptUri": "http://en.wikipedia.org/wiki/Technology"
#               }
#             ]
#           }
#         ]
#       },
#       {
#         "categoryUri": "dmoz/Computers"
#       },
#       {
#         "$or": [
#           {
#             "locationUri": "http://en.wikipedia.org/wiki/North_America"
#           }
#         ]
#       },
#       {
#         "$or": [
#           {
#             "sourceLocationUri": "http://en.wikipedia.org/wiki/North_America"
#           }
#         ]
#       },
#       {
#         "lang": "eng"
#       }
#     ]
#   },
#   "$filter": {
#     "forceMaxDataTimeWindow": "31",
#     "startSourceRankPercentile": 0,
#     "endSourceRankPercentile": 30
#   }
# }
#     q = QueryArticlesIter.initWithComplexQuery(query)

#     articles_list = list(q.execQuery(er, maxItems=25))
#     parsed_articles = []

#     for article in articles_list:
#     # Extract author names (handle cases where 'authors' is missing/empty)
#         authors = article.get("authors", [])
#         author_names = [author.get("name", "Unknown") for author in authors]
#         categories = article.get("categories", [])
#         category_names = [category.get("label", "Unknown") for category in categories]

#         if article.get("isDuplicate"):
#             continue
        
#         parsed_articles.append({
#             "id": article.get("uri"),
#             "title": article.get("title"),
#             "date": article.get("date"),
#             "url": article.get("url"),
#             "summary": article.get("body", "")[:200] + "..." if article.get("body") else "",
#             "body": article.get("body"),
#             "source": article.get("source", {}).get("title"),
#             "image": article.get("image") if article.get("image") else "./src/components/ui/placeholder.png",
#             "authors": ", ".join(author_names) if author_names else "No authors listed",
#             "categories": ", ".join(category_names) if category_names else "Tech"
#         })
        
#     return {"articles": parsed_articles}



# Response 

# {
#   "uri": "8627860201",
#   "lang": "ara",
#   "isDuplicate": false,
#   "date": "2025-04-09",
#   "time": "15:24:54",
#   "dateTime": "2025-04-09T15:24:54Z",
#   "dateTimePub": "2025-04-09T12:18:56Z",
#   "dataType": "news",
#   "sim": 0.9058823585510254,
#   "url": "https://www.aljazeera.net/...",
#   "title": "فانيا أغراوال.. مهندسة هندية غادرت مايكروسوفت انتصارا لغزة",
#   "body": "فانيا أغراوال مهندسة برمجيات أميركية... [long text]",
#   "source": {
#     "uri": "aljazeera.net",
#     "dataType": "news",
#     "title": "Aljazeera"
#   },
#   "authors": [],
#   "image": "https://www.aljazeera.net/.../76jh-1744210033.jpg",
#   "eventUri": "ara-1814485",
#   "sentiment": null,
#   "wgt": 300,
#   "relevance": 300
# }