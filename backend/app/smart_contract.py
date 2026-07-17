from blockchain import add_block

def record_suspicious(is_suspicious, details):
    if is_suspicious:
        proof = add_block({
            "amount": details.get("amount"),
            "time": details.get("time"),
            "device": details.get("device"),
            "reason": "Detected by Business Rules"
        })
        return True, proof["hash"]

    return False, None