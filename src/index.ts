import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

// @ts-ignore
export async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult>
{
    console.log(event);
}
