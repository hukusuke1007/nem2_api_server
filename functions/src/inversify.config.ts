import 'reflect-metadata'
import { Container } from 'inversify'
import { CatapultUseCase, CatapultUseCaseImpl } from './domain/use_case/CatapultUseCase'
import { WalletRepository } from './domain/repository/WalletRepository'
import { TransactionRepository } from './domain/repository/TransactionRepository'
import { AggregateTransactionRepository } from './domain/repository/AggregateTransactionRepository'
import { WalletDatasource } from './infrastructure/WalletDatasource'
import { TransactionDataSource } from './infrastructure/TransactionDataSource'
import { AggregateTransactionDataSource } from './infrastructure/AggregateTransactionDataSource'

const container = new Container()

// Repository
container.bind<WalletRepository>('WalletRepository').to(WalletDatasource)
container.bind<TransactionRepository>('TransactionRepository').to(TransactionDataSource)
container.bind<AggregateTransactionRepository>('AggregateTransactionRepository').to(AggregateTransactionDataSource)

// UseCase
container.bind<CatapultUseCase>('CatapultUseCase').to(CatapultUseCaseImpl)

export default container