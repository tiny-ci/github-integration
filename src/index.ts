import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

import { logger } from './logger';
import { RefType, INewJobPayload } from './types';
import { GithubWebhookSchemaValidator } from './schema';

const log = logger({ isDebug: true });

function response(statusCode: number): APIGatewayProxyResult
{
    return { body: '', statusCode };
}

function parse(body: any): INewJobPayload
{
    const owner = body.repository.owner;
    const commit = body.head_commit;

    const segs: string[] = (body.ref as string).split('/');
    if (segs.length < 3)
        throw new Error('could not parse github webhook body');

    const type = segs[1].toLowerCase();
    const refType = ((): RefType => {
        switch (type) {
            case 'heads': return RefType.Branch;
            case 'tags':  return RefType.Tag;
            default:
                throw new Error(`unknown ref type; got: ${body.ref}`);
        }
    })();

    segs.splice(0, 2);
    const refName = segs.join('/');

    return {
        commit: {
            hash: commit.id,
            ts: commit.timestamp,
            message: commit.message,
            ref: {
                type: refType,
                name: refName,
            },
            web: {
                url: commit.url,
                compare: body.compare,
            }
        },
        repository: {
            id: (body.repository.id as number).toString(),
            name: body.repository.name,
            web: {
                url: body.repository.html_url,
            }
        },
        sender: {
            id: (body.sender.id as number).toString(),
            login: body.sender.login,
            web: {
                url: body.sender.html_url,
                avatar: body.sender.avatar_url,
            }
        },
        owner: {
            id: (owner.id as number).toString(),
            login: owner.login,
            web: {
                url: owner.html_url,
                avatar: owner.avatar_url,
            }
        },
    };
}

// @ts-ignore
export async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult>
{
    log.info('teste');
    let body: any = null;
    try {
        body = JSON.parse(event.body!);
    }
    catch (e) {
        log.error('could not parse event body', e);
        return response(500);
    }

    const validation = new GithubWebhookSchemaValidator(body);
    const hasError = !validation.isValid();
    if (hasError) {
        log.error('received event body is invalid');
        validation.getErrors().forEach((error: string): void => {
            log.error(`- ${error}`);
        });

        return response(500);
    }

    console.log(parse(body));

    return response(200);
}
