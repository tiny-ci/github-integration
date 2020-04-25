import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

import { GithubWebhookSchemaValidator } from './schema';

// @ts-ignore
export async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult>
{
    const body = JSON.parse(event.body!);
    const gwValidation = new GithubWebhookSchemaValidator(body);

    if (!gwValidation.isValid()) {
        console.log('Errors:');
        gwValidation.getErrors().forEach((errorMessage: string): void => {
            console.log(`- ${errorMessage}`);
        });
    }
}
