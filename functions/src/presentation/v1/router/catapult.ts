import * as functions from 'firebase-functions'
import * as express from 'express'
import * as corsLib from 'cors'
import { SampleUseCase } from '../../../domain/use_case/SampleUseCase'
import container from '../../../inversify.config'

const cors = corsLib()
const router = express.Router()
const app = express()

router.use(async (request, response, next) => {
	return await cors(request, response, async () => {
    next()
	})
})

router.use('/wallet', async (request, response) => {
  try {
    const useCase = container.get<SampleUseCase>('SampleUseCase')
    const result = useCase.createWallet()
    response.status(200).send(result)
  } catch (e) {
    response.status(500).send(e)
  }
})

router.use('/distribution', async (request, response) => {
  try {
    const useCase = container.get<SampleUseCase>('SampleUseCase')
    const result = await useCase.distributionMosaic()
    response.status(200).send(result)
  } catch (e) {
    response.status(500).send(e)
  }
})

router.use('/send', async (request, response) => {
  try {
    const useCase = container.get<SampleUseCase>('SampleUseCase')
    const result = await useCase.sendMosaicNoFee()
    response.status(200).send(result)
  } catch (e) {
    response.status(500).send(e)
  }
})

app.use('/', router)
export const api = functions.region('asia-northeast1').https.onRequest(app)