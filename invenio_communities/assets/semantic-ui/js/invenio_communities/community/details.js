import React from "react";
import ReactDOM from "react-dom";

import { Card, CardContent, CardDescription, Grid, GridColumn, GridRow, Header, HeaderContent, Image, Label, List, ListItem } from 'semantic-ui-react';

const rootContainer = document.getElementById("details-container");
const community = rootContainer.dataset.community;
const dataCommunity = JSON.parse(community);
const fullName = `${dataCommunity.firstname ? dataCommunity.firstname + (dataCommunity.lastname ? ' ' + dataCommunity.lastname : '') : (dataCommunity.title ?? '')}`;

ReactDOM.render(
    <>
        <Header as='h2' icon textAlign='center'>
            <HeaderContent>{fullName}</HeaderContent>
        </Header>
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
                                    {dataCommunity.firstname && <ListItem>
                                        <Label horizontal>
                                            Firstname
                                        </Label>
                                        {dataCommunity.firstname}
                                    </ListItem>}
                                    {dataCommunity.lastname && <ListItem>
                                        <Label horizontal>
                                            Lastname
                                        </Label>
                                        {dataCommunity.lastname}
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