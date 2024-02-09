import React from "react";
import { Card } from "semantic-ui-react";
import PropTypes from "prop-types";

export const ResultsGridItemTemplate = ({ result }) => {
  let api_root = "communities";
  if (result.metadata.type?.id === "person"){
    api_root = "persons";
  }
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
