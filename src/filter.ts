import { RefType, IPushEvent, IHash } from './lib/types'

export function filterWebhookBody (body: IHash): IPushEvent {
  const owner = body.repository.owner
  const commit = body.head_commit

  const segs: string[] = (body.ref as string).split('/')
  if (segs.length < 3) throw new Error('could not parse github webhook body')

  const type = segs[1].toLowerCase()
  const refType = ((): RefType => {
    switch (type) {
      case 'heads':
        return RefType.Branch
      case 'tags':
        return RefType.Tag
      default:
        throw new Error(`unknown ref type; got: ${body.ref as string}`)
    }
  })()

  segs.splice(0, 2)
  const refName = segs.join('/')

  return {
    commit: {
      hash: commit.id,
      ts: commit.timestamp,
      message: commit.message,
      ref: {
        type: refType,
        name: refName
      },
      web: {
        url: commit.url,
        compare: body.compare
      }
    },
    repository: {
      id: (body.repository.id as number).toString(),
      name: body.repository.name,
      web: {
        url: body.repository.html_url
      }
    },
    sender: {
      id: (body.sender.id as number).toString(),
      login: body.sender.login,
      web: {
        url: body.sender.html_url,
        avatar: body.sender.avatar_url
      }
    },
    owner: {
      id: (owner.id as number).toString(),
      login: owner.login,
      web: {
        url: owner.html_url,
        avatar: owner.avatar_url
      }
    }
  }
}
