import 'reflect-metadata'
import { Container } from 'inversify'
import { SampleUseCase, SampleUseCaseImpl } from './domain/use_case/SampleUseCase'
import { WalletRepository } from './domain/repository/WalletRepository'
import { AggregateTransactionRepository } from './domain/repository/AggregateTransactionRepository'
import { TransactionRepository } from './domain/repository/TransactionRepository'
import { WalletDatasource } from './infrastructure/WalletDatasource'
import { AggregateTransactionDataSource } from './infrastructure/AggregateTransactionDataSource'
import { TransactionDataSource } from './infrastructure/TransactionDataSource'

const container = new Container()

container.bind<WalletRepository>('WalletRepository').to(WalletDatasource)
container.bind<AggregateTransactionRepository>('AggregateTransactionRepository').to(AggregateTransactionDataSource)
container.bind<TransactionRepository>('TransactionRepository').to(TransactionDataSource)
container.bind<SampleUseCase>('SampleUseCase').to(SampleUseCaseImpl)

export default container