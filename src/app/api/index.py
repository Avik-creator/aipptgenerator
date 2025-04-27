from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain_community.tools.tavily_search import TavilySearchResults
from langchain_core.messages import HumanMessage
from langgraph.prebuilt import create_react_agent
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.middleware import SlowAPIMiddleware
from slowapi.errors import RateLimitExceeded
from langchain_core.output_parsers import JsonOutputParser
from langchain_google_genai import ChatGoogleGenerativeAI
import dotenv
import os
import base64

dotenv.load_dotenv()

# Get client IP
def get_client_ip(request: Request) -> str:
    print(f"Request Headers: {request.headers}")
    print(f"Request Client Host: {request.client.host}")
    print(f"Request Client State: {request.headers.get('X-Client-IP')}")
    print(f"Request Client State: {request.headers.get('x-forwarded-for')}")
    return request.headers.get("x-real-ip") or request.client.host

# Setup Limiter
limiter = Limiter(key_func=get_client_ip)

# Gemini for presentation content
presentation_model = ChatGoogleGenerativeAI(
    api_key=os.environ["GOOGLE_API_KEY"],
    temperature=0.7,
    model="gemini-2.0-flash"
)

# Gemini for image generation
image_model = ChatGoogleGenerativeAI(
    api_key=os.environ["GOOGLE_API_KEY"],
    temperature=0.7,
    model="gemini-2.0-flash-exp-image-generation"
)

search = TavilySearchResults(max_results=10, search_depth="advanced")
tools = [search]
agent_executor = create_react_agent(presentation_model, tools)

# FastAPI app setup
app = FastAPI(docs_url="/api/py/docs", openapi_url="/api/py/openapi.json")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,
)

# Request body
class PresentationRequest(BaseModel):
    audience: str
    description: str
    number_of_slides: int
    number_of_bullet_points: int

# Custom rate limit handler
@app.exception_handler(RateLimitExceeded)
async def custom_rate_limit_handler(request: Request, exc: RateLimitExceeded):
    return JSONResponse(
        status_code=429,
        content={"success": False, "error": "Rate limit exceeded. Try again tomorrow!"}
    )

# Welcome route
@app.get("/api")
def get():
    return JSONResponse(content={"message": "Welcome to the Presentation API!"})

# Image generation using Gemini
def generate_image_from_description(description: str):
    message = {
        "role": "user",
        "content": f"Generate an image for this description: {description}"
    }

    try:
        response = image_model.invoke(
            [message],
            generation_config=dict(response_modalities=["TEXT", "IMAGE"]),
        )
        image_base64 = response.content[0].get("image_url").get("url").split(",")[-1]
        return f"data:image/png;base64,{image_base64}"
    except Exception as e:
        print(f"Image generation failed: {e}")
        return None

# System prompt for presentation
system_prompt = """
You are a PPT Expert. Your task is to create Contents of PPT and provide a detailed outline for each slide.
For each slide, specify:
1. A clear title
2. Bullet points for content (use - at the beginning of each bullet point)
3. Suggest image search queries when appropriate (format: "image_search: query")

IMPORTANT: Don't include actual image URLs. Just provide search queries.

Remember the presentation is for a {audience} and should be about {topic}, make it interesting as well.

Format your response as valid JSON with the following structure:
{{
  "title": "Presentation Title",
  "slides": [
    {{
      "title": "<Slide Title>",
      "content": ["Point 1", "Point 2", "Point 3"],
      "image_search": "Give a detailed search query for the image such that it can be generated properly by another model."
    }}
  ]
}}

Create {number_of_slides} slides with {number_of_bullet_points} bullet points each.

IMPORTANT:
- No text outside the JSON.
- No explanations.
- No code blocks.
- Do not change the JSON structure.
- In slide content, do not include image queries or URLs.
"""

# POST endpoint to generate PPT

@app.post("/api/presentation")

async def returnPPTResponse(request: Request, req: PresentationRequest):
    full_prompt = system_prompt.format(
        audience=req.audience,
        topic=req.description,
        number_of_slides=req.number_of_slides,
        number_of_bullet_points=req.number_of_bullet_points
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

        if '```json' in full_response:
            full_response = full_response.split('```json')[1].split('```')[0].strip()
        elif '```' in full_response:
            full_response = full_response.split('```')[1].split('```')[0].strip()

        json_parser = JsonOutputParser()
        json_data = json_parser.parse(full_response)

        # Generate AI images
        for slide in json_data["slides"]:
            if "image_search" in slide:
                description = slide["image_search"]
                image_data_url = generate_image_from_description(description)
                slide["image_url"] = image_data_url
                del slide["image_search"]

        return {"success": True, "presentation": json_data}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing the request: {e}")