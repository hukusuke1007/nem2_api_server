import * as functions from 'firebase-functions'
import * as express from 'express'
import * as corsLib from 'cors'
import { CatapultUseCase } from '../../../domain/use_case/CatapultUseCase'
import container from '../../../inversify.config'
import { ResponseBody } from '../../../domain/dto/response/ResponseBody'
import { SendMosaicDTO } from '../../../domain/dto/SendMosaicDTO'
import { FaucetDTO } from '../../../domain/dto/FaucetDTO'

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
    const useCase = container.get<CatapultUseCase>('CatapultUseCase')
    const result = useCase.createWallet()
    response.status(200).send(new ResponseBody(200, result))
  } catch (e) {
    response.status(500).send(new ResponseBody(500, undefined, e))
  }
})

router.use('/faucet', async (request, response) => {
  try {
    const dto = new FaucetDTO(request.body)
    const useCase = container.get<CatapultUseCase>('CatapultUseCase')
    const result = await useCase.distributeFromFaucet(dto)
    response.status(200).send(new ResponseBody(200, result))
  } catch (e) {
    response.status(500).send(new ResponseBody(500, undefined, e))
  }
})

router.use('/sendMosaic', async (request, response) => {
  try {
    const dto = new SendMosaicDTO(request.body)
    const useCase = container.get<CatapultUseCase>('CatapultUseCase')
    const result = await useCase.sendMosaic(dto)
    response.status(200).send(new ResponseBody(200, result))
  } catch (e) {
    response.status(500).send(new ResponseBody(500, undefined, e))
  }
})

router.use('/sendMosaicNoFee', async (request, response) => {
  try {
    const dto = new SendMosaicDTO(request.body)
    const useCase = container.get<CatapultUseCase>('CatapultUseCase')
    const result = await useCase.sendMosaicNoFee(dto)
    response.status(200).send(new ResponseBody(200, result))
  } catch (e) {
    response.status(500).send(new ResponseBody(500, undefined, e))
  }
})

app.use('/', router)
export const api = functions.region('asia-northeast1').https.onRequest(app)