import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { FacilitiesModule } from './facilities/facilities.module';
import { ResidentsModule } from './residents/residents.module';
import { StaffModule } from './staff/staff.module';
import { IncidentsModule } from './incidents/incidents.module';
import { ClaimsModule } from './claims/claims.module';
import { TasksModule } from './tasks/tasks.module';
import { IntegrationModule } from './integration/integration.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    FacilitiesModule,
    ResidentsModule,
    StaffModule,
    IncidentsModule,
    ClaimsModule,
    TasksModule,
    IntegrationModule,
  ],
})
export class AppModule {}
