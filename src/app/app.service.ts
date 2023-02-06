import { Injectable } from '@nestjs/common';
import Companies from 'src/constants/CompaniesEnum';
import Pages from 'src/constants/PagesEnum';
import Sections from 'src/constants/SectionsEnum';
import { WizardService } from './../wizard/wizard.service';
import { IRoute } from './app.interface';

@Injectable()
export class AppService {
  constructor(private readonly wizard: WizardService) {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async getRoute(sessionID: string, companyId: Companies): Promise<IRoute> {
    // get last page by session ID
    const route = this.wizard.getRoute(companyId);
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
