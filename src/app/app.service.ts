import { Injectable } from '@nestjs/common';
import Pages from 'src/constants/PagesEnum';
import Sections from 'src/constants/SectionsEnum';
import { WizardService } from './../wizard/wizard.service';
import { IRoute } from './app.interface';

@Injectable()
export class AppService {
  constructor(private readonly wizard: WizardService) {}
  public async getRoute(sessionID: string): Promise<IRoute> {
    // get last page by session ID
    const route = this.wizard.getRoute();
    const mockRes: IRoute = {
      wizardSections: route,
      lastPage: {
        lastPage: Pages.Address,
        lastSection: Sections.Personal
      }
    };

    return mockRes;
  }
}
