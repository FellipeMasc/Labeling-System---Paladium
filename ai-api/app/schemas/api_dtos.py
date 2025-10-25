from pydantic import BaseModel

class ApiTagsRequest(BaseModel):
    image_url: str
    user_id: str
