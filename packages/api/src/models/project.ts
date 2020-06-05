import { DynamoDB } from 'aws-sdk';
import { Base } from './base';
import { Layer } from './layer';

type ProjectDynamoDBModel = {
  id: {
    S: DynamoDB.StringAttributeValue
  }
  userId: {
    S: DynamoDB.StringAttributeValue
  }
  width: {
    N: DynamoDB.NumberAttributeValue
  }
  height: {
    N: DynamoDB.NumberAttributeValue
  }
}

type ProjectJSONModel = {
  id: string
  userId: string
  width: number
  height: number
}

export const TABLE_NAME = 'StencilbotProjects';

export class Project implements Base {
  id: string
  userId: string
  width: number
  height: number

  constructor(init: ProjectJSONModel) {
    this.id = init.id;
    this.userId = init.userId;
    this.width = init.width;
    this.height = init.height;
  }

  save(db: DynamoDB) {
    return db.putItem({
      TableName: TABLE_NAME,
      Item: this.toDynamoDBItem()
    }).promise()
  }

  layers(db: DynamoDB) {
    return Layer.forProject(db, this.id);
  }

  static async find(db: DynamoDB, q: { userId: string, id: string }): Promise<Project | null> {
    const { id, userId } = q;

    const res = await db.getItem({
      TableName: TABLE_NAME,
      Key: {
        id: {
          S: id
        },
        userId: {
          S: userId
        }
      }
    }).promise();

    if (res.Item) {
      return Project.fromDynamoDBItem(res.Item as ProjectDynamoDBModel)
    }

    return null;
  }

  static fromDynamoDBItem(item: ProjectDynamoDBModel): Project {
    return new Project({
      id: item.id.S,
      userId: item.userId.S,
      width: +item.width.N,
      height: +item.height.N
    })
  }

  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      width: this.width,
      height: this.height
    };
  }

  toDynamoDBItem(): ProjectDynamoDBModel {
    return {
      id: {
        S: this.id
      },
      userId: {
        S: this.userId
      },
      width: {
        N: `${this.width}`
      },
      height: {
        N: `${this.height}`
      }
    }
  }
}