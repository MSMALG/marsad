from blockchain import blockchain

def get_all_records():
    return blockchain

def search_by_hash(partial_hash):
    for block in blockchain:
        if block['hash'].startswith(partial_hash):
            return block
    return None