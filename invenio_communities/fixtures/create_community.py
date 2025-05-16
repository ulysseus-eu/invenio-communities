import json
import random

def create_community(faker, name):
    """Create fake communities for demo purposes."""
    data_to_use = {
        "access": {
            "visibility": "public",
            "member_policy": random.choice(["open", "closed"]),
            "record_submission_policy": random.choice(["open", "closed"]),
        },
        "slug": faker.unique.domain_word(),
        "metadata": {
            "title": name,
            "description": name,
            "type": {
                "id": random.choice(["person"])
            },
            "curation_policy": faker.text(max_nb_chars=50000),
            "page": faker.text(max_nb_chars=50000),
        },
    }

    return json.loads(json.dumps(data_to_use))
