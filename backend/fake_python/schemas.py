from pydantic import BaseModel, Field, field_validator, AliasChoices

class FactCheckResult(BaseModel):
    verdict: str = Field(
        default="Unverified",
        description="Must be one of: True, False, Misleading, Unverified"
    )
    explanation: str = Field(
        default="No explanation provided.",
        description="Factual summary explaining why the verdict was assigned"
    )
    confidence: int = Field(
        default=50,
        validation_alias=AliasChoices("confidence", "confidence_score"),
        description="Integer from 0 to 100 representing confidence score"
    )
    sources: list[str] = Field(
        default_factory=list,
        description="List of HTTP/HTTPS URLs used for verification"
    )

    @field_validator("confidence", mode="before")
    @classmethod
    def coerce_confidence(cls, v):
        if isinstance(v, str):
            try:
                return int(v)
            except ValueError:
                return 50
        return v if v is not None else 50