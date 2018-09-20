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
 * First Login window.
 * This form opens an in-app web browser that performs authentication.
 *****************************************************************************/

import {ActivityIndicator, StyleSheet, WebView, View, Text, Keyboard} from "react-native";
import {encode as btoa} from "base-64";
import React, {Component} from "react";

type Props = {};
export class Login extends Component<Props> {
    static navigationOptions = {
        title: 'Log in',
    };

    constructor(props) {
        super(props);
        this.serverAddress='devsummit.watchdox.com';
        this.accessToken='';
        this.state = {
            loginUrl: ''
        };
    }

    /**********************************************************************************
     * Upon mount we start the authentication flow.
     * Using: https://[server]/api/3.0/authentication/parameters and authorizationUri:
     * ?response_type=code&client_id=com.watchdox.webapp
     + &redirect_uri=https://[server]/ngdox/auth/endpoint/oauth/' + Base64('{"location":"/","email":null,"clientId":"com.watchdox.webapp"}')
     *********************************************************************************/
    componentDidMount() {
        fetch('https://' + this.serverAddress + '/api/3.0/authentication/parameters').then((response) => response.json())
            .then((responseJson) => {
                console.log('response', responseJson);
                let url = this.getLoginUrl(responseJson.authorizationUri);

                this.setState({
                        loginUrl: url
                    }
                );
            })
            .catch((error) => {
                console.error(error);
            });
    }

    /**********************************************************************************
     * The following method builds the authrizationUri
     * The authorization URI includes a base64 encoded object that is then used by
     * a backend service "Inga", to complete the access token request as part of oAuth 2.0 implicit mode
     *********************************************************************************/
    getLoginUrl(authorizationUri) {
        let url = authorizationUri
            + '?response_type=code'
            + '&client_id=com.watchdox.webapp'
            + '&redirect_uri=https://' + this.serverAddress + '/ngdox/auth/endpoint/oauth/'
            + this.base64Encode({ "location":"/","email":null,"clientId":"com.watchdox.webapp" });

        return encodeURI(url);
    }

    /**********************************************************************************
     * Standard javascript base64 encode
     *********************************************************************************/
     base64Encode(str) {
        return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
            function toSolidBytes(match, p1) {
                return String.fromCharCode('0x' + p1);
            }));
    }

    /**********************************************************************************
     * Listens for URI changes in the WebView in order to:
     * Inject the referer header in the call to "Inga"
     * and fetch the "access_code" from the url
     *********************************************************************************/
    processLogin(url) {
        let referer;
        if(url.includes("endpoint")) {
            referer = url
        }
        if(url.includes("?code=")) {
            Keyboard.dismiss();
            this.webview.stopLoading();
            let code = url.substring(
                url.lastIndexOf("?code=") + 6,
                url.lastIndexOf("&mail="),

            );

            console.log(code);
            Keyboard.dismiss();
            console.log(referer);
            this.getTokenFromCodeV2(code,referer).then(response => response.json()
                .then((responseJson) => {
                    console.log('inga response accesstoken', responseJson.accessToken);
                    const accessToken = responseJson.accessToken;
                    this.props.navigation.replace('Workspaces', {
                        accessToken: accessToken,
                        serverAddress: this.serverAddress
                    } )
                })
            ).catch((error) => {
                    console.error(error);
                });
        }
    }

    /**********************************************************************************
     * Call the "Inga" service to exchange the code for an access token
     *********************************************************************************/
    getTokenFromCodeV2(code, referer) {
        const ingaUrl = 'https://' + this.serverAddress + '/inga/process-v2';
        const bodyJson = JSON.stringify({
            code: code,
            clientId: 'com.watchdox.webapp',
            email: null,
            remember: false
        });
        console.log('calling inga v2 at ' + ingaUrl + ' with ' + bodyJson);
        return fetch(ingaUrl, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Referer': referer
            },
            body: bodyJson
        })
    }

    /**********************************************************************************
     * Render a WebView to open the authentication page
     *********************************************************************************/
    render() {
        if (this.state.loginUrl==='') {
            return (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#3498db"/>
                    <Text color="#3498db">
                        Getting auth params...
                    </Text>
                </View>
            )
        }

        return (
            <WebView
                source={{uri: this.state.loginUrl}}
                ref={webviewRef => this.webview = webviewRef}
                onNavigationStateChange={message => this.processLogin(message.url)}
                onError={(err)=> console.log('error', err)}
            />
        );
    }
}

/*****************************************************************************
 * Styles
 *****************************************************************************/
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    center: {
        flex: 1,
        paddingTop:20,
        flexDirection:'column',
        justifyContent: 'center',
        alignItems:'center',
    }
});