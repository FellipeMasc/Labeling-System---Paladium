from typing import List
import openai
from app.schemas.agent_schema import TagInferenceResponse, TagInferenceRequest
import json
client = openai.OpenAI()

class inference_agent:
    def __init__(self, model: str = "gpt-4.1-mini"):
        self.model = model
        self.client = openai.OpenAI()
        
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
    
    
# async def infer_image_tags(TagInferenceRequest: TagInferenceRequest) -> List[str]:
#     """
#     Call OpenAI Vision API to infer up to 3 tags describing the image content.
#     """
#     prompt = (
#         "You are a helpful assistant. "
#         "Given this image, provide a comma-separated list of 3 possible tags describing what the image contains. "
#         "Be brief and generic. Example: 'cat, window, sunlight'"
#     )

#     response = client.responses.parse(
#         model="gpt-4.1-mini",
#         input=[{
#             "role": "user",
#             "content": [
#                 {"type": "input_text", "text": prompt},
#                 {
#                     "type": "input_image",
#                     "image_url": image_url,
#                 },
#             ],
#         }],
#         text_format=TagInferenceResponse,
#     )
#     array_tags = json.loads(response.output_text).get("tags",[])
#     return array_tags