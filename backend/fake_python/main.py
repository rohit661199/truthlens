from search_client import get_evidence
from verifier_chain import build_verifier_chain

def check_fake_news(claim: str):
    print("\n Searching for evidence...\n")

    evidence = get_evidence(claim)

    chain  = build_verifier_chain()

    response = chain.invoke({
        "claim": claim,
        "evidence": evidence,
    })

    return response

if __name__ == "__main__":
    claim = input("Enter news claim : ")
    result = check_fake_news(claim)

    print("\n===== FACT CHECK =====\n")
    print("Verdict:",result.verdict)
    print("Explanation:",result.explanation)