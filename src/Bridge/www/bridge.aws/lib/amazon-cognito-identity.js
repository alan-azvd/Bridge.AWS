/**
 * Copyright 2016 Amazon.com,
 * Inc. or its affiliates. All Rights Reserved.
 * 
 * Licensed under the Amazon Software License (the "License").
 * You may not use this file except in compliance with the
 * License. A copy of the License is located at
 * 
 *     http://aws.amazon.com/asl/
 * 
 * or in the "license" file accompanying this file. This file is
 * distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, express or implied. See the License
 * for the specific language governing permissions and
 * limitations under the License. 
 */


AWSCognito.CognitoIdentityServiceProvider.CognitoUser=function(){var a=function b(a){if(!(this instanceof b))throw new Error("CognitoUser constructor was not called with new.");if(null==a||null==a.Username||null==a.Pool)throw new Error("Username and pool information are required.");this.username=a.Username||"",this.pool=a.Pool,this.AuthState=null,this.client=new AWSCognito.CognitoIdentityServiceProvider({apiVersion:"2016-04-19"}),this.signInUserSession=null};return a.prototype.getSignInUserSession=function(){return this.signInUserSession},a.prototype.getUsername=function(){return this.username},a.prototype.authenticateUser=function(a,b){var c,d,e=new AWSCognito.CognitoIdentityServiceProvider.AuthenticationHelper(this.pool.getUserPoolId().split("_")[1],this.pool.getParanoia()),f=this;this.client.getAuthenticationDetails({ClientId:this.pool.getClientId(),Username:this.username,SrpA:e.getLargeAValue().toString(16),ValidationData:a.getValidationData()},function(g,h){if(g)return b.onFailure(g);f.username=h.Username,c=new BigInteger(h.SrpB,16),d=new BigInteger(h.Salt,16);var i=e.getPasswordAuthenticationKey(f.username,a.getPassword(),c,d),j=sjcl.codec.bytes.toBits(h.SecretBlock),k=new sjcl.misc.hmac(i,sjcl.hash.sha256);k.update(sjcl.codec.utf8String.toBits(f.pool.getUserPoolId().split("_")[1])),k.update(sjcl.codec.utf8String.toBits(f.username)),k.update(j);var l=moment().utc(),m=l.format("ddd MMM D HH:mm:ss UTC YYYY");k.update(sjcl.codec.utf8String.toBits(m));for(var n=k.digest(),o=sjcl.codec.bytes.fromBits(n),p=new ArrayBuffer(32),q=new Uint8Array(p),r=0;r<o.length;r++)q[r]=o[r];var s={SecretBlock:h.SecretBlock,Signature:q};f.client.authenticate({ClientId:f.pool.getClientId(),Username:f.username,PasswordClaim:s,Timestamp:l.toDate()},function(a,c){if(a)return b.onFailure(a);var d=c.CodeDeliveryDetails;return null==d?(f.signInUserSession=f.getCognitoUserSession(c.AuthenticationResult),f.cacheTokens(),b.onSuccess(f.signInUserSession)):(f.AuthState=c.AuthState,b.mfaRequired(d))})})},a.prototype.confirmRegistration=function(a,b,c){this.client.confirmSignUp({ClientId:this.pool.getClientId(),ConfirmationCode:a,Username:this.username,ForceAliasCreation:b},function(a,b){return a?c(a,null):c(null,"SUCCESS")})},a.prototype.sendMFACode=function(a,b){self=this,this.client.enhanceAuth({Username:this.username,Code:a,AuthState:this.AuthState,ClientId:this.pool.getClientId()},function(a,c){return a?b.onFailure(a):(self.signInUserSession=self.getCognitoUserSession(c.AuthenticationResult),self.cacheTokens(),b.onSuccess(self.signInUserSession))})},a.prototype.changePassword=function(a,b,c){return null!=this.signInUserSession&&this.signInUserSession.isValid()?void this.client.changePassword({PreviousPassword:a,ProposedPassword:b,AccessToken:this.signInUserSession.getAccessToken().getJwtToken()},function(a,b){return a?c(a,null):c(null,"SUCCESS")}):c(new Error("User is not authenticated"),null)},a.prototype.enableMFA=function(a){if(null==this.signInUserSession||!this.signInUserSession.isValid())return a(new Error("User is not authenticated"),null);var b=[],c={DeliveryMedium:"SMS",AttributeName:"phone_number"};b.push(c),this.client.setUserSettings({MFAOptions:b,AccessToken:this.signInUserSession.getAccessToken().getJwtToken()},function(b,c){return b?a(b,null):a(null,"SUCCESS")})},a.prototype.disableMFA=function(a){if(null==this.signInUserSession||!this.signInUserSession.isValid())return a(new Error("User is not authenticated"),null);var b=[];this.client.setUserSettings({MFAOptions:b,AccessToken:this.signInUserSession.getAccessToken().getJwtToken()},function(b,c){return b?a(b,null):a(null,"SUCCESS")})},a.prototype.deleteUser=function(a){return null!=this.signInUserSession&&this.signInUserSession.isValid()?void this.client.deleteUser({AccessToken:this.signInUserSession.getAccessToken().getJwtToken()},function(b,c){return b?a(b,null):a(null,"SUCCESS")}):a(new Error("User is not authenticated"),null)},a.prototype.updateAttributes=function(a,b){return null!=this.signInUserSession&&this.signInUserSession.isValid()?void this.client.updateUserAttributes({AccessToken:this.signInUserSession.getAccessToken().getJwtToken(),UserAttributes:a},function(a,c){return a?b(a,null):b(null,"SUCCESS")}):b(new Error("User is not authenticated"),null)},a.prototype.getUserAttributes=function(a){return null!=this.signInUserSession&&this.signInUserSession.isValid()?void this.client.getUser({AccessToken:this.signInUserSession.getAccessToken().getJwtToken()},function(b,c){if(b)return a(b,null);var d=[];for(i=0;i<c.UserAttributes.length;i++){var e={Name:c.UserAttributes[i].Name,Value:c.UserAttributes[i].Value},f=new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(e);d.push(f)}return a(null,d)}):a(new Error("User is not authenticated"),null)},a.prototype.deleteAttributes=function(a,b){return null!=this.signInUserSession&&this.signInUserSession.isValid()?void this.client.deleteUserAttributes({UserAttributeNames:a,AccessToken:this.signInUserSession.getAccessToken().getJwtToken()},function(a,c){return a?b(a,null):b(null,"SUCCESS")}):b(new Error("User is not authenticated"),null)},a.prototype.resendConfirmationCode=function(a){this.client.resendConfirmationCode({ClientId:this.pool.getClientId(),Username:this.username},function(b,c){return b?a(b,null):a(null,"SUCCESS")})},a.prototype.getSession=function(a){if(null==this.username)return a(new Error("Username is null. Cannot retrieve a new session"),null);if(null!=this.signInUserSession&&this.signInUserSession.isValid())return a(null,this.signInUserSession);var b="CognitoIdentityServiceProvider."+this.pool.getClientId()+"."+this.username+".idToken",c="CognitoIdentityServiceProvider."+this.pool.getClientId()+"."+this.username+".accessToken",d="CognitoIdentityServiceProvider."+this.pool.getClientId()+"."+this.username+".refreshToken",e=window.localStorage;if(e.getItem(b)){var f=new AWSCognito.CognitoIdentityServiceProvider.CognitoIdToken({IdToken:e.getItem(b)}),g=new AWSCognito.CognitoIdentityServiceProvider.CognitoAccessToken({AccessToken:e.getItem(c)}),h=new AWSCognito.CognitoIdentityServiceProvider.CognitoRefreshToken({RefreshToken:e.getItem(d)}),i={IdToken:f,AccessToken:g,RefreshToken:h},j=new AWSCognito.CognitoIdentityServiceProvider.CognitoUserSession(i);if(j.isValid())return this.signInUserSession=j,a(null,this.signInUserSession);if(null==h.getToken())return a(new Error("Cannot retrieve a new session. Please authenticate."),null);this.refreshSession(h,a)}},a.prototype.refreshSession=function(a,b){self=this,this.client.refreshTokens({ClientId:this.pool.getClientId(),RefreshToken:a.getToken()},function(a,c){return a?b(a,null):c?(self.signInUserSession=self.getCognitoUserSession(c.AuthenticationResult),b(null,self.signInUserSession)):void 0})},a.prototype.cacheTokens=function(){var a="CognitoIdentityServiceProvider."+this.pool.getClientId()+"."+this.username+".idToken",b="CognitoIdentityServiceProvider."+this.pool.getClientId()+"."+this.username+".accessToken",c="CognitoIdentityServiceProvider."+this.pool.getClientId()+"."+this.username+".refreshToken",d="CognitoIdentityServiceProvider."+this.pool.getClientId()+".LastAuthUser",e=window.localStorage;e.setItem(a,this.signInUserSession.getIdToken().getJwtToken()),e.setItem(b,this.signInUserSession.getAccessToken().getJwtToken()),e.setItem(c,this.signInUserSession.getRefreshToken().getToken()),e.setItem(d,this.username)},a.prototype.clearCachedTokens=function(){var a="CognitoIdentityServiceProvider."+this.pool.getClientId()+"."+this.username+".idToken",b="CognitoIdentityServiceProvider."+this.pool.getClientId()+"."+this.username+".accessToken",c="CognitoIdentityServiceProvider."+this.pool.getClientId()+"."+this.username+".refreshToken",d="CognitoIdentityServiceProvider."+this.pool.getClientId()+".LastAuthUser",e=window.localStorage;e.removeItem(a),e.removeItem(b),e.removeItem(c),e.removeItem(d)},a.prototype.getCognitoUserSession=function(a){var b=new AWSCognito.CognitoIdentityServiceProvider.CognitoIdToken(a),c=new AWSCognito.CognitoIdentityServiceProvider.CognitoAccessToken(a),d=new AWSCognito.CognitoIdentityServiceProvider.CognitoRefreshToken(a),e={IdToken:b,AccessToken:c,RefreshToken:d};return new AWSCognito.CognitoIdentityServiceProvider.CognitoUserSession(e)},a.prototype.forgotPassword=function(a){this.client.forgotPassword({ClientId:this.pool.getClientId(),Username:this.username},function(b,c){return b?a.onFailure(b):a.inputVerificationCode(c)})},a.prototype.confirmPassword=function(a,b,c){this.client.confirmForgotPassword({ClientId:this.pool.getClientId(),Username:this.username,ConfirmationCode:a,Password:b},function(a,b){return a?c.onFailure(a):c.onSuccess()})},a.prototype.getAttributeVerificationCode=function(a,b){return null!=this.signInUserSession&&this.signInUserSession.isValid()?void this.client.getUserAttributeVerificationCode({AttributeName:a,AccessToken:this.signInUserSession.getAccessToken().getJwtToken()},function(a,c){return a?b.onFailure(a):b.inputVerificationCode(c)}):b.onFailure(new Error("User is not authenticated"))},a.prototype.verifyAttribute=function(a,b,c){return null!=this.signInUserSession&&this.signInUserSession.isValid()?void this.client.verifyUserAttribute({AttributeName:a,Code:b,AccessToken:this.signInUserSession.getAccessToken().getJwtToken()},function(a,b){return a?c.onFailure(a):c.onSuccess("SUCCESS")}):c.onFailure(new Error("User is not authenticated"))},a.prototype.signOut=function(){this.signInUserSession=null,this.clearCachedTokens()},a}(),AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool=function(){var a=function b(a){if(!(this instanceof b))throw new Error("CognitoUserPool constructor was not called with new.");if(null==a||null==a.UserPoolId||null==a.ClientId)throw new Error("Both user pool Id and client Id are required.");this.userPoolId=a.UserPoolId,this.clientId=a.ClientId,this.paranoia=a.Paranoia||0,this.client=new AWSCognito.CognitoIdentityServiceProvider({apiVersion:"2016-04-19"})};return a.prototype.getUserPoolId=function(){return this.userPoolId},a.prototype.getClientId=function(){return this.clientId},a.prototype.getParanoia=function(){return this.paranoia},a.prototype.setParanoia=function(a){this.paranoia=a},a.prototype.signUp=function(a,b,c,d,e){self=this,this.client.signUp({ClientId:self.clientId,Username:a,Password:b,UserAttributes:c,ValidationData:d},function(b,c){if(b)return e(b,null);var d={Username:a,Pool:self},f={user:new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(d),userConfirmed:c.UserConfirmed};return e(null,f)})},a.prototype.getCurrentUser=function(){var a="CognitoIdentityServiceProvider."+this.clientId+".LastAuthUser",b=window.localStorage,c=b.getItem(a);if(c){var d={Username:c,Pool:this};return new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(d)}return null},a}(),AWSCognito.CognitoIdentityServiceProvider.CognitoRefreshToken=function(){var a=function b(a){if(!(this instanceof b))throw new Error("CognitoRefreshToken constructor was not called with new.");a=a||{},this.token=a.RefreshToken||""};return a.prototype.getToken=function(){return this.token},a}(),AWSCognito.CognitoIdentityServiceProvider.CognitoIdToken=function(){var a=function b(a){if(!(this instanceof b))throw new Error("CognitoIdToken constructor was not called with new.");a=a||{},this.jwtToken=a.IdToken||""};return a.prototype.getJwtToken=function(){return this.jwtToken},a.prototype.getExpiration=function(){var a=this.jwtToken.split(".")[1],b=JSON.parse(sjcl.codec.utf8String.fromBits(sjcl.codec.base64.toBits(a)));return moment.unix(b.exp)},a}(),AWSCognito.CognitoIdentityServiceProvider.CognitoAccessToken=function(){var a=function b(a){if(!(this instanceof b))throw new Error("CognitoAccessToken constructor was not called with new.");a=a||{},this.jwtToken=a.AccessToken||""};return a.prototype.getJwtToken=function(){return this.jwtToken},a.prototype.getExpiration=function(){var a=this.jwtToken.split(".")[1],b=JSON.parse(sjcl.codec.utf8String.fromBits(sjcl.codec.base64.toBits(a)));return moment.unix(b.exp)},a}(),AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails=function(){var a=function b(a){if(!(this instanceof b))throw new Error("AuthenticationDetails constructor was not called with new.");a=a||{},this.validationData=a.ValidationData||[],this.username=a.Username,this.password=a.Password};return a.prototype.getUsername=function(){return this.username},a.prototype.getPassword=function(){return this.password},a.prototype.getValidationData=function(){return this.validationData},a}(),AWSCognito.CognitoIdentityServiceProvider.CognitoUserSession=function(){var a=function b(a){if(!(this instanceof b))throw new Error("CognitoUserSession constructor was not called with new.");if(a=a||{},null==a.AccessToken||null==a.IdToken)throw new Error("Id token and Access Token must be present.");this.idToken=a.IdToken,this.refreshToken=a.RefreshToken,this.accessToken=a.AccessToken};return a.prototype.getIdToken=function(){return this.idToken},a.prototype.getRefreshToken=function(){return this.refreshToken},a.prototype.getAccessToken=function(){return this.accessToken},a.prototype.isValid=function(){var a=moment().utc();return a.isBefore(this.accessToken.getExpiration())&&a.isBefore(this.idToken.getExpiration())},a}(),AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute=function(){var a=function b(a){if(!(this instanceof b))throw new Error("CognitoUserAttribute constructor was not called with new.");a=a||{},this.Name=a.Name||"",this.Value=a.Value||""};return a.prototype.getValue=function(){return this.Value},a.prototype.setValue=function(a){return this.Value=a,this},a.prototype.getName=function(){return this.Name},a.prototype.setName=function(a){return this.Name=a,this},a.prototype.toString=function(){return JSON.stringify(this)},a.prototype.toJSON=function(){return{Name:this.Name,Value:this.Value}},a}(),AWSCognito.CognitoIdentityServiceProvider.AuthenticationHelper=function(){var a=function b(a,c){if(!(this instanceof b))throw new Error("AuthenticationHelper constructor was not called with new.");this.N=new BigInteger("FFFFFFFFFFFFFFFFC90FDAA22168C234C4C6628B80DC1CD129024E088A67CC74020BBEA63B139B22514A08798E3404DDEF9519B3CD3A431B302B0A6DF25F14374FE1356D6D51C245E485B576625E7EC6F44C42E9A637ED6B0BFF5CB6F406B7EDEE386BFB5A899FA5AE9F24117C4B1FE649286651ECE45B3DC2007CB8A163BF0598DA48361C55D39A69163FA8FD24CF5F83655D23DCA3AD961C62F356208552BB9ED529077096966D670C354E4ABC9804F1746C08CA18217C32905E462E36CE3BE39E772C180E86039B2783A2EC07A28FB5C55DF06F4C52C9DE2BCBF6955817183995497CEA956AE515D2261898FA051015728E5A8AAAC42DAD33170D04507A33A85521ABDF1CBA64ECFB850458DBEF0A8AEA71575D060C7DB3970F85A6E1E4C7ABF5AE8CDB0933D71E8C94E04A25619DCEE3D2261AD2EE6BF12FFA06D98A0864D87602733EC86A64521F2B18177B200CBBE117577A615D6C770988C0BAD946E208E24FA074E5AB3143DB5BFCE0FD108E4B82D120A93AD2CAFFFFFFFFFFFFFFFF",16),this.g=new BigInteger("2"),this.k=new BigInteger(this.hexHash("00"+this.N.toString(16)+"0"+this.g.toString(16)),16),this.paranoia=c,this.smallAValue=this.generateRandomSmallA(),this.largeAValue=this.calculateA(this.smallAValue),this.infoBits=sjcl.codec.utf8String.toBits("Caldera Derived Key"),this.poolName=a};return a.prototype.getSmallAValue=function(){return this.smallAValue},a.prototype.getLargeAValue=function(){return this.largeAValue},a.prototype.generateRandomSmallA=function(){var a=sjcl.random.randomWords(32,this.paranoia),b=sjcl.codec.hex.fromBits(a),c=new BigInteger(b,16),d=c.mod(this.N);return d},a.prototype.calculateA=function(a){var b=this.g.modPow(a,this.N);if("0"==b.mod(this.N).toString())throw new Error("Illegal paramater. A mod N cannot be 0.");return b},a.prototype.calculateU=function(a,b){var c=a.toString(16)[0],d=b.toString(16)[0],e=a.toString(16),f=b.toString(16);return a.toString(16).length%2==1?e="0"+e:-1!="89ABCDEFabcdef".indexOf(c)&&(e="00"+e),b.toString(16).length%2==1?f="0"+f:-1!="89ABCDEFabcdef".indexOf(d)&&(f="00"+f),this.UHexHash=this.hexHash(e+f),finalU=new BigInteger(this.UHexHash,16),finalU},a.prototype.hash=function(a){var b=sjcl.codec.hex.fromBits(sjcl.hash.sha256.hash(a));return new Array(64-b.length).join("0")+b},a.prototype.hexHash=function(a){var b=sjcl.codec.hex.fromBits(sjcl.hash.sha256.hash(sjcl.codec.hex.toBits(a)));return new Array(64-b.length).join("0")+b},a.prototype.computehkdf=function(a,b){var c=new sjcl.misc.hmac(b,sjcl.hash.sha256);c.update(a);var d=c.digest(),e=new sjcl.misc.hmac(d,sjcl.hash.sha256),f=sjcl.bitArray.concat(this.infoBits,sjcl.codec.utf8String.toBits(String.fromCharCode(1)));return e.update(f),sjcl.bitArray.clamp(e.digest(),128)},a.prototype.getPasswordAuthenticationKey=function(a,b,c,d){if(c.mod(this.N).equals(new BigInteger("0",16)))throw new Error("B cannot be zero.");if(this.UValue=this.calculateU(this.largeAValue,c),this.UValue.equals(new BigInteger("0",16)))throw new Error("U cannot be zero.");var e=this.poolName+a+":"+b,f=this.hash(e),g=d.toString(16)[0],h=d.toString(16);d.toString(16).length%2==1?h="0"+h:-1!="89ABCDEFabcdef".indexOf(g)&&(h="00"+h);var i=new BigInteger(this.hexHash(h+f),16),j=this.g.modPow(i,this.N),k=c.subtract(this.k.multiply(j)),l=k.modPow(this.smallAValue.add(this.UValue.multiply(i)),this.N).mod(this.N),m=l.toString(16),n=l.toString(16)[0];l.toString(16).length%2==1?m="0"+m:-1!="89ABCDEFabcdef".indexOf(n)&&(m="00"+m);var o=this.UHexHash,p=this.UHexHash[0];this.UHexHash.length%2==1?o="0"+o:this.UHexHash.length%2==0&&-1!="89ABCDEFabcdef".indexOf(p)&&(o="00"+o);var q=this.computehkdf(sjcl.codec.hex.toBits(m),sjcl.codec.hex.toBits(o));return q},a}();
//# sourceMappingURL=amazon-cognito-identity.min.js.map