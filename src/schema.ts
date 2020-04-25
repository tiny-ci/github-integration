import { Validator, Schema, ValidationError } from 'jsonschema';

/* eslint-disable @typescript-eslint/camelcase */
const githubPushWebhookSchema = {
    type: 'object',
    required: ['ref', 'compare', 'repository', 'sender', 'head_commit'],
    properties: {
        ref: { type: 'string' },
        compare: { type: 'string' },

        /* git repository information */
        repository: {
            type: 'object',
            required: ['id', 'url', 'name', 'owner'],
            properties: {
                id: { type: 'number' },
                url: { type: 'string' },
                name: { type: 'string' },

                /* repository's owner information */
                owner: {
                    type: 'object',
                    required: ['id', 'login', 'html_url', 'avatar_url'],
                    properties: {
                        id: { type: 'number' },
                        login: { type: 'string' },
                        html_url: { type: 'string' },
                        avatar_url: { type: 'string' },
                    }
                },
            },
        },

        /* the commit sender information */
        sender: {
            type: 'object',
            required: ['id', 'login', 'avatar_url', 'html_url'],
            properties: {
                id: { type: 'number' },
                login: { type: 'string' },
                avatar_url: { type: 'string' },
                html_url: { type: 'string' },
            },
        },

        /* information about the commit that triggered the webhook */
        head_commit: {
            type: 'object',
            required: ['id', 'url', 'message', 'timestamp'],
            properties: {
                id: { type: 'string' },
                url: { type: 'string' },
                message: { type: 'string' },
                timestamp: { type: 'string' },
            },
        },
    },
};
/* eslint-enable */

const validator = new Validator();

abstract class GenericSchema
{
    private valid: boolean;
    private errors: string[];

    public constructor(data: any)
    {
        const result = validator.validate(data, this.getValidationSchema());

        this.valid  = result.valid;
        this.errors = result.errors.map((err: ValidationError): string => {
            return err.message;
        });
    }

    protected abstract getValidationSchema(): Schema;
    public isValid(): boolean { return this.valid; }
    public getErrors(): string[] { return this.errors; }
}

export class GithubWebhookSchemaValidator extends GenericSchema
{
    protected getValidationSchema(): Schema { return githubPushWebhookSchema; }
}
