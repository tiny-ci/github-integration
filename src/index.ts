import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { GithubWebhookSchemaValidator } from './schema/githubWebhook'
import { TinyCIAPI } from './service/api'
import { logger } from './lib/logger'
import { Environment, RequiredEnv } from './lib/environment'
import { response, ExErr } from './lib/response'
import { filterWebhookBody } from './filter'

export async function handler (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const environment = new Environment()
  const isDebug = Boolean(environment.get(RequiredEnv.IsDebug))
  const log = logger({ isDebug })

  const body = ((): object | null => {
    try {
      return JSON.parse(event.body!)
    } catch (e) {
      log.error(ExErr.UnparsableEventBody, e)
      return null
    }
  })()

  if (body === null) return response(400, ExErr.UnparsableEventBody)

  const githubPayload = new GithubWebhookSchemaValidator(body)

  if (!githubPayload.isValid()) {
    log.error(ExErr.InvalidEventBody)
    githubPayload.getErrors().forEach((error: string): void => {
      log.error(`- ${error}`)
    })

    return response(400, ExErr.InvalidEventBody)
  }

  const lambdaName = environment.get(RequiredEnv.TinyCIApiFunctionName) as string
  const api = new TinyCIAPI(lambdaName)

  await api.notifyPushEvent(filterWebhookBody(body))
  return response(200)
}
