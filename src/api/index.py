# from fastapi import FastAPI, HTTPException, Request
# from fastapi.responses import JSONResponse
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel
# from langchain_community.tools.tavily_search import TavilySearchResults
# from langchain_core.messages import HumanMessage
# from langgraph.prebuilt import create_react_agent
# from slowapi import Limiter, _rate_limit_exceeded_handler
# from slowapi.util import get_remote_address
# from slowapi.middleware import SlowAPIMiddleware
# from slowapi.errors import RateLimitExceeded
# from langchain_core.output_parsers import JsonOutputParser
# from langchain_google_genai import ChatGoogleGenerativeAI
# import dotenv
# import os

# dotenv.load_dotenv(".env.local")
# limiter = Limiter(key_func=get_remote_address)

# if not os.environ.get("TAVILY_API_KEY"):
#     raise ValueError("TAVILY_API_KEY environment variable is not set.")
# if not os.environ.get("GOOGLE_API_KEY"):
#     raise ValueError("GOOGLE_API_KEY environment variable is not set.")

# model2 = ChatGoogleGenerativeAI(
#     api_key=os.environ["GOOGLE_API_KEY"],
#     temperature=0.7,
#     model="gemini-2.0-flash",
# )

# search = TavilySearchResults(max_results=10, include_images=True, include_image_descriptions=True)

# tools = [search]

# agent_executor = create_react_agent(model2, tools)

# system_prompt = """
# You are a PPT Expert. Your task is to create Contents of PPT and provide a detailed outline for each slide.
# For each slide, specify:
# 1. A clear title
# 2. Bullet points for content (use - at the beginning of each bullet point)
# 3. Suggest image URLs from search results when appropriate (format: "image: URL")

# IMPORTANT: Only include direct image URLs that end with .jpg, .jpeg, .png, or .gif extensions. Do not include search result URLs or any other URLs that don't directly point to an image file. Prefer trusted sources like  Unsplash, Pexels, Wikipedia and others. Don't include any private image from the sites.

# Remember the presentation is for a {audience} and should be about {topic}, make it interesting as well.

# Format your response as valid JSON with the following structure:
#       {{
#         "title": "Presentation Title",
#         "slides": [
#           {{
#             "title": "Slide Title",
#             "content": ["Point 1", "Point 2", "Point 3"],
#             "image_url": "image: URL",
# ]",
#           }}
#         ]
#       }}

# Create {number_of_slides} slides with concise, impactful content. 

# IMPORTANT:
# 1. Do not include any text outside of the JSON response.
# 2. Do not include any explanations or additional information.
# 3. Do not include any code blocks.
# 4. Do not change the JSON structure stricktly.
# 5. In the Slides, content don't include any image URLs, only the image URL in the image_url field and remove the Hyphen (-) from the content.
# """


# app = FastAPI(docs_url="/api/py/docs", openapi_url="/api/py/openapi.json")

# app.state.limiter = limiter
# app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
# app.add_middleware(SlowAPIMiddleware)

# class PresentationRequest(BaseModel):
#     audience: str
#     description: str
#     number_of_slides: int

# CORSMiddleware(
#     app,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
#     expose_headers=["*"],
#     max_age=3600,
# )

# @app.get("/api/py")
# def get():
#     return JSONResponse(content={"message": "Welcome to the Presentation API!"})




# @app.post("/api/py/presentation")
# @limiter.limit("4/minute")
# def returnPPTResponse(request: Request,req: PresentationRequest):
#     print(f"Received request: {req}")
#     full_prompt = system_prompt.format(
#         audience=req.audience,
#         topic=req.description,
#         number_of_slides=req.number_of_slides
#     )

#     try:
#         full_response = ""
#         for step in agent_executor.stream(
#             {"messages": [HumanMessage(content=full_prompt)]},
#             stream_mode="values",
            
#         ): 
#             message = step["messages"][-1]
#             if hasattr(message, "content"):
#                 full_response += message.content
#         print(f"Full response: {full_response}")
#         if '```json' in full_response:
#             full_response = full_response.split('```json')[1].split('```')[0].strip()
#         elif '```' in full_response:
#             full_response = full_response.split('```')[1].split('```')[0].strip()
        
#         json_parser = JsonOutputParser()
#         json_data = json_parser.parse(full_response)
#         print(f"Parsed JSON data: {json_data}")

#         return {"success": True, "presentation": json_data}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error processing the request: {e}")

from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain_community.tools.tavily_search import TavilySearchResults
from langchain_core.messages import HumanMessage
from langgraph.prebuilt import create_react_agent
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.middleware import SlowAPIMiddleware
from slowapi.errors import RateLimitExceeded
from langchain_core.output_parsers import JsonOutputParser
from langchain_google_genai import ChatGoogleGenerativeAI
import dotenv
import os
import requests  # Add this import

dotenv.load_dotenv(".env.local")
limiter = Limiter(key_func=get_remote_address)

model2 = ChatGoogleGenerativeAI(
    api_key=os.environ["GOOGLE_API_KEY"],
    temperature=0.7,
    model="gemini-2.0-flash",
)

search = TavilySearchResults(max_results=10, include_images=True, include_image_descriptions=True)

tools = [search]

agent_executor = create_react_agent(model2, tools)

if not os.environ.get("UNSPLASH_API_KEY"):
    raise ValueError("UNSPLASH_API_KEY environment variable is not set.")
if not os.environ.get("GOOGLE_API_KEY"):
    raise ValueError("GOOGLE_API_KEY environment variable is not set.")

model2 = ChatGoogleGenerativeAI(
    api_key=os.environ["GOOGLE_API_KEY"],
    temperature=0.7,
    model="gemini-2.0-flash",
)

# Remove Tavily search and create an Unsplash search function
def search_unsplash(query: str, per_page: int = 5):
    """Search Unsplash for images related to the query"""
    headers = {
        "Authorization": f"Client-ID {os.environ['UNSPLASH_API_KEY']}",
        "Accept-Version": "v1"
    }
    params = {
        "query": query,
        "per_page": per_page,
        "content_filter": "high"
    }
    response = requests.get(
        "https://api.unsplash.com/search/photos",
        headers=headers,
        params=params
    )
    response.raise_for_status()
    results = response.json()
    
    # Format results to include only the image URLs
    images = [f"image: {photo['urls']['regular']}" for photo in results['results']]
    return images

system_prompt = """
You are a PPT Expert. Your task is to create Contents of PPT and provide a detailed outline for each slide.
For each slide, specify:
1. A clear title
2. Bullet points for content (use - at the beginning of each bullet point)
3. Suggest image search queries for Unsplash when appropriate (format: "image_search: query")

IMPORTANT: Don't include actual image URLs in your response. Just provide search queries for images.

Remember the presentation is for a {audience} and should be about {topic}, make it interesting as well.

Format your response as valid JSON with the following structure:
      {{
        "title": "Presentation Title",
        "slides": [
          {{
            "title": "<Slide Title>",
            "content": ["Point 1", "Point 2", "Point 3"],
            "image_search": "query for image",
          }}
        ]
      }}

Create {number_of_slides} slides with concise, impactful content. 

IMPORTANT:
1. Do not include any text outside of the JSON response.
2. Do not include any explanations or additional information.
3. Do not include any code blocks.
4. Do not change the JSON structure strictly.
5. In the Slides, content don't include any image URLs or search queries, only the image_search in the image_search field and remove the Hyphen (-) from the content.
"""

app = FastAPI(docs_url="/api/docs", openapi_url="/api/openapi.json")

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

class PresentationRequest(BaseModel):
    audience: str
    description: str
    number_of_slides: int

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,
)

@app.get("/api")
def get():
    return JSONResponse(content={"message": "Welcome to the Presentation API!"})

@app.post("/api/presentation")
@limiter.limit("4/minute")
async def returnPPTResponse(request: Request, req: PresentationRequest):
    print(f"Received request: {req}")
    full_prompt = system_prompt.format(
        audience=req.audience,
        topic=req.description,
        number_of_slides=req.number_of_slides
    )

    try:
        full_response = ""
        for step in agent_executor.stream(
            {"messages": [HumanMessage(content=full_prompt)]},
            stream_mode="values",
        ): 
            message = step["messages"][-1]
            if hasattr(message, "content"):
                full_response += message.content
        print(f"Full response: {full_response}")
        
        if '```json' in full_response:
            full_response = full_response.split('```json')[1].split('```')[0].strip()
        elif '```' in full_response:
            full_response = full_response.split('```')[1].split('```')[0].strip()
        
        json_parser = JsonOutputParser()
        json_data = json_parser.parse(full_response)
        print(f"Initial JSON data: {json_data}")

        # Process each slide to replace image_search with actual Unsplash images
        for slide in json_data["slides"]:
            if "image_search" in slide:
                search_query = slide["image_search"]
                try:
                    images = search_unsplash(search_query, per_page=1)
                    if images:
                        slide["image_url"] = images[0]  # Use the first image
                    del slide["image_search"]  # Remove the search query
                except Exception as e:
                    print(f"Error searching Unsplash for {search_query}: {e}")
                    slide["image_url"] = None

        print(f"Final JSON data with Unsplash images: {json_data}")
        return {"success": True, "presentation": json_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing the request: {e}")