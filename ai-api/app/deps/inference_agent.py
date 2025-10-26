from typing import List
import openai
from app.schemas.agent_schema import TagInferenceResponse, TagInferenceRequest
import json
client = openai.OpenAI()

class inference_agent:
    _instance = None

    def __new__(cls, model: str = "gpt-4.1-mini"):
        if cls._instance is None:
            cls._instance = super(inference_agent, cls).__new__(cls)
            cls._instance.model = model
            cls._instance.client = openai.OpenAI()
        return cls._instance
        
    def get_client(self) -> openai.OpenAI:
        return self.client
        
    def get_prompt(self) -> str:
        return """
        You are a helpful assistant.
        Given this image, provide a comma-separated list of 3 possible tags describing what the image contains.
        Be brief and generic. Example: 'cat, window, sunlight'
        """
    
    def infer_image_tags(self, request: TagInferenceRequest) -> TagInferenceResponse:
        prompt = self.get_prompt()
        response = self.client.responses.parse(
            model=self.model,
            input=[{
                "role": "user",
                "content": [
                    {"type": "input_text", "text": prompt},
                    {"type": "input_image", "image_url": request.image_url},
                ]
            }],
            text_format=TagInferenceResponse,
        )
        response_parsed = TagInferenceResponse.model_validate_json(response.output_text)
        return response_parsed.tags
    
    