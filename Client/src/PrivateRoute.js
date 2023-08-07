import Keycloak from 'keycloak-js';
import React, {Component, useEffect, useState} from 'react';
import DashboardPage from "./pages/DashboardPage";
import {Navigate} from 'react-router-dom';
export default function PrivateRoute() {

    // const [keycloak, setKeycloak] = React.useState("");
    // const [authenticated, setAuthenticated] = React.useState(false);
    // const [isLoading, setIsLoading] = useState(true);
    // console.log("help me");



    // try {
    //     const authenticated = keycloak.init({ onLoad: 'login-required', checkLoginIframe: false});
    //     console.log(`User is ${authenticated ? 'authenticated' : 'not authenticated'}`);
    // } catch (error) {
    //     console.error('Failed to initialize adapter:', error);
    // }
    const [keycloak, setKeycloak] = React.useState("");
    const [authenticated, setAuthenticated] = React.useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {

        const key = new Keycloak({
            "realm": "tact",
            "url": "http://localhost:8180/",
            "clientId": "tact_client",

        });
        const initKeycloak = async() => {
            key
                .init({
                    onLoad: 'login-required',
                    checkLoginIframe: false,
                })
                .then(function (authenticated) {
                    setKeycloak(key); // <-- uncommenting this line does a redirect loop
                    setAuthenticated(key.authenticated);
                    alert(authenticated ? 'authenticated' : 'not authenticated');
                    setIsLoading(false);
                    return <Navigate to={{pathname: '/dashboard'}}/>;

                })
                .catch(function (e) {
                    console.log('Failed to initialize keycloak', e);
                    setIsLoading(false);
                });
            setIsLoading(false);

            // return <Navigate to={{pathname: '/dashboard'}}/>;


        }

        if (isLoading){
            initKeycloak();
        }
    }, [isLoading]);

    // if (!isLoading){
    //     console.log("Auth " + authenticated);
    //     if(authenticated) {
    //         console.log("keycloak");
    //         return <Navigate to={{pathname: '/'}}/>;
    //     } else {
    //         return (<div>Unable to authenticate!</div>)
    //     }
    // }
};
