import { BlockchainResult } from '../../domain/type/Types'
import { SendMosaicDTO } from '../../domain/dto/SendMosaicDTO'

export interface AggregateTransactionRepository {
  transferTransactionWithNoFee(dto: SendMosaicDTO): Promise<BlockchainResult> 
}