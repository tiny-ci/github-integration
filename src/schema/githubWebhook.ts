import { GenericSchemaValidator, Schema } from './generic'

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
            avatar_url: { type: 'string' }
          }
        }
      }
    },

    /* the commit sender information */
    sender: {
      type: 'object',
      required: ['id', 'login', 'avatar_url', 'html_url'],
      properties: {
        id: { type: 'number' },
        login: { type: 'string' },
        avatar_url: { type: 'string' },
        html_url: { type: 'string' }
      }
    },

    /* information about the commit that triggered the webhook */
    head_commit: {
      type: 'object',
      required: ['id', 'url', 'message', 'timestamp'],
      properties: {
        id: { type: 'string' },
        url: { type: 'string' },
        message: { type: 'string' },
        timestamp: { type: 'string' }
      }
    }
  }
}

export class GithubWebhookSchemaValidator extends GenericSchemaValidator {
  protected getValidationSchema (): Schema {
    return githubPushWebhookSchema
  }
}
