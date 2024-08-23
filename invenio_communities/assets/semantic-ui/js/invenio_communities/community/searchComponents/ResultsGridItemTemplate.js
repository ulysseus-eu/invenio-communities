import React from "react";
import { Card } from "semantic-ui-react";
import PropTypes from "prop-types";
import {CommunityType} from "../utils";

export const ResultsGridItemTemplate = ({ result }) => {
  let api_root = (new CommunityType(result.metadata.type?.id).getPlural());
  return (
    <Card fluid href={`/${api_root}/${result.slug}`}>
      <Card.Content>
        <Card.Header>{result.metadata.title}</Card.Header>
        <Card.Description>
          <div className="truncate-lines-2">{result.metadata.description}</div>
        </Card.Description>
      </Card.Content>
    </Card>
  );
};

ResultsGridItemTemplate.propTypes = {
  result: PropTypes.object.isRequired,
};
