import { i18next } from "@translations/invenio_communities/i18next";
import _get from "lodash/get";
import React from "react";
import { FieldLabel, TextField } from "react-invenio-forms";

export const CommunityPersonAdditionalFields = ({ fieldPath }) => {
  return (
    <>
      <TextField
        fluid
        fieldPath={`${fieldPath}.given_name`}
        label={
          <FieldLabel
            htmlFor={`${fieldPath}.given_name`}
            icon="user"
            label={i18next.t("First name")}
          />
        }
      />

      <TextField
        fluid
        fieldPath={`${fieldPath}.family_name`}
        label={
          <FieldLabel
            htmlFor={`${fieldPath}.family_name`}
            icon="user"
            label={i18next.t("Last name")}
          />
        }
      />

      <TextField
        fluid
        fieldPath={`${fieldPath}.email`}
        label={
          <FieldLabel
            htmlFor={`${fieldPath}.email`}
            icon="mail"
            label={"E-Mail"}
          />
        }
      />
    </>
  );
};
