import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Companies from 'src/constants/CompaniesEnum';
import Pages from 'src/constants/PagesEnum';
import Sections from 'src/constants/SectionsEnum';
import { Repository } from 'typeorm';
import { WSession } from './../db_entities/session.entity';
import { WizardService } from './../wizard/wizard.service';
import { CreateSessionDto } from './app-input.dto';
import { IRoute } from './app.interface';

@Injectable()
export class AppService {
  constructor(
    private readonly wizard: WizardService,
    @InjectRepository(WSession) private sessionRepository: Repository<WSession>
  ) {}

  public async getRoute(sessionId: string, companyId: Companies): Promise<IRoute> {
    const route = this.wizard.getRoute(companyId);
    const response: IRoute = {
      wizardSections: route,
      lastEdit: null
    };

    // get last page by sessionId
    if (sessionId) {
      const sessionRec = await this.sessionRepository.findOneBy({ sessionId });
      if (sessionRec.companyId === companyId)
        if (sessionRec.lastPage || sessionRec.lastSection) {
          response.lastEdit = {
            lastPage: sessionRec.lastPage as Pages,
            lastSection: sessionRec.lastSection as Sections
          };
        }
    }

    return response;
  }

  public async createSession(createSessionParams: CreateSessionDto): Promise<string> {
    const { companyId, clientId } = createSessionParams;
    try {
      const newSession = new WSession();
      newSession.companyId = companyId;
      newSession.clientId = clientId;
      const newRecord = await this.sessionRepository.save(newSession);
      // use it in cookies
      return newRecord.sessionId;
    } catch (err) {
      // add logger
      throw err;
    }
  }
}
