import * as AWS from 'aws-sdk'
import { Lambda } from 'aws-sdk'
import { IHash, IPushEvent } from '../lib/types'

export class TinyCIAPI {
  private readonly lambdaName: string
  private readonly lambda: Lambda

  public constructor (lambdaName: string) {
    this.lambdaName = lambdaName
    this.lambda = new AWS.Lambda()
  }

  private makeAPIGatewayPayload (method: string, resource: string, body: string | null): IHash {
    return {
      resource: '/{proxy+}',
      path: `/${resource}`,
      httpMethod: method,
      headers: {
        'Content-Type': 'application/json'
      },
      queryStringParameters: null,
      multiValueQueryStringParameters: null,
      pathParameters: {
        proxy: `/${resource}`
      },
      stageVariables: {},
      requestContext: {
        resourcePath: '/{proxy+}',
        httpMethod: method,
        path: `/v1/${resource}`,
        protocol: 'HTTP/1.1',
        stage: 'v1'
      },
      body,
      isBase64Encoded: body !== null
    }
  }

  private async invoke (payload: any): Promise<Error | null> {
    const params = {
      FunctionName: this.lambdaName,
      InvocationType: 'Event',
      LogType: 'None',
      Payload: JSON.stringify(payload)
    }

    try {
      await this.lambda.invoke(params).promise()
    } catch (e) {
      return e
    }

    return null
  }

  public async notifyPushEvent (event: IPushEvent): Promise<void> {
    const body = Buffer.from(JSON.stringify(event)).toString('base64')
    const payload = this.makeAPIGatewayPayload('POST', 'pipeline', body)

    await this.invoke(payload)
  }
}
