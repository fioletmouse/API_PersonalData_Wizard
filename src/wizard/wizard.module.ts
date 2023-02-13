import { Module } from '@nestjs/common';
import { ExternalServicesModule } from 'src/external-services/external-services.module';
import { WizardService } from './wizard.service';

@Module({
  imports: [ExternalServicesModule],
  providers: [WizardService],
  exports: [WizardService]
})
export class WizardModule {}
