from blockchain import add_block

def record_suspicious(model_result, details):
    if model_result == -1:
        proof = add_block({
            'amount': details.get('amount'),
            'time': details.get('time'),
            'device': details.get('device'),
            'reason': 'Detected by Isolation Forest'
        })
        return True, proof['hash']
    return False, None