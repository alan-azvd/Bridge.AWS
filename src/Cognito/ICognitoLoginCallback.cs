using System;

namespace Bridge.AWS.Cognito
{
    public interface ICognitoLoginCallback
    {
        void execute();
    }
}
