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

import {WebView} from "react-native";
import React, {Component} from "react";

type Props = {};

/********************************************************************************************************************
 * The following example shows a typical online viewer integration with a web application.
 * HTML code is taken directly from:
 * http://help.blackberry.com/en/blackberry-workspaces-online-viewer/current/integration-guide/dkg1516107175392.html
 *******************************************************************************************************************/
export class Viewer extends Component<Props> {

    static navigationOptions = ({navigation}) => ({
        title: `${navigation.state.params.title}`,
    });

    constructor(props) {
        super(props);
        this.accessToken = props.navigation.getParam('accessToken');
        this.documentGuid = props.navigation.getParam('documentGuid');
        this.accessToken = props.navigation.getParam('accessToken');
        this.serverAddress = props.navigation.getParam('serverAddress');
    }



    render() {
        const htmlString = this.getHtml()
            .replace('[serverAddress]',this.serverAddress)
            .replace('[accessToken]', this.accessToken)
            .replace('[documentGuid]', this.documentGuid);
        console.log('html', htmlString);
        return <WebView
            originWhitelist={['*']}
            source={{html: htmlString}}
            onError={(err)=> console.log('error', err)}
        />
    }

    getHtml() {
        return '<!DOCTYPE html>\n' +
            '<html>\n' +
            '<head>\n' +
            '</head>\n' +
            '<style>\n' +
            '    iframe { width: 100%; height: 100%; position: absolute; top: 50px; left: 0; }\n' +
            '</style>\n' +
            '<body>\n' +
            '<script>\n' +
            '    const viewerElem = document.createElement(\'iframe\');\n' +
            '    viewerElem.src = "https://[serverAddress]/mobile/v";\n' +
            '    const accessToken = "[accessToken]";\n' +
            '    const documentGuid = "[documentGuid]";\n' +
            '    document.body.appendChild(viewerElem);\n' +
            '    window.addEventListener(\'message\', (event) => {\n' +
            '        if (!event.data || !event.data.id) {\n' +
            '            return;\n' +
            '        }\n' +
            '        switch (event.data.id) {\n' +
            '            case \'VIEWER:READY\':\n' +
            '                viewerElem.contentWindow.postMessage({ id: \'PARENT:INIT\', context: { accessToken, documentGuid } }, \'*\');\n' +
            '                break;\n' +
            '            case \'VIEWER:INVALID_ACCESS_TOKEN\':\n' +
            '                viewerElem.contentWindow.postMessage({ id: \'PARENT:SET_ACCESS_TOKEN\', context: { accessToken: \'new_access_token\' } }, \'*\');\n' +
            '                break;\n' +
            '            case \'VIEWER:DOCUMENT_NOT_FOUND\':\n' +
            '                break;\n' +
            '            case \'VIEWER:NO_PERMISSION_FOR_RECIPIENT\':\n' +
            '                break;\n' +
            '            case \'VIEWER:PERMISSION_EXPIRED\':\n' +
            '                break;\n' +
            '            case \'VIEWER:PRINT_PERMISSION_REQUEST\':\n' +
            '                break;\n' +
            '            case \'VIEWER:UNEXPECTED_ERROR\':\n' +
            '                break;\n' +
            '        }\n' +
            '    });\n' +
            '\n' +
            '</script>\n' +
            '</body>\n' +
            '\n' +
            '</html>'

    }
}

