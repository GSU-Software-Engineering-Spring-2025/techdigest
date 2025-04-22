from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from newsapi import NewsApiClient
from eventregistry import *
import json

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8081"],  # Your Vite dev server
    allow_methods=["GET"],
    allow_headers=["*"]
)

@app.get("/api/articles")
async def getArticles():
    newsapi = NewsApiClient(api_key='cfc4a0e26c2b42feb0932b548e728c70')
    
    top_headlines = newsapi.get_top_headlines(
        q='ai',
        category='technology',
        language='en',
        country='us'
    )
    parsed_articles = []
    for article in top_headlines["articles"]:
        parsed_articles.append({
            "source": article["source"]["name"],
            "authors": article["author"],
            "title": article["title"],
            "summary": article["description"],
            "id": article["url"],
            "url": article["url"],
            "image": article["urlToImage"],
            "date": article["publishedAt"],
            "body": article["content"],
            "category": "Tech"
        })
    return parsed_articles

async def getArticlesByCat(category):
    newsapi = NewsApiClient(api_key='cfc4a0e26c2b42feb0932b548e728c70')
    top_headlines = newsapi.get_top_headlines(
        q=category,
        category='technology',
        language='en',
        country='us',
        page_size=100,
        page=1
    )
    parsed_articles = []
    for article in top_headlines["articles"]:
        parsed_articles.append({
            "source": article["source"]["name"],
            "authors": article["author"],
            "title": article["title"],
            "summary": article["description"],
            "id": article["url"],
            "url": article["url"],
            "image": article["urlToImage"],
            "date": article["publishedAt"],
            "body": article["content"],
            "category": "Tech"
        })
    return parsed_articles

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