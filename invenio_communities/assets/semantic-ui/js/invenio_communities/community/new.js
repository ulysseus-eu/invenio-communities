/*
 * This file is part of Invenio.
 * Copyright (C) 2016-2024 CERN.
 * Copyright (C) 2021-2022 Northwestern University.
 *
 * Invenio is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import {i18next} from "@translations/invenio_communities/i18next";
import {Formik, useFormikContext} from "formik";
import _cloneDeep from "lodash/cloneDeep";
import _isEmpty from "lodash/isEmpty";
import _get from "lodash/get";
import _map from "lodash/map";
import React, {Component} from "react";
import ReactDOM from "react-dom";
import {
    CustomFields,
    FieldLabel,
    RadioField,
    RemoteSelectField,
    TextField,
    withCancel,
} from "react-invenio-forms";
import {Button, Divider, Form, Grid, Header, Icon, Message} from "semantic-ui-react";
import * as Yup from "yup";
import {CommunityApi} from "../api";
import {communityErrorSerializer} from "../api/serializers";
import PropTypes from "prop-types";
import {CommunityType} from "./utils";
import Overridable from "react-overridable";
import {removeEmptyValues, COMMUNITY_VALIDATION_SCHEMA} from "../settings/profile/CommunityProfileForm";


const IdentifierField = ({formConfig}) => {
    const {values} = useFormikContext();
    const communityType = new CommunityType(formConfig.community_type);

  const helpText = (
    <>
      {i18next.t(
        "This is your community's unique identifier. You will be able to access your community through the URL:"
      )}
      <br />
      {`${formConfig.SITE_UI_URL}/communities/${values["slug"].toLowerCase()}`}
    </>
  );

  return (
    <TextField
      required
      id="slug"
      label={
        <FieldLabel htmlFor="slug" icon="barcode" label={i18next.t("Identifier")} />
      }
      fieldPath="slug"
      helpText={helpText}
      fluid
      className="text-muted"
      // Prevent submitting before the value is updated:
      onKeyDown={(e) => {
        e.key === "Enter" && e.preventDefault();
      }}
    />
  );
};

IdentifierField.propTypes = {
  formConfig: PropTypes.object.isRequired,
};

class CommunityCreateForm extends Component {
  state = {
      error: "",
  };
  knownOrganizations = {};

  componentWillUnmount() {
    this.cancellableCreate && this.cancellableCreate.cancel();
  }

  /**
   * Serializes community values
   *
   * @param {object} values
   *
   * @returns
   */
  serializeValues = (values) => {
      let submittedCommunity = _cloneDeep(values);

      // Serialize organisations. If it is known and has an id, serialize a pair 'id/name'. Otherwise use 'name' only
      const organizations = submittedCommunity.metadata.organizations ? submittedCommunity.metadata.organizations.map(
          (organization) => {
              const orgID = this.knownOrganizations[organization];
              return {
                  ...(orgID && {id: orgID}),
                  name: organization,
              };
          }
      ) : [];

      submittedCommunity = {
          ...submittedCommunity,
          metadata: {...values.metadata, organizations},
      };
      if (submittedCommunity.metadata.type && submittedCommunity.metadata.type.id === CommunityType.person) {
          submittedCommunity.metadata["title"] =
              submittedCommunity.metadata.person.family_name + ", " + submittedCommunity.metadata.person.given_name;
      }

      // Clean values
      submittedCommunity = removeEmptyValues(submittedCommunity);

      return submittedCommunity;
  };

  setGlobalError = (errorMsg) => {
    this.setState({ error: errorMsg });
  };

    onSubmit = async (values, {setSubmitting, setFieldError}) => {
      setSubmitting(true);
      const client = new CommunityApi();
      const payload = this.serializeValues(values);
      this.cancellableCreate = withCancel(client.create(payload));

    try {
      const response = await this.cancellableCreate.promise;
      setSubmitting(false);
      window.location.href = response.data.links.settings_html;
    } catch (error) {
      if (error === "UNMOUNTED") return;

      const { errors, message } = communityErrorSerializer(error);

      if (message) {
        this.setGlobalError(message);
      }

      if (errors) {
        errors.map(({ field, messages }) => setFieldError(field, messages[0]));
      }
    }
  };

  render() {
    const { formConfig, canCreateRestricted } = this.props;
    const { error } = this.state;

        let initialValues = {
            access: {
                visibility: "public",
            },
            metadata: {
                title: "",
            },
            slug: "",
        };
        const communityType = new CommunityType(formConfig.community_type);
        if (communityType.communityType !== CommunityType.community) {
            initialValues["metadata"] = {
                type: {
                    id: communityType.communityType
                }
            };
        }
        if (communityType.communityType === CommunityType.organization) {
            initialValues["metadata"]["organizations"] = [];
        }

    return (
      <Formik
        initialValues={initialValues}
        validationSchema={COMMUNITY_VALIDATION_SCHEMA}
        onSubmit={this.onSubmit}
      >
        {({ values, isValid, isSubmitting, handleSubmit }) => (
          <Form onSubmit={handleSubmit} className="communities-creation">
            <Message hidden={error === ""} negative className="flashed">
              <Grid container centered>
                <Grid.Column mobile={16} tablet={12} computer={8} textAlign="left">
                  <strong>{error}</strong>
                </Grid.Column>
              </Grid>
            </Message>
            <Grid container centered>
              <Grid.Row>
                <Grid.Column mobile={16} tablet={12} computer={8} textAlign="center">
                  <Header as="h1" className="rel-mt-2">
                    {i18next.t("Setup your new " + communityType.getSingular())}
                  </Header>
                  <Divider />
                </Grid.Column>
              </Grid.Row>
              <Grid.Row textAlign="left">
                <Grid.Column mobile={16} tablet={12} computer={8}>
                  {(communityType.communityType !== CommunityType.person) && (
                    <TextField
                      required
                      id="metadata.title"
                      fluid
                      fieldPath="metadata.title"
                      // Prevent submitting before the value is updated:
                      onKeyDown={(e) => {
                        e.key === "Enter" && e.preventDefault();
                      }}
                      label={
                        <FieldLabel
                          htmlFor="metadata.title"
                          icon="book"
                          label={i18next.t(communityType.getSingularCapitalized() + " name")}
                        />
                      }
                    />)}
                    {(communityType.communityType === CommunityType.person) && (
                        <TextField
                            required
                            id="metadata.person.given_name"
                            fluid
                            fieldPath="metadata.person.given_name"
                            // Prevent submitting before the value is updated:
                            onKeyDown={(e) => {
                                e.key === "Enter" && e.preventDefault();
                            }}
                            label={
                                <FieldLabel
                                    htmlFor="metadata.person.given_name"
                                    icon="user"
                                    label={i18next.t("First name")}
                                />
                            }
                        />)}
                    {(communityType.communityType === CommunityType.person) && (
                        <TextField
                            required
                            id="metadata.person.family_name"
                            fluid
                            fieldPath="metadata.person.family_name"
                            // Prevent submitting before the value is updated:
                            onKeyDown={(e) => {
                                e.key === "Enter" && e.preventDefault();
                            }}
                            label={
                                <FieldLabel
                                    htmlFor="metadata.person.family_name"
                                    icon="user"
                                    label={i18next.t("Last name")}
                                />
                            }
                        />)}
                    {(communityType.communityType === CommunityType.organization) && (
                        <Overridable
                            id="InvenioCommunities.CommunityProfileForm.RemoteSelectField.MetadataOrganizations"
                        >
                            <RemoteSelectField
                                fieldPath="metadata.organizations"
                                suggestionAPIUrl="/api/affiliations"
                                suggestionAPIHeaders={{
                                    Accept: "application/json",
                                }}
                                placeholder={i18next.t("Search for an organization by name")}
                                clearable
                                multiple
                                initialSuggestions={[]}
                                serializeSuggestions={(organizations) =>
                                    _map(organizations, (organization) => {
                                        // eslint-disable-next-line no-prototype-builtins
                                        const isKnownOrg = this.knownOrganizations.hasOwnProperty(
                                            organization.name
                                        );
                                        if (!isKnownOrg) {
                                            this.knownOrganizations = {
                                                ...this.knownOrganizations,
                                                [organization.name]: organization.id,
                                            };
                                        }
                                        return {
                                            text: organization.name,
                                            value: organization.name,
                                            key: organization.name,
                                        };
                                    })
                                }
                                label={
                                    <FieldLabel
                                        htmlFor="metadata.organizations"
                                        icon="group"
                                        label={i18next.t("Organizations")}
                                    />
                                }
                                noQueryMessage={i18next.t("Search for organizations...")}
                                allowAdditions
                                search={(filteredOptions, searchQuery) => filteredOptions}
                            />
                        </Overridable>)}
                  <IdentifierField formConfig={formConfig} />
                  {!_isEmpty(customFields.ui) && (
                    <CustomFields
                      config={customFields.ui}
                      templateLoaders={[
                        (widget) => import(`@templates/custom_fields/${widget}.js`),
                        (widget) => import(`react-invenio-forms`),
                      ]}
                      fieldPathPrefix="custom_fields"
                    />
                  )}
                  {canCreateRestricted && (
                    <>
                      <Header
                        as="h3">{i18next.t(communityType.getSingularCapitalized() + " visibility")}</Header>
                      {formConfig.access.visibility.map((item) => (
                        <React.Fragment key={item.value}>
                          <RadioField
                            key={item.value}
                            fieldPath="access.visibility"
                            label={item.text}
                            labelIcon={item.icon}
                            checked={_get(values, "access.visibility") === item.value}
                            value={item.value}
                            onChange={({ event, data, formikProps }) => {
                              formikProps.form.setFieldValue(
                                "access.visibility",
                                item.value
                              );
                            }}
                          />
                          <label className="helptext">{item.helpText}</label>
                        </React.Fragment>
                      ))}
                    </>
                  )}
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column textAlign="center">
                  <Button
                    positive
                    icon
                    labelPosition="left"
                    loading={isSubmitting}
                    disabled={!isValid || isSubmitting}
                    type="button"
                    onClick={(event) => handleSubmit(event)}
                  >
                    <Icon name="plus" />
                    {i18next.t("Create " + communityType.getSingular())}
                  </Button>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Form>
        )}
      </Formik>
    );
  }
}

CommunityCreateForm.propTypes = {
  formConfig: PropTypes.object.isRequired,
  canCreateRestricted: PropTypes.bool.isRequired,
};

const domContainer = document.getElementById("app");
const formConfig = JSON.parse(domContainer.dataset.formConfig);
const customFields = JSON.parse(domContainer.dataset.customFields);
const canCreateRestricted = JSON.parse(domContainer.dataset.canCreateRestricted);

ReactDOM.render(
  <CommunityCreateForm
    formConfig={formConfig}
    customFields={customFields}
    canCreateRestricted={canCreateRestricted}
  />,
  domContainer
);
export default CommunityCreateForm;
