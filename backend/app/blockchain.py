import hashlib
import json
from datetime import datetime

blockchain = []

def add_block(transaction):
    block = {
        'index': len(blockchain) + 1,
        'timestamp': str(datetime.now()),
        'transaction': transaction,
        'previous_hash': blockchain[-1]['hash'] 
                        if blockchain else "0000"
    }
    block['hash'] = hashlib.sha256(
        json.dumps(block, ensure_ascii=False).encode()
    ).hexdigest()
    blockchain.append(block)
    return block

def get_blockchain():
    return blockchain