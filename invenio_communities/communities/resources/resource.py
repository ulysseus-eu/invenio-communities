# -*- coding: utf-8 -*-
#
# This file is part of Invenio.
# Copyright (C) 2016-2021 CERN.
# Copyright (C) 2021 Northwestern University.
# Copyright (C) 2022 Graz University of Technology.
#
# Invenio is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Invenio Communities Resource API."""

from flask import g, current_app
from flask_resources import (
    from_conf,
    request_parser,
    resource_requestctx,
    response_handler,
    route,
)
from invenio_records_resources.resources.files.resource import request_stream
from invenio_records_resources.resources.records.resource import (
    RecordResource,
    request_data,
    request_extra_args,
    request_headers,
    request_search_args,
    request_view_args,
    request_read_args,
)
from invenio_records_resources.resources.records.utils import search_preference
from invenio_search.engine import dsl
from invenio_stats import current_stats

from invenio_communities.proxies import current_communities

request_community_requests_search_args = request_parser(
    from_conf("request_community_requests_search_args"), location="args"
)


class CommunityResource(RecordResource):
    """Communities resource."""

    def create_url_rules(self):
        """Create the URL rules for the record resource."""
        routes = self.config.routes
        return [
            route("GET", routes["list"], self.search),
            route("POST", routes["list"], self.create),
            route("GET", routes["item"], self.read),
            route("PUT", routes["item"], self.update),
            route("DELETE", routes["item"], self.delete),
            route("GET", routes["user-communities"], self.search_user_communities),
            route("POST", routes["rename"], self.rename),
            route("GET", routes["logo"], self.read_logo),
            route("PUT", routes["logo"], self.update_logo),
            route("DELETE", routes["logo"], self.delete_logo),
            route("GET", routes["featured-search"], self.featured_communities_search),
            route("GET", routes["featured-list"], self.featured_list),
            route("POST", routes["featured-list"], self.featured_create),
            route("PUT", routes["featured-item"], self.featured_update),
            route("DELETE", routes["featured-item"], self.featured_delete),
            route("GET", routes["community-requests"], self.search_community_requests),
            route("POST", routes["restore-community"], self.restore_community),
            route("GET", routes["list-persons"], self.search_persons),
            route("POST", routes["list-persons"], self.create_person),
            route("GET", routes["item-persons"], self.read_person),
            route("PUT", routes["item-persons"], self.update_person),
            route("DELETE", routes["item-persons"], self.delete_person),
            route("GET", routes["user-persons"], self.search_user_persons),
            route("POST", routes["rename-persons"], self.rename_persons),
            route("GET", routes["logo-persons"], self.read_logo_persons),
            route("PUT", routes["logo-persons"], self.update_logo_persons),
            route("DELETE", routes["logo-persons"], self.delete_logo_persons),
            route("GET", routes["featured-search-persons"], self.featured_persons_search),
            route("GET", routes["featured-list-persons"], self.featured_list_persons),
            route("POST", routes["featured-list-persons"], self.featured_create_persons),
            route("PUT", routes["featured-item-persons"], self.featured_update_persons),
            route("DELETE", routes["featured-item-persons"], self.featured_delete_persons),
            route("GET", routes["community-requests-persons"], self.search_person_requests),
            route("POST", routes["restore-person"], self.restore_person),
            route("GET", routes["list-organizations"], self.search_organizations),
            route("POST", routes["list-organizations"], self.create_organization),
            route("GET", routes["item-organizations"], self.read_organization),
            route("PUT", routes["item-organizations"], self.update_organization),
            route("DELETE", routes["item-organizations"], self.delete_organization),
            route("GET", routes["user-organizations"], self.search_user_organizations),
            route("POST", routes["rename-organizations"], self.rename_organizations),
            route("GET", routes["logo-organizations"], self.read_logo_organizations),
            route("PUT", routes["logo-organizations"], self.update_logo_organizations),
            route("DELETE", routes["logo-organizations"], self.delete_logo_organizations),
            route("GET", routes["featured-search-organizations"], self.featured_organizations_search),
            route("GET", routes["featured-list-organizations"], self.featured_list_organizations),
            route("POST", routes["featured-list-organizations"], self.featured_create_organizations),
            route("PUT", routes["featured-item-organizations"], self.featured_update_organizations),
            route("DELETE", routes["featured-item-organizations"], self.featured_delete_organizations),
            route("GET", routes["community-requests-organizations"], self.search_organization_requests),
            route("POST", routes["restore-organization"], self.restore_organization),
        ]

    #
    # Primary Interface
    #
    @request_search_args
    @response_handler(many=True)
    def search(self):
        """Perform a search over persons.

        GET /persons
        """
        extra_filter = dsl.Q(
            {
                "bool": {
                    "must_not": [
                        {
                            "term": {
                                "metadata.type.id": "person"
                            }
                        },
                        {
                            "term": {
                                "metadata.type.id": "organization"
                            }
                        }
                    ]
                }
            })
        hits = self.service.search(
            identity=g.identity,
            params=resource_requestctx.args,
            search_preference=search_preference(),
            extra_filter=extra_filter,
        )
        return hits.to_dict(), 200

    @request_search_args
    @response_handler(many=True)
    def search_persons(self):
        """Perform a search over persons.

        GET /persons
        """
        extra_filter = dsl.Q("term", **{"metadata.type.id": "person"})
        hits = self.service.search(
            identity=g.identity,
            params=resource_requestctx.args,
            search_preference=search_preference(),
            extra_filter=extra_filter,
        )
        return hits.to_dict(), 200

    @request_search_args
    @response_handler(many=True)
    def search_organizations(self):
        """Perform a search over organizations.

        GET /organizations
        """
        extra_filter = dsl.Q("term", **{"metadata.type.id": "organization"})
        hits = self.service.search(
            identity=g.identity,
            params=resource_requestctx.args,
            search_preference=search_preference(),
            extra_filter=extra_filter,
        )
        return hits.to_dict(), 200

    @request_extra_args
    @request_data
    @response_handler()
    def create_person(self):
        """Create an item."""
        item = self.service.create(
            g.identity,
            resource_requestctx.data or {},
            expand=resource_requestctx.args.get("expand", False),
        )
        return item.to_dict(), 201

    @request_extra_args
    @request_data
    @response_handler()
    def create_organization(self):
        """Create an item."""
        item = self.service.create(
            g.identity,
            resource_requestctx.data or {},
            expand=resource_requestctx.args.get("expand", False),
        )
        return item.to_dict(), 201

    @request_extra_args
    @request_read_args
    @request_view_args
    @response_handler()
    def read_person(self):
        """Read an item."""
        item = self.service.read(
            g.identity,
            resource_requestctx.view_args["pid_value"],
            expand=resource_requestctx.args.get("expand", False),
        )

        # we emit the record view stats event here rather than in the service because
        # the service might be called from other places as well that we don't want
        # to count, e.g. from some CLI commands
        emitter = current_stats.get_event_emitter("record-view")
        if item is not None and emitter is not None:
            emitter(current_app, record=item._record, via_api=True)

        return item.to_dict(), 200

    @request_extra_args
    @request_read_args
    @request_view_args
    @response_handler()
    def read_organization(self):
        """Read an item."""
        item = self.service.read(
            g.identity,
            resource_requestctx.view_args["pid_value"],
            expand=resource_requestctx.args.get("expand", False),
        )

        # we emit the record view stats event here rather than in the service because
        # the service might be called from other places as well that we don't want
        # to count, e.g. from some CLI commands
        emitter = current_stats.get_event_emitter("record-view")
        if item is not None and emitter is not None:
            emitter(current_app, record=item._record, via_api=True)

        return item.to_dict(), 200

    @request_extra_args
    @request_headers
    @request_view_args
    @request_data
    @response_handler()
    def update_person(self):
        """Update an item."""
        item = self.service.update(
            g.identity,
            resource_requestctx.view_args["pid_value"],
            resource_requestctx.data,
            revision_id=resource_requestctx.headers.get("if_match"),
            expand=resource_requestctx.args.get("expand", False),
        )
        return item.to_dict(), 200

    @request_extra_args
    @request_headers
    @request_view_args
    @request_data
    @response_handler()
    def update_organization(self):
        """Update an item."""
        item = self.service.update(
            g.identity,
            resource_requestctx.view_args["pid_value"],
            resource_requestctx.data,
            revision_id=resource_requestctx.headers.get("if_match"),
            expand=resource_requestctx.args.get("expand", False),
        )
        return item.to_dict(), 200

    @request_search_args
    @response_handler(many=True)
    def search_user_communities(self):
        """Perform a search over the user's communities.

        GET /user/communities
        """
        extra_filter = dsl.Q(
            {
                "bool": {
                    "must_not": [
                        {
                            "term": {
                                "metadata.type.id": "person"
                            }
                        },
                        {
                            "term": {
                                "metadata.type.id": "organization"
                            }
                        }
                    ]
                }
            })
        hits = self.service.search_user_communities(
            identity=g.identity,
            params=resource_requestctx.args,
            search_preference=search_preference(),
            extra_filter=extra_filter,
        )
        return hits.to_dict(), 200

    @request_search_args
    @response_handler(many=True)
    def search_user_persons(self):
        """Perform a search over the user's persons.

        GET /user/persons
        """
        extra_filter = dsl.Q("term", **{"metadata.type.id": "person"})
        hits = self.service.search_user_communities(
            identity=g.identity,
            params=resource_requestctx.args,
            search_preference=search_preference(),
            extra_filter=extra_filter
        )
        return hits.to_dict(), 200

    @request_search_args
    @response_handler(many=True)
    def search_user_organizations(self):
        """Perform a search over the user's organizations.

        GET /user/organizations
        """
        extra_filter = dsl.Q("term", **{"metadata.type.id": "organization"})
        hits = self.service.search_user_communities(
            identity=g.identity,
            params=resource_requestctx.args,
            search_preference=search_preference(),
            extra_filter=extra_filter
        )
        return hits.to_dict(), 200

    @request_extra_args
    @request_view_args
    @request_community_requests_search_args
    @response_handler(many=True)
    def search_community_requests(self):
        """Perform a search over the community's requests.

        GET /communities/<pid_value>/requests
        """
        hits = self.service.search_community_requests(
            identity=g.identity,
            community_id=resource_requestctx.view_args["pid_value"],
            params=resource_requestctx.args,
            search_preference=search_preference(),
            expand=resource_requestctx.args.get("expand", False),
        )
        return hits.to_dict(), 200

    @request_extra_args
    @request_view_args
    @request_community_requests_search_args
    @response_handler(many=True)
    def search_person_requests(self):
        """Perform a search over the community's requests.

        GET /communities/<pid_value>/requests
        """
        hits = self.service.search_community_requests(
            identity=g.identity,
            community_id=resource_requestctx.view_args["pid_value"],
            params=resource_requestctx.args,
            search_preference=search_preference(),
            expand=resource_requestctx.args.get("expand", False),
        )
        return hits.to_dict(), 200

    @request_extra_args
    @request_view_args
    @request_community_requests_search_args
    @response_handler(many=True)
    def search_organization_requests(self):
        """Perform a search over the community's requests.

        GET /communities/<pid_value>/requests
        """
        hits = self.service.search_community_requests(
            identity=g.identity,
            community_id=resource_requestctx.view_args["pid_value"],
            params=resource_requestctx.args,
            search_preference=search_preference(),
            expand=resource_requestctx.args.get("expand", False),
        )
        return hits.to_dict(), 200

    @request_headers
    @request_view_args
    @request_data
    @response_handler()
    def rename(self):
        """Rename a community."""
        item = self.service.rename(
            g.identity,
            resource_requestctx.view_args["pid_value"],
            resource_requestctx.data,
            revision_id=resource_requestctx.headers.get("if_match"),
        )
        return item.to_dict(), 200

    @request_headers
    @request_view_args
    @request_data
    @response_handler()
    def rename_persons(self):
        """Rename a community."""
        item = self.service.rename(
            g.identity,
            resource_requestctx.view_args["pid_value"],
            resource_requestctx.data,
            revision_id=resource_requestctx.headers.get("if_match"),
        )
        return item.to_dict(), 200

    @request_headers
    @request_view_args
    @request_data
    @response_handler()
    def rename_organizations(self):
        """Rename a community."""
        item = self.service.rename(
            g.identity,
            resource_requestctx.view_args["pid_value"],
            resource_requestctx.data,
            revision_id=resource_requestctx.headers.get("if_match"),
        )
        return item.to_dict(), 200

    @request_view_args
    def read_logo(self):
        """Read logo's content."""
        community_pid = resource_requestctx.view_args["pid_value"]
        item = self.service.read_logo(
            g.identity,
            community_pid,
        )
        community = current_communities.service.read(
            id_=community_pid, identity=g.identity
        ).to_dict()

        is_restricted = community["access"]["visibility"] == "restricted"

        return item.send_file(restricted=is_restricted)

    @request_view_args
    def read_logo_persons(self):
        """Read logo's content."""
        return self.read_logo()

    @request_view_args
    def read_logo_organizations(self):
        """Read logo's content."""
        return self.read_logo()

    @request_view_args
    @request_stream
    @response_handler()
    def update_logo(self):
        """Upload logo content."""
        item = self.service.update_logo(
            g.identity,
            resource_requestctx.view_args["pid_value"],
            resource_requestctx.data["request_stream"],
            content_length=resource_requestctx.data["request_content_length"],
        )
        return item.to_dict(), 200

    @request_view_args
    @request_stream
    @response_handler()
    def update_logo_persons(self):
        """Upload logo content."""
        item = self.service.update_logo(
            g.identity,
            resource_requestctx.view_args["pid_value"],
            resource_requestctx.data["request_stream"],
            content_length=resource_requestctx.data["request_content_length"],
        )
        return item.to_dict(), 200

    @request_view_args
    @request_stream
    @response_handler()
    def update_logo_organizations(self):
        """Upload logo content."""
        item = self.service.update_logo(
            g.identity,
            resource_requestctx.view_args["pid_value"],
            resource_requestctx.data["request_stream"],
            content_length=resource_requestctx.data["request_content_length"],
        )
        return item.to_dict(), 200

    #
    # Deletion workflows
    #
    @request_headers
    @request_view_args
    @request_data
    def delete(self):
        """Read the related review request."""
        self.service.delete_community(
            g.identity,
            resource_requestctx.view_args["pid_value"],
            resource_requestctx.data,
            revision_id=resource_requestctx.headers.get("if_match"),
        )

        return "", 204

    @request_headers
    @request_view_args
    @request_data
    def delete_person(self):
        """Read the related review request."""
        self.service.delete_community(
            g.identity,
            resource_requestctx.view_args["pid_value"],
            resource_requestctx.data,
            revision_id=resource_requestctx.headers.get("if_match"),
        )

        return "", 204

    @request_headers
    @request_view_args
    @request_data
    def delete_organization(self):
        """Read the related review request."""
        self.service.delete_community(
            g.identity,
            resource_requestctx.view_args["pid_value"],
            resource_requestctx.data,
            revision_id=resource_requestctx.headers.get("if_match"),
        )

        return "", 204

    @request_headers
    @request_view_args
    @request_data
    def restore_community(self):
        """Read the related review request."""
        item = self.service.restore_community(
            g.identity,
            resource_requestctx.view_args["pid_value"],
            resource_requestctx.data,
        )

        return item.to_dict(), 200

    @request_headers
    @request_view_args
    @request_data
    def restore_person(self):
        """Read the related review request."""
        item = self.service.restore_community(
            g.identity,
            resource_requestctx.view_args["pid_value"],
            resource_requestctx.data,
        )

        return item.to_dict(), 200

    @request_view_args
    def restore_organization(self):
        """Read the related review request."""
        item = self.service.restore_community(
            g.identity,
            resource_requestctx.view_args["pid_value"],
            resource_requestctx.data,
        )

        return item.to_dict(), 200

    @request_view_args
    def delete_logo(self):
        """Delete logo."""
        self.service.delete_logo(
            g.identity,
            resource_requestctx.view_args["pid_value"],
        )
        return "", 204

    @request_view_args
    def delete_logo_persons(self):
        """Delete logo."""
        self.service.delete_logo(
            g.identity,
            resource_requestctx.view_args["pid_value"],
        )
        return "", 204

    @request_view_args
    def delete_logo_organizations(self):
        """Delete logo."""
        self.service.delete_logo(
            g.identity,
            resource_requestctx.view_args["pid_value"],
        )
        return "", 204

    @request_search_args
    @response_handler(many=True)
    def featured_communities_search(self):
        """Features communities search."""
        hits = self.service.featured_search(
            identity=g.identity,
            params=resource_requestctx.args,
            search_preference=search_preference(),
        )
        return hits.to_dict(), 200

    @request_search_args
    @response_handler(many=True)
    def featured_persons_search(self):
        """Features persons search."""
        person_filter = dsl.Q(
            "term", **{"metadata.type.id": "person"}
        )
        hits = self.service.featured_search(
            identity=g.identity,
            params=resource_requestctx.args,
            search_preference=search_preference(),
            extra_filters=person_filter
        )
        return hits.to_dict(), 200

    @request_search_args
    @response_handler(many=True)
    def featured_organizations_search(self):
        """Features organizations search."""
        organization_filter = dsl.Q(
            "term", **{"metadata.type.id": "organization"}
        )
        hits = self.service.featured_search(
            identity=g.identity,
            params=resource_requestctx.args,
            search_preference=search_preference(),
            extra_filters=organization_filter
        )
        return hits.to_dict(), 200

    @request_headers
    @request_view_args
    @response_handler()
    def featured_list(self):
        """List featured entries for a community."""
        items = self.service.featured_list(
            g.identity,
            resource_requestctx.view_args["pid_value"],
        )
        return items.to_dict(), 200

    @request_headers
    @request_view_args
    @response_handler()
    def featured_list_persons(self):
        """List featured entries for a community."""
        items = self.service.featured_list(
            g.identity,
            resource_requestctx.view_args["pid_value"],
        )
        return items.to_dict(), 200

    @request_headers
    @request_view_args
    @response_handler()
    def featured_list_organizations(self):
        """List featured entries for a community."""
        items = self.service.featured_list(
            g.identity,
            resource_requestctx.view_args["pid_value"],
        )
        return items.to_dict(), 200

    @request_headers
    @request_view_args
    @request_data
    @response_handler()
    def featured_create(self):
        """Create a featured community entry."""
        item = self.service.featured_create(
            g.identity,
            resource_requestctx.view_args["pid_value"],
            resource_requestctx.data,
        )
        return item.to_dict(), 201

    @request_headers
    @request_view_args
    @request_data
    @response_handler()
    def featured_create_persons(self):
        """Create a featured community entry."""
        item = self.service.featured_create(
            g.identity,
            resource_requestctx.view_args["pid_value"],
            resource_requestctx.data,
        )
        return item.to_dict(), 201

    @request_headers
    @request_view_args
    @request_data
    @response_handler()
    def featured_create_organizations(self):
        """Create a featured community entry."""
        item = self.service.featured_create(
            g.identity,
            resource_requestctx.view_args["pid_value"],
            resource_requestctx.data,
        )
        return item.to_dict(), 201

    @request_headers
    @request_view_args
    @request_data
    @response_handler()
    def featured_update(self):
        """Update a featured community entry."""
        item = self.service.featured_update(
            g.identity,
            resource_requestctx.view_args["pid_value"],
            resource_requestctx.data,
            featured_id=resource_requestctx.view_args["featured_id"],
        )
        return item.to_dict(), 200

    @request_headers
    @request_view_args
    @request_data
    @response_handler()
    def featured_update_persons(self):
        """Update a featured community entry."""
        item = self.service.featured_update(
            g.identity,
            resource_requestctx.view_args["pid_value"],
            resource_requestctx.data,
            featured_id=resource_requestctx.view_args["featured_id"],
        )
        return item.to_dict(), 200

    @request_headers
    @request_view_args
    @request_data
    @response_handler()
    def featured_update_organizations(self):
        """Update a featured community entry."""
        item = self.service.featured_update(
            g.identity,
            resource_requestctx.view_args["pid_value"],
            resource_requestctx.data,
            featured_id=resource_requestctx.view_args["featured_id"],
        )
        return item.to_dict(), 200

    @request_view_args
    def featured_delete(self):
        """Delete a featured community entry."""
        self.service.featured_delete(
            g.identity,
            resource_requestctx.view_args["pid_value"],
            featured_id=resource_requestctx.view_args["featured_id"],
        )
        return "", 204

    @request_view_args
    def featured_delete_persons(self):
        """Delete a featured community entry."""
        self.service.featured_delete(
            g.identity,
            resource_requestctx.view_args["pid_value"],
            featured_id=resource_requestctx.view_args["featured_id"],
        )
        return "", 204

    @request_view_args
    def featured_delete_organizations(self):
        """Delete a featured community entry."""
        self.service.featured_delete(
            g.identity,
            resource_requestctx.view_args["pid_value"],
            featured_id=resource_requestctx.view_args["featured_id"],
        )
        return "", 204
