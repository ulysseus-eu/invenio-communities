# -*- coding: utf-8 -*-
#
# Copyright (C) 2022 Northwestern University.
#
# Invenio-Communities is free software; you can redistribute it and/or modify
# it under the terms of the MIT License; see LICENSE file for more details.

"""Invitations Service API."""

from copy import deepcopy

from invenio_records_resources.services import RecordService
from invenio_records_resources.services.uow import unit_of_work
from invenio_requests import current_registry, current_requests_service
from invenio_requests.resolvers.registry import ResolverRegistry
from sqlalchemy.orm.exc import NoResultFound

from ...members import AlreadyMemberError
from ...proxies import current_communities


class InvitationService(RecordService):
    """Invitation Service.

    In an Invitation Request, the
    topic               ---- community
    creator/created_by  ---- community
    receiver            ---- invited user
    """

    @unit_of_work()
    def create(self, identity, data, uow=None):
        """Create invitation."""
        data = deepcopy(data)
        community_dict = data.pop('topic', None)
        entity_dict = data.pop('receiver', None)

        # TODO: Check permission

        community = ResolverRegistry.resolve_entity_proxy(
            community_dict).resolve()

        type_ = current_registry.lookup(data.pop('type', None))

        entity = ResolverRegistry.resolve_entity_proxy(
            entity_dict).resolve()

        self._assert_can_invite(identity, entity_dict)

        request_item = current_requests_service.create(
            identity,
            data,
            request_type=type_,
            receiver=entity,
            creator=community,
            topic=community,
            uow=uow,
        )

        return request_item

    def _assert_can_invite(self, identity, entity_dict):
        """Raises if can't invite."""
        pass
        # TODO: can't invite if already member
        # Can't if already member of community
        # already_member = current_communities.service.members.is_member(
        #     identity, entity_dict
        # )
        # if already_member:
        #     raise AlreadyMemberError()

        # TODO: can't invite if already invited
