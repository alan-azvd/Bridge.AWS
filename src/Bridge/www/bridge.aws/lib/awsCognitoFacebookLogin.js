var awsCognitoFacebookLogin = function (CognitoLoginCallBack) {
    
    FB.getLoginStatus(function (response) {
        if (response.status === 'connected') {
            console.log('Logged in.');
            
            // Add the Facebook access token to the Cognito credentials login map.
            AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                IdentityPoolId: 'us-east-1:dd929e7c-7137-4cb7-99d7-df0eb1fd57d6',
                Logins: {
                    'graph.facebook.com': response.authResponse.accessToken
                }
            });
            CognitoLoginCallBack.execute();
        }
        else {
            FB.login(function (response) {
                if (response.authResponse) { // logged in

                    console.log('You are now logged in.');

                    // Add the Facebook access token to the Cognito credentials login map.
                    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                        IdentityPoolId: 'us-east-1:dd929e7c-7137-4cb7-99d7-df0eb1fd57d6',
                        Logins: {
                            'graph.facebook.com': response.authResponse.accessToken
                        }
                    });
                    CognitoLoginCallBack.execute();
                } else {
                    console.log('There was a problem logging you in.');
                }
            });
        }
    });
};