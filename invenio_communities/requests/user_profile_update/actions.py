from collections import defaultdict
from flask import current_app

from invenio_access.permissions import Identity, system_identity
from invenio_search.engine import dsl

from invenio_accounts.proxies import current_datastore
from invenio_communities.fixtures.create_community import create_community
from invenio_communities.members.errors import AlreadyMemberError
from invenio_communities.proxies import current_communities, current_roles
from invenio_communities.utils import slugify_name
from invenio_userprofiles import UserProfileProxy


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
    If first name or last name changes, change community metadata
    If user has consented and doesn't have its own person community, create it
    """
    # Check user has given consent
    profile = UserProfileProxy.get_by_userid(int(user_id))
    if profile is not None and profile.consent_by_providing_my_consent:
        # check this user already has a public profile community
        # if yes, reindex it, if not create it
        # import here due to circular import
        user = current_datastore.get_user(user_id)
        slug = slugify_name(user.username)
        from invenio_communities.members.records.api import Member

        user_owned_communities = [
            m[0] for m in Member.get_memberships(Identity(user_id)) if m[1] == "owner"
        ]
        owned_communities_filter = dsl.Q(
            "terms", **{"id": [id_ for id_ in user_owned_communities]}
        )
        # If user doesn't own a person community
        person_filter = dsl.Q("term", **{"metadata.type.id": "person"})
        my_owned_communities_res = current_communities.service.search(system_identity, extra_filter=owned_communities_filter & person_filter)
        community_base_data = {
            "slug": slug,
            "given_name": profile.given_name,
            "family_name": profile.family_name,
        }
        if my_owned_communities_res.total == 0:
            new_community = None
            # If the community with the right slug doesn't exist create it
            existing_communities = current_communities.service.search(
                system_identity,
                q=f"slug:{slug}",
                extra_filter=dsl.Q("term", **{"metadata.type.id": "person"}))
            does_community_exists = existing_communities.total > 0
            if not does_community_exists:
                new_community = current_communities.service.create(system_identity, create_community(community_base_data))
            else:
                # If community exists but already has another owner, create a new one
                # those users have same first name and last name
                new_community = next(existing_communities.hits)
                if Member.has_members(new_community["id"], current_roles.owner_role.name):
                    for deduplication_index in range(10):
                        slug = f"{slugify_name(user.username)}_{deduplication_index}"
                        existing_communities = current_communities.service.search(
                            system_identity,
                            q=f"slug:{slug}",
                            extra_filter=dsl.Q("term", **{"metadata.type.id": "person"}))
                        does_community_exists = existing_communities.total > 0
                        if not does_community_exists:
                            new_community = current_communities.service.create(system_identity, create_community(community_base_data))
                            break
                        else:
                            new_community = next(existing_communities.hits)
                            if not Member.has_members(new_community["id"], current_roles.owner_role.name):
                                break
            # However we obtained the community (creation or exsiting one)
            # invite the user as owner and accept invite on his behalf
            invitation_data = {
                "members": [
                    {
                        "type": "user",
                        "id": str(user_id),
                    }
                ],
                "role": current_roles.owner_role.name,
                "visible": True,
            }
            try:
                existing_invitations = current_communities.service.members.search_invitations(
                    system_identity,
                    new_community["id"],
                    q=f"{user.username}",
                )
                if existing_invitations.total == 0:
                    current_communities.service.members.invite(
                        system_identity, new_community["id"], invitation_data
                    )
                    existing_invitations = current_communities.service.members.search_invitations(
                        system_identity,
                        new_community["id"],
                        q=f"{user.username}",
                    )
                if existing_invitations.total > 0:
                    invitation_found = next(existing_invitations.hits)
                    current_communities.service.members.accept_invite(system_identity, invitation_found["request"]["id"])

            except AlreadyMemberError:
                pass
        # If the person community for this user exists
        # make sure we update it with last details
        else:
            my_owned_community = next(my_owned_communities_res.hits)
            current_communities.service.update(
                system_identity,
                my_owned_community["id"],
                create_community(community_base_data)
            )
        # Reindex person community for both profile updates and metadata updates
        current_communities.service.reindex(system_identity, extra_filter=owned_communities_filter & person_filter)
