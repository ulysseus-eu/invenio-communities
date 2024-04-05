// This file is part of InvenioCommunities
// Copyright (C) 2022 CERN.
//
// Invenio RDM is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React from "react";
import ReactDOM from "react-dom";
import {Formik} from "formik";
import {Checkbox, Form, Header} from "semantic-ui-react";

const domContainer = document.getElementById("invenio-specific-communities-config");

const initialValues = {
  showSpecificCommunities: false,
}

ReactDOM.render(<>
    <Header as="h1">
      Specific communities
    </Header>
    <Formik
      initialValues={initialValues}
    >
      {({values, isSubmitting, handleSubmit}) => (
        <Form>
          <Checkbox label={"Show specific community types"}></Checkbox>
        </Form>)}
    </Formik>
  </>, domContainer // Target container on where to render the React components.
);
