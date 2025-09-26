import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ViewsService } from './views.service';
import { ViewsController } from './views.controller';
import { View } from './entities/view.entity';

@Module({
  imports: [TypeOrmModule.forFeature([View])],
  controllers: [ViewsController],
  providers: [ViewsService],
  exports: [ViewsService],
})
export class ViewsModule {}