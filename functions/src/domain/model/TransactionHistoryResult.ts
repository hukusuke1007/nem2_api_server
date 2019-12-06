import { TransactionType } from '../type/Types'
import { TransactionDetail } from './TransactionDetail'

export class TransactionHistoryResult {
  transactionType: TransactionType
  detail: TransactionDetail[]
  rawTransactions: any[]
  lastTxId?: string
  constructor(transactionType: TransactionType, detail: TransactionDetail[], rawTransactions?: any[], lastTxId?: string) {
    this.transactionType = transactionType
    this.detail = detail
    this.rawTransactions = rawTransactions
    this.lastTxId = lastTxId
  }
}
