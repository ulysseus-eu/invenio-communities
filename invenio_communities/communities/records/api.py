# -*- coding: utf-8 -*-
#
# This file is part of Invenio.
# Copyright (C) 2021 CERN.
#
# Invenio is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Records API."""

from __future__ import absolute_import, print_function

from invenio_records.systemfields import ConstantField
from invenio_records_resources.records.api import Record
from invenio_records_resources.records.systemfields import IndexField, PIDField

from invenio_communities.communities.records.models import CommunityMetadata

from .providers import CommunitiesIdProvider


class Community(Record):
    """Define API for community creation and manipulation."""

    pid = PIDField('id', provider=CommunitiesIdProvider, create=False)
    schema = ConstantField(
        '$schema', 'local://communities/communities-v1.0.0.json')

    model_cls = CommunityMetadata

    # TODO: communities-issue
    index = IndexField(
        "communities-communities-v1.0.0",
        search_alias="communities"
    )