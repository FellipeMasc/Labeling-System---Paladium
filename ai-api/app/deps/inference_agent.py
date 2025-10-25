from typing import List
import openai
from app.schemas.agent_responses import TagInferenceResponse, TagInferenceRequest
import json
client = openai.OpenAI()

async def infer_image_tags(image_url: str) -> List[str]:
    """
    Call OpenAI Vision API to infer up to 3 tags describing the image content.
    """
    prompt = (
        "You are a helpful assistant. "
        "Given this image, provide a comma-separated list of 3 possible tags describing what the image contains. "
        "Be brief and generic. Example: 'cat, window, sunlight'"
    )

    response = client.responses.parse(
        model="gpt-4.1-mini",
        input=[{
            "role": "user",
            "content": [
                {"type": "input_text", "text": prompt},
                {
                    "type": "input_image",
                    "image_url": image_url,
                },
            ],
        }],
        text_format=TagInferenceResponse,
    )
    array_tags = json.loads(response.output_text).get("tags",[])
    return array_tags