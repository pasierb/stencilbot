import { Stack } from '@aws-cdk/core';
import { Table, AttributeType } from '@aws-cdk/aws-dynamodb';
import { Bucket } from '@aws-cdk/aws-s3';

export class CardStampApiStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const projectTable = new Table(this, 'project-table', {
      tableName: 'CardStampProjects',
      partitionKey: {
        name: 'id',
        type: AttributeType.STRING
      }
    });
  }
}
