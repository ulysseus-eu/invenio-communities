/*
 * This file is part of Invenio.
 * Copyright (C) 2022 CERN.
 *
 * Invenio is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import _truncate from "lodash/truncate";
import { createSearchAppInit } from "@js/invenio_search_ui";

import _upperFirst from "lodash/upperFirst";
import { ManagerMembersResultsItem } from "./ManagerMembersResultItem";
import { MembersSearchBarElement } from "../../components/MembersSearchBarElement";
import { MembersResults } from "../components/MembersResult";
import { MembersResultsGridItem } from "../components/MembersResultsGridItem";
import { MembersSearchLayout } from "../components/MembersSearchLayout";
import { ManagerMembersResultsContainer } from "./ManagerMembersResultContainer";

const defaultComponents = {
  "ResultsList.item": ManagerMembersResultsItem,
  "ResultsGrid.item": MembersResultsGridItem,
  "SearchApp.layout": MembersSearchLayout,
  "SearchBar.element": MembersSearchBarElement,
  "SearchApp.results": MembersResults,
  "ResultsList.container": ManagerMembersResultsContainer,
};

// Auto-initialize search app
createSearchAppInit(defaultComponents);
