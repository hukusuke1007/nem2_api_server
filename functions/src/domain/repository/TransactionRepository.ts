import { BlockchainResult } from '../type/Types'
import { SendMosaicDTO } from '../dto/SendMosaicDTO'

export interface TransactionRepository {
  transferTransaction(dto: SendMosaicDTO): Promise<BlockchainResult>
}