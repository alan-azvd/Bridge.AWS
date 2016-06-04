using System;
using Bridge;
using Bridge.AWS.DynamoDB;

namespace Bridge.AWS
{
    [External]
    [Namespace(false)]
    public static class AWS
    {
        public static Config config;

        public class DynamoDB
        {
            public void scan(ScanParams param, Action<DynamoError, ScanData> callback)
            {
                return;
            }

            public void getItem(GetParams param, Action<DynamoError, GetData> callback)
            {
                return;
            }

            public void putItem(ItemParams param, Action<DynamoError, Object> callback)
            {
                return;
            }

            public void deleteItem(DeleteParams param, Action<DynamoError, Object> callback)
            {
                return;
            }
        }
    }

    [External]
    public class Config
    {
        [Template("credentials")]
        public Credential credentials;

        public String region;
    }

    [External]
    public class Credential
    {
        public virtual void get(Action callback)
        {
            return;
        }
    }
}
