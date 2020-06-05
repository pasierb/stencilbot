import { DynamoDB } from 'aws-sdk';

export abstract class Base {
  abstract async save(db: DynamoDB)

  abstract toJSON(): object

  abstract toDynamoDBItem(): DynamoDB.AttributeMap
}
