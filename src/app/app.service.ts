import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Companies from 'src/constants/CompaniesEnum';
import Pages from 'src/constants/PagesEnum';
import Sections from 'src/constants/SectionsEnum';
import { Repository } from 'typeorm';
import { WSession } from './../db_entities/session.entity';
import { WizardService } from './../wizard/wizard.service';
import { CreateSessionDto, FindPageDataDto, PatchPageDto } from './app-input.dto';
import { IFindPageOutput, IPatchPageOutput, IRoute } from './app.interface';

@Injectable()
export class AppService {
  constructor(
    private readonly wizard: WizardService,
    @InjectRepository(WSession) private sessionRepository: Repository<WSession>
  ) {}

  async getRoute(sessionId: string, companyId: Companies): Promise<IRoute> {
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

  async createSession(createSessionParams: CreateSessionDto): Promise<string> {
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

  async patchPage(patchPage: PatchPageDto): Promise<IPatchPageOutput> {
    const { sessionId, section, page, data } = patchPage;

    // retrieve the record using the arn
    const sessionRec = await this.sessionRepository.findOneBy({ sessionId });
    if (!sessionRec) throw new BadRequestException(`There is no record for session=${sessionId}`);

    const { clientId, companyId } = sessionRec;

    // validate and store data
    const instance = this.wizard.getPageClass(companyId, section, page);
    await instance.handle(clientId, data);

    // set current page in DB
    try {
      await this.sessionRepository.update({ sessionId }, { lastSection: section, lastPage: page });
    } catch (err) {
      // change to log error
      console.log(err);
    }

    // Get next page
    const nextPageInstance = this.wizard.getNextPage(companyId, section, page);

    // get prev page
    const previousPageInstance = this.wizard.getPreviousPage(companyId, section, page);

    // return nav object
    return {
      sessionId,
      companyId,
      next: {
        section: nextPageInstance.section,
        page: nextPageInstance.page,
        data: nextPageInstance.data
      },
      previous: {
        section: previousPageInstance.section,
        page: previousPageInstance.page,
        data: {}
      }
    } as IPatchPageOutput;
  }

  async findPageData({ sessionId, section, page }: FindPageDataDto): Promise<IFindPageOutput> {
    const sessionRec = await this.sessionRepository.findOneBy({ sessionId });
    if (!sessionRec) throw new BadRequestException(`There is no record for session=${sessionId}`);
    const { clientId, companyId } = sessionRec;

    const instance = this.wizard.getPageClass(companyId, section, page);
    await instance.handle(clientId, null);

    const nextPageInstance = this.wizard.getNextPage(companyId, section, page);
    const previousPageInstance = this.wizard.getPreviousPage(companyId, section, page);

    const formattedData: IFindPageOutput = {
      sessionId,
      companyId,
      current: {
        section: instance.section,
        page: instance.page,
        data: instance.data
      },
      next: {
        section: nextPageInstance.section,
        page: nextPageInstance.page,
        data: {}
      },
      previous: {
        section: previousPageInstance.section,
        page: previousPageInstance.page,
        data: {}
      }
    };
    return formattedData;
  }
}
