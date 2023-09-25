import { DB_CONFIG, SQS_CONFIG } from '@/conf'
import IntegrationDataRepository from '@/repo/integrationData.repo'
import { DbStore, getDbConnection } from '@crowd/database'
import { getServiceTracer } from '@crowd/tracing'
import { getServiceLogger } from '@crowd/logging'
import { IntegrationDataWorkerEmitter, getSqsClient } from '@crowd/sqs'
import { IntegrationStreamDataState } from '@crowd/types'

const tracer = getServiceTracer()
const log = getServiceLogger()

const processArguments = process.argv.slice(2)

if (processArguments.length !== 1) {
  log.error('Expected 1 argument: tenantId')
  process.exit(1)
}

const tenantId = processArguments[0]

setImmediate(async () => {
  const sqsClient = getSqsClient(SQS_CONFIG())
  const emitter = new IntegrationDataWorkerEmitter(sqsClient, tracer, log)
  await emitter.init()

  const dbConnection = await getDbConnection(DB_CONFIG())
  const store = new DbStore(log, dbConnection)
  const repo = new IntegrationDataRepository(store, log)

  const dataIds = await repo.getDataForTenant(tenantId)

  for (const dataId of dataIds) {
    const info = await repo.getDataInfo(dataId)

    if (info) {
      if (info.state !== IntegrationStreamDataState.PENDING) {
        await repo.resetStream(dataId)
      }

      await emitter.triggerDataProcessing(info.tenantId, info.integrationType, dataId)
    } else {
      log.error({ dataId }, 'Data stream not found!')
      process.exit(1)
    }
  }
})
