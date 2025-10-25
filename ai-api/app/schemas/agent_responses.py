from typing import List
from pydantic import BaseModel

class TagInferenceRequest(BaseModel):
    image_url: str


class TagInferenceResponse(BaseModel):
    tags: List[str]
