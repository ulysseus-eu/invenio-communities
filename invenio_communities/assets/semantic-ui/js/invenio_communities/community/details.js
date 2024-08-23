import React from "react";
import ReactDOM from "react-dom";

import { Card, CardContent, CardDescription, Grid, GridColumn, GridRow, Header, HeaderContent, Image, Label, List, ListItem } from 'semantic-ui-react';

const rootContainer = document.getElementById("details-container");
const community = rootContainer.dataset.community;
const dataCommunity = JSON.parse(community);
const fullName = `${dataCommunity.person?.givenName ? capitalizeFirstLetter(dataCommunity.person.givenName) + (dataCommunity.person?.familyName ? ' ' + dataCommunity.person.familyName.toUpperCase() : '') : (capitalizeFirstLetter(dataCommunity.title) ?? '')}`;

function capitalizeFirstLetter(str) {
    if (str.length > 0) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}

ReactDOM.render(
    <>
        <Card style={{ width: '100%' }}>
            <CardContent>
                <Grid columns={2}>
                    <GridRow divided>
                        <GridColumn width={4} textAlign="center">
                            <Image src='/static/images/square-placeholder.png' size='small' bordered />
                        </GridColumn>
                        <GridColumn width={9}>
                            <CardDescription>
                            {dataCommunity &&
                                <List>
                                    <ListItem>
                                        <Header as='h3'>
                                            <HeaderContent>{fullName}</HeaderContent>
                                        </Header>
                                    </ListItem>
                                    {dataCommunity.person?.given_name && <ListItem>
                                        <Label horizontal>
                                            Firstname
                                        </Label>
                                        {capitalizeFirstLetter(dataCommunity.person.given_name)}
                                    </ListItem>}
                                    {dataCommunity.person?.family_name && <ListItem>
                                        <Label horizontal>
                                            Lastname
                                        </Label>
                                        {dataCommunity.person.family_name.toUpperCase()}
                                    </ListItem>}
                                    {dataCommunity.description && <ListItem>
                                        <Label horizontal>
                                            Description
                                        </Label>
                                        {dataCommunity.description}
                                    </ListItem>}
                                </List>}
                            </CardDescription>
                        </GridColumn>
                    </GridRow>
                </Grid>
            </CardContent>
        </Card>
    </>, rootContainer);
