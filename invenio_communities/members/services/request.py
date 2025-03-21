# -*- coding: utf-8 -*-
#
# Copyright (C) 2022 Northwestern University.
# Copyright (C) 2022-2025 CERN.
# Copyright (C) 2023 Graz University of Technology.
#
# Invenio-Communities is free software; you can redistribute it and/or modify
# it under the terms of the MIT License; see LICENSE file for more details.

"""Invitation request type."""

from invenio_access.permissions import system_identity
from invenio_i18n import lazy_gettext as _
from invenio_notifications.services.uow import NotificationOp
from invenio_requests.customizations import RequestType, actions

from invenio_communities.notifications.builders import (
    CommunityInvitationAcceptNotificationBuilder,
    CommunityInvitationCancelNotificationBuilder,
    CommunityInvitationDeclineNotificationBuilder,
    CommunityInvitationExpireNotificationBuilder,
)

from ...proxies import current_communities


def service():
    """Service."""
    return current_communities.service.members


#
# CommunityInvitation: actions and request type
#


#
# Actions
#
# All actions use `system_identity` and not the `identity` param, because
# the permission check happens at the request service (`execute_action`) level
# before reaching these components and therefore the check is not needed.
# These actions will assert the identity is `system identity`, which cannot
# be obtained as a user.
class AcceptAction(actions.AcceptAction):
    """Accept action."""

    def execute(self, identity, uow):
        """Execute action."""
        service().accept_invite(system_identity, self.request.id, uow=uow)
        uow.register(
            NotificationOp(
                CommunityInvitationAcceptNotificationBuilder.build(self.request)
            )
        )
        super().execute(identity, uow)


class DeclineAction(actions.DeclineAction):
    """Delete action."""

    def execute(self, identity, uow):
        """Execute action."""
        service().decline_invite(system_identity, self.request.id, uow=uow)
        uow.register(
            NotificationOp(
                CommunityInvitationDeclineNotificationBuilder.build(self.request)
            )
        )
        super().execute(identity, uow)


class CancelAction(actions.CancelAction):
    """Cancel action."""

    def execute(self, identity, uow):
        """Execute action."""
        service().decline_invite(system_identity, self.request.id, uow=uow)
        uow.register(
            NotificationOp(
                CommunityInvitationCancelNotificationBuilder.build(self.request)
            )
        )
        super().execute(identity, uow)


class ExpireAction(actions.ExpireAction):
    """Expire action."""

    def execute(self, identity, uow):
        """Execute action."""
        service().decline_invite(system_identity, self.request.id, uow=uow)
        uow.register(
            NotificationOp(
                CommunityInvitationExpireNotificationBuilder.build(self.request)
            )
        )
        super().execute(identity, uow)


#
# Request
#
class CommunityInvitation(RequestType):
    """Community member invitation request type."""

    type_id = "community-invitation"
    name = _("Community invitation")

    create_action = "create"
    available_actions = {
        "create": actions.CreateAndSubmitAction,
        "delete": actions.DeleteAction,
        "accept": AcceptAction,
        "decline": DeclineAction,
        "cancel": CancelAction,
        "expire": ExpireAction,
    }

    creator_can_be_none = False
    topic_can_be_none = False
    allowed_creator_ref_types = ["community"]
    allowed_receiver_ref_types = ["user"]
    allowed_topic_ref_types = ["community"]

    needs_context = {
        "community_roles": [
            "owner",
            "manager",
        ]
    }


#
# MembershipRequestRequestType: actions and request type
#


class CancelMembershipRequestAction(actions.CancelAction):
    """Cancel membership request action."""

    def execute(self, identity, uow):
        """Execute action."""
        service().close_membership_request(system_identity, self.request.id, uow=uow)
        # TODO: Investigate notifications
        super().execute(identity, uow)


class MembershipRequestRequestType(RequestType):
    """Request type for membership requests."""

    type_id = "community-membership-request"
    name = _("Membership request")

    create_action = "create"
    available_actions = {
        "create": actions.CreateAndSubmitAction,
        "cancel": CancelMembershipRequestAction,
    }

    creator_can_be_none = False
    topic_can_be_none = False
    allowed_creator_ref_types = ["user"]
    allowed_receiver_ref_types = ["community"]
    allowed_topic_ref_types = ["community"]
