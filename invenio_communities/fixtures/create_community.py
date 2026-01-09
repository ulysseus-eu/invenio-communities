import json

def create_community(data):
    """Create fake communities for demo purposes."""
    data_to_use = {
        "access": {
            "visibility": "public",
        },
        "slug": data["slug"],
        "metadata": {
            "title": f"{data['family_name']}, {data['given_name']}",
            "person":{
                "given_name": data['given_name'],
                "family_name": data['family_name'],
            },
            "type": {
                "id": "person"
            },
        },
    }
    if "user_id" in data:
        data_to_use["metadata"]["person"]["user_id"] = data["user_id"]

    return json.loads(json.dumps(data_to_use))
