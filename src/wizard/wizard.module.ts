import { Module } from '@nestjs/common';
import { WizardService } from './wizard.service';

@Module({
  imports: [],
  providers: [WizardService],
  exports: [WizardService]
})
export class WizardModule {}
