import { DynamoDB } from 'aws-sdk';
import { Layer as RendererLayer, LayerInit } from '@stencilbot/renderer';
import { Base } from './base';

interface LayerJSONModel extends LayerInit {
  projectId: string
}

export const TABLE_NAME = 'StencilbotProjectLayers';

export type LayerDynamoDBModel = {
  id: {
    S: DynamoDB.StringAttributeValue
  }
  projectId: {
    S: DynamoDB.StringAttributeValue
  }
  order: {
    N: DynamoDB.NumberAttributeValue
  }
  width: {
    N: DynamoDB.NumberAttributeValue
  }
  height: {
    N: DynamoDB.NumberAttributeValue
  }
  x: {
    N: DynamoDB.NumberAttributeValue
  }
  y: {
    N: DynamoDB.NumberAttributeValue
  }
  text: {
    S: DynamoDB.StringAttributeValue
  }
  fontUri: {
    S: DynamoDB.StringAttributeValue
  }
  fontFamily: {
    S: DynamoDB.StringAttributeValue
  }
  lineHeight: {
    N: DynamoDB.NumberAttributeValue
  }
  color: {
    S: DynamoDB.StringAttributeValue
  }
  fontSize: {
    N: DynamoDB.NumberAttributeValue
  }
  imageUri: {
    S: DynamoDB.StringAttributeValue
  }
  imageFit: {
    S: DynamoDB.StringAttributeValue
  }
}

export class Layer extends RendererLayer implements Base {
  projectId: string

  constructor(init: LayerJSONModel) {
    super(init);

    this.projectId = init.projectId;
  }

  save(db: DynamoDB) {
    return db.putItem({
      TableName: TABLE_NAME,
      Item: this.toDynamoDBItem()
    }).promise();
  }

  static async forProject(db: DynamoDB, projectId: string): Promise<Layer[]> {
    const result = await db.query({
      TableName: TABLE_NAME,
      ExpressionAttributeValues: {
        ":projectId": {
          S: projectId
        }
      },
      KeyConditionExpression: "projectId = :projectId"
    }).promise();

    if (result.Items) {
      return result.Items.map(item => Layer.fromDynamoDBItem(item as LayerDynamoDBModel));
    }

    return [];
  }

  toDynamoDBItem() {
    return {
      projectId: {
        S: this.projectId
      },
      id: {
        S: this.id
      },
      order: {
        N: `${this.order}`
      },
      x: {
        N: `${this.x}`
      },
      y: {
        N: `${this.y}`
      },
      text: {
        S: this.text
      },
      color: {
        S: this.color
      },
      fontFamily: {
        S: this.fontFamily
      },
      fontSize: {
        N: `${this.fontSize}`
      },
      lineHeight: {
        N: `${this.lineHeight}`
      },
      imageUri: {
        S: this.imageUri
      },
      imageFit: {
        S: this.imageFit
      },
      width: {
        N: `${this.width}`
      },
      height: {
        N: `${this.height}`
      },
      fontUri: {
        S: this.fontUri
      }
    }
  }

  toJSON() {
    return { ...this.attributes, projectId: this.projectId };
  }

  static fromDynamoDBItem(item: LayerDynamoDBModel): Layer {
    return new Layer({
      projectId: item.projectId.S,
      id: item.id.S,
      x: +item.x.N,
      y: +item.y.N,
      text: item.text.S,
      color: item.color.S,
      fontFamily: item.fontFamily.S,
      fontSize: +item.fontSize.N,
      lineHeight: +item.lineHeight.N,
      imageUri: item.imageUri.S,
      imageFit: item.imageFit.S,
      width: +item.width.N,
      height: +item.height.N,
      fontUri: item.fontUri.S
    });
  }
}