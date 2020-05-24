export enum ExErr
{
    UnparsableEventBody = 'could not parse event body',
    InvalidEventBody = 'event body does not match expected schema',
}

export function response(statusCode: number, body = ''): APIGatewayProxyResult
{
    return { statusCode, body };
}
