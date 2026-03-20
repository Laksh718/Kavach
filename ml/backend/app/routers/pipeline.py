import sys
import os
# Add root to path for imports to work
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../..")))

from fastapi import APIRouter, HTTPException
from backend.app.models.schemas import PipelineRequest, PipelineResponse
from backend.app.services.pipeline_service import run_full_pipeline

router = APIRouter(
    prefix="/pipeline",
    tags=["pipeline"]
)

@router.post("/run", response_model=PipelineResponse)
def run_pipeline_endpoint(request: PipelineRequest):
    try:
        # Convert request classes to dicts for the service
        event_dict = request.event.dict()
        worker_dict = request.worker.dict()
        
        result = run_full_pipeline(event_dict, worker_dict)
        
        # Payout amount and loss can be None if not approved
        return {
            "status": result["status"],
            "payout": result.get("payout"),
            "loss": result.get("loss")
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
