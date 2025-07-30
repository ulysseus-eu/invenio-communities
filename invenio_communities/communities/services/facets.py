# -*- coding: utf-8 -*-
#
# Copyright (C) 2022-2024 CERN.
# Copyright (C) 2023 Graz University of Technology.
#
# Invenio-Communities is free software; you can redistribute it and/or modify
# it under the terms of the MIT License; see LICENSE file for more details.

"""Facet definitions."""
from invenio_i18n import gettext as _
from invenio_records_resources.services.records.facets import TermsFacet

type = TermsFacet(
    field="metadata.type.id",
    label=_("Type"),
    value_labels={
        "organization": _("Organization"),
        "event": _("Event"),
        "topic": _("Topic"),
        "project": _("Project"),
        "person": _("Person"),
    },
)

visibility = TermsFacet(
    field="access.visibility",
    label=_("Visibility"),
    value_labels={
        "public": _("Public"),
        "restricted": _("Restricted"),
    },
)

university = TermsFacet(
    field="user_profile.profile.University.keyword",
    label="University",
)

Main_Keywords = TermsFacet(
    field="user_profile.profile.Main_Keywords.keyword",
    label="Main Keywords",
    value_labels=lambda keys: {k: k.capitalize() for k in keys}
)

Areas_of_expertise = TermsFacet(
    field="user_profile.profile.Areas_of_expertise.keyword",
    label="Areas of expertise",
    value_labels=lambda keys: {k: k.capitalize() for k in keys}
)

gender = TermsFacet(
    field="user_profile.profile.Gender.keyword",
    label="Gender",
    value_labels={
        "m": _("Male"),
        "f": _("Female"),
        "nts": _("Not shared"),
    },
)

expert_profile = TermsFacet(
    field="user_profile.profile.Expert_profile.keyword",
    label="Type of expert",
    value_labels={
        "teacher-lecturer": _("Teacher or Lecturer"),
        "researcher": _("Researcher"),
        "ulysseus-staff": _("Ulysseus staff"),
        "ulysseus-associated-partner": _("Ulysseus Associated Partner"),
        "other-stakeholders": _("Other Stakeholders"),
    },
)


career_stage = TermsFacet(
    field="user_profile.profile.Career_stage.keyword",
    label="Career Stage",
    value_labels={
        "r1": _("R1 - First Stage Researcher"),
        "r2": _("R2 - Recognised Researcher"),
        "r3": _("R3 - Established Researcher"),
        "r4": _("R4 - Leading Researcher"),
        "na": _("Not available"),
    },
)

trl_level = TermsFacet(
    field="user_profile.profile.TRL_level.keyword",
    label=_("TRL level"),
)

yes_no_value_labels = {"false": _('No'), "true": _('Yes')}
eu_proposal_writer = TermsFacet(
                field='user_profile.profile.EU_proposal_writer',
                label=_('Experience in writing proposal'),
                value_labels=yes_no_value_labels
            )

eu_project_leader = TermsFacet(
                field='user_profile.profile.EU_project_leader',
                label=_('Experience in leading granted projects'),
                value_labels=yes_no_value_labels
            )

eu_project_member = TermsFacet(
                field='user_profile.profile.EU_project_member',
                label=_('Experience as partners in granted projects'),
                value_labels=yes_no_value_labels
            )

knowledge_transfer = TermsFacet(
                field='user_profile.profile.Knowledge_Transfer',
                label=_('Experience in Knowledge Transfer'),
                value_labels=yes_no_value_labels
            )

knowledge_transfer_experience = TermsFacet(
    field='user_profile.profile.knowledge_transfer_experience.keyword',
    label=_('Type of knowledge transfer experience'),
)

interest_in_joint_research_groups = TermsFacet(
                field='user_profile.profile.Interest_in_Joint_Research_Groups',
                label=_('Interest in Joint Research Groups'),
                value_labels=yes_no_value_labels
            )

eu_project_evaluator = TermsFacet(
                field='user_profile.profile.EU_project_evaluator',
                label=_('Evaluator of EU projects?'),
                value_labels=yes_no_value_labels
            )

role = TermsFacet(
    field="role",
    label=_("Visibility"),
    value_labels={
        "owner": _("Owner"),
        "reader": _("Reader"),
        "manager": _("Manager"),
        "curator": _("Curator"),
    },
)

visible = TermsFacet(
    field="visible",
    label=_("Visibility"),
    value_labels={
        "hidden": _("Hidden"),
        "restricted": _("Restricted"),
    },
)
