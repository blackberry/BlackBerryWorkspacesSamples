/* Copyright (c) 2018 BlackBerry Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

 /*****************************************************************************
 * Workspaces list view. This form presents the user's content.
 *****************************************************************************/

import {ScrollView, StyleSheet, View, ActivityIndicator} from "react-native";
import {ListItem, List} from "react-native-elements";
import React, {Component} from "react";


type Props = {};

export class Workspaces extends Component<Props> {

    static navigationOptions = {
        title: 'Workspaces',
    };

    /*****************************************************************************
     * Constructor
     *****************************************************************************/
    constructor(props) {
        super(props);
        this.onPressWorkspace = this.onPressWorkspace.bind(this);
        this.accessToken = props.navigation.getParam('accessToken');
        this.serverAddress = props.navigation.getParam('serverAddress');

        this.state = {
            workspacesList: [],
        }

    }

    /*****************************************************************************
     * Upon load, fetch user's list of workspaces and present them
     *****************************************************************************/
    componentDidMount() {
        fetch('https://' + this.serverAddress + '/api/3.0/rooms/list', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.accessToken
            },
            body: JSON.stringify({
                isAdminMode : false,
                shouldAddExternalData :true
            })
        }).then(response => response.json()
            .then(responseJson => {
                console.log(responseJson);
                this.setState({
                    workspacesList: responseJson.items
                })
            }
            )
        ).catch((error) => {
            console.error(error);
        });
    }

    /*****************************************************************************
     * Upon click, navigate into a Workspace's content, meaning navigate into its
     * folders and files list (folder.js)
     *****************************************************************************/
    onPressWorkspace(ws) {
        this.props.navigation.navigate('Folder', {
            accessToken: this.accessToken,
            workspaceGuid: ws.uuid,
            folderGuid: ws.rootFolderUuid,
            serverAddress: this.serverAddress,
            title: ws.name
        });
    }

    /*****************************************************************************
     * Show the content of the response is a list.
     *****************************************************************************/
    render() {
        if (this.state.workspacesList && this.state.workspacesList.length > 0) {
            return (
                <ScrollView>
                    <List>
                        {
                            this.state.workspacesList.map((item) => (
                                <ListItem
                                    key={item.uuid}
                                    title={item.name}
                                    /************************************************
                                    * Exercise: add subtitle with last modified date
                                    ************************************************/
                                    leftIcon={{type: 'font-awesome', name: 'folder'}}
                                    onPress={() => this.onPressWorkspace(item)}
                                    hideChevron
                                />
                            ))
                        }
                    </List>
                </ScrollView>
            );
        }
        return <View style={styles.center}>
            <ActivityIndicator size="large" color="3498db"/>
        </View>
    }
}


/*****************************************************************************
 * Styles
 *****************************************************************************/
const styles = StyleSheet.create({
    center: {
        flex: 1,
        flexDirection:'column',
        justifyContent: 'center',
        alignItems:'center'
    }
});
