/*
 * This file is part of Invenio.
 * Copyright (C) 2016-2022 CERN.
 * Copyright (C) 2021-2022 Northwestern University.
 *
 * Invenio is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import {i18next} from "@translations/invenio_communities/i18next";
import {Formik, useFormikContext} from "formik";
import _isEmpty from "lodash/isEmpty";
import _get from "lodash/get";
import React, {Component} from "react";
import ReactDOM from "react-dom";
import {
  CustomFields,
  FieldLabel,
  RadioField,
  TextField,
  withCancel,
} from "react-invenio-forms";
import {Button, Divider, Form, Grid, Header, Icon, Message} from "semantic-ui-react";
import {CommunityApi} from "../api";
import {communityErrorSerializer} from "../api/serializers";
import PropTypes from "prop-types";

const IdentifierField = ({formConfig}) => {
  const {values} = useFormikContext();

  const helpText = (
    <>
      {formConfig.person ?
        i18next.t(
          "This is your person's unique identifier. You will be able to access your person profile through the URL:"
        ) :
        i18next.t(
          "This is your community's unique identifier. You will be able to access your community through the URL:"
        )
      }
      <br/>
      {`${formConfig.SITE_UI_URL}/communities/${values["slug"]}`}
    </>
  );

  return (
    <TextField
      required
      id="slug"
      label={
        <FieldLabel htmlFor="slug" icon="barcode" label={i18next.t("Identifier")}/>
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

  componentWillUnmount() {
    this.cancellableCreate && this.cancellableCreate.cancel();
  }

  setGlobalError = (errorMsg) => {
    this.setState({error: errorMsg});
  };

  onSubmit = async (values, {setSubmitting, setFieldError}) => {
    setSubmitting(true);
    const client = new CommunityApi();
    const payload = {
      metadata: {},
      ...values,
    };
    this.cancellableCreate = withCancel(client.create(payload));

    try {
      const response = await this.cancellableCreate.promise;
      setSubmitting(false);
      window.location.href = response.data.links.settings_html;
    } catch (error) {
      if (error === "UNMOUNTED") return;

      const {errors, message} = communityErrorSerializer(error);

      if (message) {
        this.setGlobalError(message);
      }

      if (errors) {
        errors.map(({field, messages}) => setFieldError(field, messages[0]));
      }
    }
  };

  render() {
    const {formConfig, canCreateRestricted} = this.props;
    const {error} = this.state;

    let initialValues = {
      access: {
        visibility: "public",
      },
      slug: "",
    };
    if (formConfig.person) {
      initialValues["metadata"] = {
        type: {
          id: "person"
        }
      };
    }

    return (
      <Formik
        initialValues={initialValues}
        onSubmit={this.onSubmit}
      >
        {({values, isSubmitting, handleSubmit}) => (
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
                    {formConfig.person ? i18next.t("Setup your new person") : i18next.t("Setup your new community")}
                  </Header>
                  <Divider/>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row textAlign="left">
                <Grid.Column mobile={16} tablet={12} computer={8}>
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
                        label={formConfig.person ?
                          i18next.t("Person most frequent citation form (ex: LASTNAME, Firstname)") :
                          i18next.t("Community name")
                        }
                      />
                    }
                  />
                  {formConfig.person && (
                    <TextField
                      required
                      id="metadata.firstname"
                      fluid
                      fieldPath="metadata.firstname"
                      // Prevent submitting before the value is updated:
                      onKeyDown={(e) => {
                        e.key === "Enter" && e.preventDefault();
                      }}
                      label={
                        <FieldLabel
                          htmlFor="metadata.firstname"
                          icon="user"
                          label={i18next.t("First name")}
                        />
                      }
                    />)}
                  {formConfig.person && (
                    <TextField
                      required
                      id="metadata.lastname"
                      fluid
                      fieldPath="metadata.lastname"
                      // Prevent submitting before the value is updated:
                      onKeyDown={(e) => {
                        e.key === "Enter" && e.preventDefault();
                      }}
                      label={
                        <FieldLabel
                          htmlFor="metadata.lastname"
                          icon="user"
                          label={i18next.t("Last name")}
                        />
                      }
                    />)}
                  <IdentifierField formConfig={formConfig}/>
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
                        as="h3">{formConfig.person ? i18next.t("Person visibility") : i18next.t("Community visibility")}</Header>
                      {formConfig.access.visibility.map((item) => (
                        <React.Fragment key={item.value}>
                          <RadioField
                            key={item.value}
                            fieldPath="access.visibility"
                            label={item.text}
                            labelIcon={item.icon}
                            checked={_get(values, "access.visibility") === item.value}
                            value={item.value}
                            onChange={({event, data, formikProps}) => {
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
                    disabled={isSubmitting}
                    type="button"
                    onClick={(event) => handleSubmit(event)}
                  >
                    <Icon name="plus"/>
                    {formConfig.person ? i18next.t("Create person") : i18next.t("Create community")}
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
