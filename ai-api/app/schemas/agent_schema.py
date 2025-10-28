from typing import List
from pydantic import BaseModel, Optional

class TagInferenceRequest(BaseModel):
    image_url: str
    group_name: Optional[str] = None
    group_description: Optional[str] = None
    tags: Optional[List[str]] = None


class TagInferenceResponse(BaseModel):
    tags: List[str]
