from langchain_core.prompts import ChatPromptTemplate
from llm_config import get_llm
from prompts import VERIFY_PROMPT
from schemas import FactCheckResult

def build_verifier_chain():
    llm = get_llm()
    structured_llm = llm.with_structured_output(FactCheckResult)
    prompt = ChatPromptTemplate.from_template(VERIFY_PROMPT)
    return prompt | structured_llm

