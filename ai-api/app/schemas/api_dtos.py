from pydantic import BaseModel

class ApiTagsRequest(BaseModel):
    image_url: str

class AutoUsersAssignRequest(BaseModel):
    group_id: str