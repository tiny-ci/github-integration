import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import { GithubWebhookSchemaValidator } from './schema/githubWebhook';
import logger from './lib/logger';
import parseWebhookBody from './parser';

const log = logger({ isDebug: true });

function response(statusCode: number): APIGatewayProxyResult
{
    return { body: '', statusCode };
}

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult>
{
    let body: any = null;
    try {
        body = JSON.parse(event.body!);
    }
    catch (e) {
        log.error('could not parse event body', e);
        return response(500);
    }

    const validator = new GithubWebhookSchemaValidator(body);
    if (!validator.isValid()) {
        log.error('received event body is invalid');
        validator.getErrors().forEach((error: string): void => {
            log.error(`- ${error}`);
        });

        return response(500);
    }

    console.log(parseWebhookBody(body));
    return response(200);
}
