from collections import defaultdict

from invenio_access.permissions import Identity, system_identity
from invenio_search.engine import dsl
from invenio_communities.proxies import current_communities



def _get_communities_for_user(user_id):
    """Helper function for getting all communities with the user as the sole owner.

    Note: This function performs DB queries yielding all communities with the given
    user as the sole owner (which is not hard-limited in the system) and performs
    service calls on each of them. Thus, this function has the potential of being a very
    heavy operation, and should not be called as part of the handling of an
    HTTP request!
    """
    comm_cls = current_communities.service.record_cls
    comm_model_cls = comm_cls.model_cls
    mem_cls = current_communities.service.members.record_cls
    mem_model_cls = mem_cls.model_cls

    # collect the owners for each community
    comm_owners = defaultdict(list)
    for comm_owner in [
        mem_cls(m.data, model=m)
        for m in mem_model_cls.query.filter(mem_model_cls.role == "owner").all()
    ]:
        comm_owners[comm_owner.community_id].append(comm_owner)

    # filter for communities that are owned solely by the user in question
    relevant_comm_ids = [
        comm_id
        for comm_id, owners in comm_owners.items()
        if len(owners) == 1 and str(owners[0].user_id) == user_id
    ]

    # resolve the communities in question
    communities = [
        comm_cls(m.data, model=m)
        for m in comm_model_cls.query.filter(
            comm_model_cls.id.in_(relevant_comm_ids)
        ).all()
    ]

    return communities


def on_profile_updated(user_id, uow=None, **kwargs):
    """Execute on user profile updated.

    Re-index user records and dump verified field into records.
    """
    # import here due to circular import
    from invenio_communities.members.records.api import Member

    user_owned_communities = [
        m[0] for m in Member.get_memberships(Identity(user_id)) if m[1] == "owner"
    ]
    owned_communities_filter = dsl.Q(
        "terms", **{"id": [id_ for id_ in user_owned_communities]}
    )
    person_filter = dsl.Q("term", **{"metadata.type.id": "person"})
    community_service = current_communities.service
    community_service.reindex(system_identity, extra_filter=owned_communities_filter & person_filter)
