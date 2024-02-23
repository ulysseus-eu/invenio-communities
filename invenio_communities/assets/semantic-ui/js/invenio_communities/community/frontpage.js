/*
 * This file is part of Invenio.
 * Copyright (C) 2016-2021 CERN.
 * Copyright (C) 2023 Northwestern University.
 *
 * Invenio is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React from "react";
import ReactDOM from "react-dom";

import CommunitiesCardGroup from "./CommunitiesCardGroup";
import {CommunityType} from "./utils";

const userCommunitiesContainer = document.getElementById("user-communities");
const userOrganizationsContainer = document.getElementById("user-organizations");
const userPersonsContainer = document.getElementById("user-persons");
const newCommunitiesContainer = document.getElementById("new-communities");
const newOrganizationsContainer = document.getElementById("new-organizations");
const newPersonsContainer = document.getElementById("new-persons");

if (userCommunitiesContainer) {
  const communityTypeUserCommunities = new CommunityType(JSON.parse(userCommunitiesContainer.dataset.communityType));
  ReactDOM.render(
    <CommunitiesCardGroup
      fetchDataUrl={["/api/user/", communityTypeUserCommunities.getPlural(), "?q=&sort=newest&page=1&size=1"].join("")}
      emptyMessage={"You are not a member of any "+communityTypeUserCommunities.getSingular()+"."}
      defaultLogo="/static/images/square-placeholder.png"
      itemsPerRow={1}
    />,
    userCommunitiesContainer
  );
}

if (userOrganizationsContainer) {
  const communityTypeUserCommunities = new CommunityType(JSON.parse(userOrganizationsContainer.dataset.communityType));
  ReactDOM.render(
    <CommunitiesCardGroup
      fetchDataUrl={["/api/user/", communityTypeUserCommunities.getPlural(), "?q=&sort=newest&page=1&size=1"].join("")}
      emptyMessage={"You are not a member of any "+communityTypeUserCommunities.getSingular()+"."}
      defaultLogo="/static/images/square-placeholder.png"
      itemsPerRow={1}
    />,
    userOrganizationsContainer
  );
}

if (userPersonsContainer) {
  const communityTypeUserCommunities = new CommunityType(JSON.parse(userPersonsContainer.dataset.communityType));
  ReactDOM.render(
    <CommunitiesCardGroup
      fetchDataUrl={["/api/user/", communityTypeUserCommunities.getPlural(), "?q=&sort=newest&page=1&size=1"].join("")}
      emptyMessage={"You are not a member of any "+communityTypeUserCommunities.getSingular()+"."}
      defaultLogo="/static/images/square-placeholder.png"
      itemsPerRow={1}
    />,
    userPersonsContainer
  );
}

if (newCommunitiesContainer) {
  const communityTypeNewCommunities = new CommunityType(JSON.parse(newCommunitiesContainer.dataset.communityType));
  ReactDOM.render(
    <CommunitiesCardGroup
      fetchDataUrl={"/api/"+communityTypeNewCommunities.getPlural()+"?q=&sort=newest&page=1&size=1"}
      emptyMessage={"There are no new " + communityTypeNewCommunities.getPlural() + "."}
      defaultLogo="/static/images/square-placeholder.png"
      itemsPerRow={1}
    />,
    newCommunitiesContainer
  );
}

if (newOrganizationsContainer) {
  const communityTypeNewCommunities = new CommunityType(JSON.parse(newOrganizationsContainer.dataset.communityType));
  ReactDOM.render(
    <CommunitiesCardGroup
      fetchDataUrl={"/api/"+communityTypeNewCommunities.getPlural()+"?q=&sort=newest&page=1&size=1"}
      emptyMessage={"There are no new " + communityTypeNewCommunities.getPlural() + "."}
      defaultLogo="/static/images/square-placeholder.png"
      itemsPerRow={1}
    />,
    newOrganizationsContainer
  );
}

if (newPersonsContainer) {
  const communityTypeNewCommunities = new CommunityType(JSON.parse(newPersonsContainer.dataset.communityType));
  ReactDOM.render(
    <CommunitiesCardGroup
      fetchDataUrl={"/api/"+communityTypeNewCommunities.getPlural()+"?q=&sort=newest&page=1&size=1"}
      emptyMessage={"There are no new " + communityTypeNewCommunities.getPlural() + "."}
      defaultLogo="/static/images/square-placeholder.png"
      itemsPerRow={1}
    />,
    newPersonsContainer
  );
}

