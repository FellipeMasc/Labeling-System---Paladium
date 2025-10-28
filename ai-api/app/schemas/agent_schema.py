from typing import List
from pydantic import BaseModel

class TagInferenceRequest(BaseModel):
    image_url: str
    group_name: str
    group_description: str
    tags: List[str]


class TagInferenceResponse(BaseModel):
    tags: List[str]
