// This file is part of InvenioVocabularies
// Copyright (C) 2021-2023 CERN.
// Copyright (C) 2021 Northwestern University.
//
// Invenio is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React from "react";
import PropTypes from "prop-types";
import { FieldArray, getIn } from "formik";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import { Button, Form, Icon, List } from "semantic-ui-react";
import { FieldLabel } from "react-invenio-forms";

import { FundingFieldItem } from "./FundingFieldItem";
import FundingModal from "./FundingModal";

import { i18next } from "@translations/invenio_rdm_records/i18next";

import Overridable from "react-overridable";

function PersonFieldForm(props) {
  const {
    label,
    labelIcon,
    fieldPath,
    form: { values },
    move: formikArrayMove,
    push: formikArrayPush,
    remove: formikArrayRemove,
    replace: formikArrayReplace,
    required,
    deserializePerson: deserializePersonFunc,
    computeFundingContents: computeFundingContentsFunc,
    searchConfig,
  } = props;

  const deserializePerson = deserializePersonFunc
    ? deserializePersonFunc
    : (person) => ({
        first_name: person.first_name,
        last_name: person.last_name,
        middle_name: person.middle_name ?? "",
      });

  return (
    <DndProvider backend={HTML5Backend}>
      <Form.Field required={required}>
        <FieldLabel htmlFor={fieldPath} icon={labelIcon} label={label} />
        <List>
          {getIn(values, fieldPath, []).map((value, index) => {
            const key = `${fieldPath}.${index}`;
            // if award does not exist or has no id, it's a custom one
            return (
              <PersonFieldItem
                key={key}
                {...{
                  index,
                  compKey: key,
                  fundingItem: value,
                  moveFunding: formikArrayMove,
                  replaceFunding: formikArrayReplace,
                  removeFunding: formikArrayRemove,
                  searchConfig: searchConfig,
                  computeFundingContents: computeFundingContents,
                  deserializePerson: deserializePerson,
                  deserializeFunder: deserializeFunder,
                }}
              />
            );
          })}
        </List>

        <Overridable id="InvenioVocabularies.FundingField.AddAwardFundingModal.Container">
          <FundingModal
            searchConfig={searchConfig}
            trigger={
              <Button
                type="button"
                key="custom"
                icon
                labelPosition="left"
                className="mb-5"
              >
                <Icon name="add" />
                {i18next.t("Add award")}
              </Button>
            }
            onAwardChange={(selectedFunding) => {
              formikArrayPush(selectedFunding);
            }}
            mode="standard"
            action="add"
            deserializePerson={deserializePerson}
            deserializeFunder={deserializeFunder}
            computeFundingContents={computeFundingContents}
          />
        </Overridable>

        <Overridable id="InvenioVocabularies.FundingField.AddCustomFundingModal.Container">
          <FundingModal
            searchConfig={searchConfig}
            trigger={
              <Button type="button" key="custom" icon labelPosition="left">
                <Icon name="add" />
                {i18next.t("Add custom")}
              </Button>
            }
            onAwardChange={(selectedFunding) => {
              formikArrayPush(selectedFunding);
            }}
            mode="custom"
            action="add"
            deserializePerson={deserializePerson}
            deserializeFunder={deserializeFunder}
            computeFundingContents={computeFundingContents}
          />
        </Overridable>
      </Form.Field>
    </DndProvider>
  );
}

PersonFieldForm.propTypes = {
  label: PropTypes.node,
  labelIcon: PropTypes.node,
  fieldPath: PropTypes.string.isRequired,
  form: PropTypes.object,
  move: PropTypes.func,
  push: PropTypes.func,
  remove: PropTypes.func,
  replace: PropTypes.func,
  required: PropTypes.bool,
  deserializePerson: PropTypes.func,
  deserializeFunder: PropTypes.func,
  computeFundingContents: PropTypes.func,
  searchConfig: PropTypes.object,
};

PersonFieldForm.defaultProps = {
  label: undefined,
  labelIcon: undefined,
  form: undefined,
  move: undefined,
  push: undefined,
  remove: undefined,
  replace: undefined,
  required: undefined,
  deserializePerson: undefined,
  deserializeFunder: undefined,
  computeFundingContents: undefined,
  searchConfig: undefined,
};

export function FundingField(props) {
  const { fieldPath } = props;
  return (
    <FieldArray
      name={fieldPath}
      component={(formikProps) => <PersonFieldForm {...formikProps} {...props} />}
    />
  );
}

FundingField.propTypes = {
  fieldPath: PropTypes.string.isRequired,
  label: PropTypes.string,
  labelIcon: PropTypes.string,
  searchConfig: PropTypes.object.isRequired,
  required: PropTypes.bool,
  deserializePerson: PropTypes.func,
  deserializeFunder: PropTypes.func,
  computeFundingContents: PropTypes.func,
};

FundingField.defaultProps = {
  label: "Awards",
  labelIcon: "money bill alternate outline",
  required: false,
  deserializePerson: undefined,
  deserializeFunder: undefined,
  computeFundingContents: undefined,
};
