import 'server-only'
import { BetaAnalyticsDataClient } from '@google-analytics/data'
import { Storage } from '@google-cloud/storage'

/**
 * GA4 Data API · Play 리포트(GCS) 조회용 서비스 계정.
 * Vercel 에는 키 파일을 둘 수 없어 JSON 키를 base64 로 env 에 넣는다 (GOOGLE_SERVICE_ACCOUNT_JSON_BASE64)
 */
interface ServiceAccount {
  client_email: string
  private_key: string
  project_id?: string
}

let account: ServiceAccount | null | undefined
let gaClient: BetaAnalyticsDataClient | undefined
let storage: Storage | undefined

function loadAccount(): ServiceAccount | null {
  if (account !== undefined) return account
  const b64 = process.env.GOOGLE_SERVICE_ACCOUNT_JSON_BASE64
  if (!b64) {
    account = null
    return account
  }
  const json = JSON.parse(Buffer.from(b64, 'base64').toString('utf8'))
  account = {
    client_email: json.client_email,
    private_key: json.private_key,
    project_id: json.project_id,
  }
  return account
}

export function getGaClient(): BetaAnalyticsDataClient | null {
  const sa = loadAccount()
  if (!sa) return null
  gaClient ??= new BetaAnalyticsDataClient({
    credentials: { client_email: sa.client_email, private_key: sa.private_key },
    projectId: sa.project_id,
  })
  return gaClient
}

export function getStorage(): Storage | null {
  const sa = loadAccount()
  if (!sa) return null
  storage ??= new Storage({
    credentials: { client_email: sa.client_email, private_key: sa.private_key },
    projectId: sa.project_id,
  })
  return storage
}
