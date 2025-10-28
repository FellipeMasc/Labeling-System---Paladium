from pydantic import BaseModel

class ApiTagsRequest(BaseModel):
    image_url: str
    image_id: str

class AutoUsersAssignRequest(BaseModel):
    group_id: str
    
class UpdateLikelihoodScoreRequest(BaseModel):
    tag_id: str
    label: str