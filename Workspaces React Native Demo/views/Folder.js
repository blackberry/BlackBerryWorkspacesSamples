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
 * Folders and files list view. This form presents the content of a workspace.
 *****************************************************************************/

import {StyleSheet, ScrollView, View, ActivityIndicator} from "react-native";
import {ListItem, List, Button} from "react-native-elements";
import React, {Component} from "react";


type Props = {};

export class Folder extends Component<Props> {


    /*****************************************************************************
     * Navigation bar and buttons
     *****************************************************************************/
    static navigationOptions = ({navigation}) => ({
        title: `${navigation.state.params.title}`,
        headerRight: (
            <Button
                onPress={() =>
                    alert('Create folder here')
                }
                icon={{
                    name: 'add',
                    size: 25,
                    color: 'black'
                }}
                buttonStyle={{
                    backgroundColor: "rgba(0,0,0, 0)"
                }}
                /************************************************************************
                * Exercise: Replace the above alert with a new folder creation. Example:
                * URL: https://devsummit.watchdox.com/api/3.0/rooms/folders/create
                * Headers: Accept, Content-Type and Authorization
                * Body JSON example: {"roomGuid":"ffe5d109-d0c8-4b09-bfff-38c5fbf5f3f2","name":"Lalala","parentGuid":"801e6695-a63d-4aa2-b76a-7a1b594e7308","deviceType":"BROWSER"}
                * (Use a unique roomGuid and the real parentGuid)
                *************************************************************************/
            />
        ),
    });

    /*****************************************************************************
     * Constructor
     *****************************************************************************/
    constructor(props) {
        super(props);
        this.state = {
            documentsAndFolders: [],
        };
        this.accessToken = props.navigation.getParam('accessToken');
        this.folderGuid = props.navigation.getParam('folderGuid');
        this.workspaceGuid = props.navigation.getParam('workspaceGuid');
        this.serverAddress = props.navigation.getParam('serverAddress');
        this.onPressItem = this.onPressItem.bind(this);
    }

    /*****************************************************************************
     * Upon load, fetch and parse the content of the selected workspace.
     * This is done using the below API, parameters and headers.
     *****************************************************************************/
    componentDidMount() {
        console.log('from folder', this.accessToken);
        fetch('https://' + this.serverAddress + '/api/3.0/rooms/' + this.workspaceGuid + '/documents/list', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.accessToken
            },
            body: JSON.stringify({
                adminMode: false,
                documentOrder: "DOCUMENT_NAME",
                folderGuid: this.folderGuid,
                orderAscending: true,
                pageNumber:0,
                pageSize:100
            })
        }).then(response => response.json()
            .then(responseJson => {
                    console.log(responseJson);
                    this.setState({
                        documentsAndFolders: responseJson.items
                    })
                }
            )
        ).catch((error) => {
            console.error(error);
        });
    }

    /*****************************************************************************
     * When selecting an item:
     * If the selected item is a folder, push it to the existing form and fetch its
     * content.
     * Otherwise, if the selected item is a file, display it in our Viewer
     *****************************************************************************/
    onPressItem(item) {
        if (item.objType === 'FOLDER') {
            this.props.navigation.push('Folder', {
                accessToken: this.accessToken,
                workspaceGuid: this.workspaceGuid,
                folderGuid: item.uuid,
                serverAddress: this.serverAddress,
                title: item.name
            });
        } else if (item.objType === 'DOCUMENT') {
            this.props.navigation.navigate('Viewer', {
                accessToken: this.accessToken,
                documentGuid: item.guid,
                serverAddress: this.serverAddress,
                title: item.name
            });
        } else {
            throw new Error('Item is something else')
        }
    }


    /*****************************************************************************
     * Show the content of the response is a list.
     *****************************************************************************/
    render() {
        if (this.state.documentsAndFolders && this.state.documentsAndFolders.length > 0) {
            console.log('from render', this.state.documentsAndFolders);
            return (
                <ScrollView>
                    <List>
                        {
                            this.state.documentsAndFolders.map((item) => (
                                <ListItem
                                    key={item.objType === 'FOLDER' ? item.uuid : item.guid}
                                    title={item.name}
                                    leftIcon={item.objType === 'FOLDER' ? {
                                        type: 'font-awesome',
                                        name: 'folder'
                                    } : {type: 'font-awesome', name: 'file-pdf-o'}}
                                    /************************************************************************
                                    * Exercise: add different icons for file types (file-pdf-o, file-word-o)
                                    *************************************************************************/
                                    hideChevron
                                    onPress={() => this.onPressItem(item)}
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
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    }
});
