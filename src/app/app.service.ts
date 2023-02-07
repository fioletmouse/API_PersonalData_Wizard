import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Companies from 'src/constants/CompaniesEnum';
import Pages from 'src/constants/PagesEnum';
import Sections from 'src/constants/SectionsEnum';
import { Repository } from 'typeorm';
import { WSession } from './../db_entities/session.entity';
import { WizardService } from './../wizard/wizard.service';
import { IRoute } from './app.interface';

@Injectable()
export class AppService {
  constructor(
    private readonly wizard: WizardService,
    @InjectRepository(WSession) private sessionRepository: Repository<WSession>
  ) {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async getRoute(sessionId: string, companyId: Companies): Promise<IRoute> {
    const res = await this.sessionRepository.findOneBy({ sessionId });
    console.log(res);
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
