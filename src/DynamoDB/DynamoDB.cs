using System;
using Bridge;
using System.Collections.Generic;

namespace Bridge.AWS.DynamoDB
{
    public class DynamoDB
    {
        public void scan(ScanParams param, Action<DynamoError, ScanData> callback)
        {
            AWS.config.credentials.get(() =>
            {
                var dynamodb = new AWS.DynamoDB();
                dynamodb.scan(param, callback);
            });
        }

        public void getItem(GetParams param, Action<DynamoError, GetData> callback)
        {
            AWS.config.credentials.get(() =>
            {
                var dynamodb = new AWS.DynamoDB();
                dynamodb.getItem(param, callback);
            });
        }

        public void putItem(ItemParams param, Action<DynamoError, Object> callback)
        {
            AWS.config.credentials.get(() =>
            {
                var dynamodb = new AWS.DynamoDB();
                dynamodb.putItem(param, callback);
            });
        }

        public void deleteItem(DeleteParams param, Action<DynamoError, Object> callback)
        {
            AWS.config.credentials.get(() =>
            {
                var dynamodb = new AWS.DynamoDB();
                dynamodb.deleteItem(param, callback);
            });
        }
    }

    [External]
    public class DynamoError
    {
        public Object stack;
    }

    [External]
    [ObjectLiteral]
    public class ScanParams
    {
        [Name("TableName")]
        [FieldProperty]
        public String TableName { get; set; }

        [Name("ProjectionExpression")]
        [FieldProperty]
        public String ProjectionExpression { get; set; }
    }

    [External]
    public class ScanData
    {
        [Template("Items")]
        public IEnumerable<dynamic> Items;
    }

    [External]
    [ObjectLiteral]
    public class GetParams
    {
        [Name("TableName")]
        [FieldProperty]
        public String TableName { get; set; }

        [Name("Key")]
        [FieldProperty]
        public dynamic Key { get; set; }
    }

    [External]
    public class GetData
    {
        [Template("Item")]
        public dynamic Item;
    }

    [External]
    [ObjectLiteral]
    public class UpdateParams
    {
        [Name("TableName")]
        [FieldProperty]
        public String TableName { get; set; }

        [Name("Key")]
        [FieldProperty]
        public String Key { get; set; }

        [Name("ProjectionExpression")]
        [FieldProperty]
        public String UpdateExpression { get; set; }

        [Name("ExpressionAttributeValues")]
        [FieldProperty]
        public String ExpressionAttributeValues { get; set; }

        [Name("ReturnValues")]
        [FieldProperty]
        public String ReturnValues { get; set; }
    }

    [External]
    [ObjectLiteral]
    public class ItemParams
    {
        [Name("TableName")]
        [FieldProperty]
        public String TableName { get; set; }

        [Name("Item")]
        [FieldProperty]
        public dynamic Item { get; set; }

        [Name("ConditionExpression")]
        [FieldProperty]
        public String ConditionExpression { get; set; }

        [Name("ReturnConsumedCapacity")]
        [FieldProperty]
        public String ReturnConsumedCapacity { get; set; } //'INDEXES | TOTAL | NONE'

        [Name("ReturnItemCollectionMetrics")]
        [FieldProperty]
        public String ReturnItemCollectionMetrics { get; set; } //'SIZE | NONE'

        [Name("ReturnValues")]
        [FieldProperty]
        public String ReturnValues { get; set; }
    }

    [ObjectLiteral]
    public class DynamoItem
    {
        [FieldProperty]
        public String S { get; set; }

        [FieldProperty]
        public String N { get; set; }
    }

    [External]
    [ObjectLiteral]
    public class DeleteParams
    {
        [Name("TableName")]
        [FieldProperty]
        public String TableName { get; set; }

        [Name("Key")]
        [FieldProperty]
        public dynamic Key { get; set; }
    }
}
