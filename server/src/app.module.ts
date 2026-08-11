import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AppServices, bootstrap } from './bootstrap'
import { BoardsController } from './controllers/boards.controller'
import { TasksController } from './controllers/tasks.controller'
import { BoardService } from './services/BoardService'
import { TaskService } from './services/TaskService'

const APP_SERVICES = 'APP_SERVICES'

@Module({
  imports: [],
  controllers: [AppController, BoardsController, TasksController],
  providers: [
    AppService,
    {
      provide: APP_SERVICES,
      useFactory: (): AppServices => bootstrap(process.env.DATABASE_URL),
    },
    {
      provide: BoardService,
      useFactory: (services: AppServices) => services.boardService,
      inject: [APP_SERVICES],
    },
    {
      provide: TaskService,
      useFactory: (services: AppServices) => services.taskService,
      inject: [APP_SERVICES],
    },
  ],
})
export class AppModule {}
