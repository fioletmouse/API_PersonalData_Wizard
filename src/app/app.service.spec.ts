import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import Companies from 'src/constants/CompaniesEnum';
import Pages from 'src/constants/PagesEnum';
import Sections from 'src/constants/SectionsEnum';
import { WSession } from 'src/db_entities';
import { IPage } from 'src/wizard/wizard.interface';
import { WizardService } from 'src/wizard/wizard.service';
import { Repository } from 'typeorm';
import { AppService } from './app.service';

type MockType<T> = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [P in keyof T]?: jest.Mock<{}>;
};

const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(() => ({
  findOneBy: jest.fn((entity) => entity),
  save: jest.fn((entity) => entity),
  update: jest.fn((entity) => entity)
}));

const routeMock = [
  {
    section: 'Personal Data',
    pages: ['Personal Info', 'Passport', 'Address'],
    status: ' not started'
  },
  {
    section: 'Available options',
    pages: ['Available plans', 'Payment info'],
    status: ' not started'
  }
];
const getPageMockClass = (section, page, data): IPage => ({
  section,
  page,
  data,
  handle: jest.fn()
});

describe('AppService', () => {
  let serviceProvider: AppService;
  let repositoryMock: MockType<Repository<WSession>>;
  const wizardStub = {
    getPageClass: jest.fn(),
    getNextPage: jest.fn(),
    getPreviousPage: jest.fn(),
    getRoute: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: WizardService,
          useValue: wizardStub
        },
        {
          provide: getRepositoryToken(WSession),
          useFactory: repositoryMockFactory
        }
      ]
    }).compile();
    repositoryMock = module.get(getRepositoryToken(WSession));
    serviceProvider = module.get(AppService);
  });

  afterEach(() => {
    repositoryMock.findOneBy.mockClear();
    repositoryMock.update.mockClear();
    repositoryMock.save.mockClear();
    wizardStub.getPageClass.mockClear();
    wizardStub.getNextPage.mockClear();
    wizardStub.getPreviousPage.mockClear();
    wizardStub.getRoute.mockClear();
  });

  it('should be defined', () => {
    expect(serviceProvider).toBeDefined();
  });

  it('should return route for a company w/o last edit and sessionId', async () => {
    wizardStub.getRoute.mockReturnValue(routeMock);
    const route = await serviceProvider.getRoute(null, Companies.NewAge);

    expect(route).toEqual({
      wizardSections: routeMock,
      lastEdit: null
    });
    expect(repositoryMock.findOneBy).not.toHaveBeenCalled();
  });

  it('should return route for a company with session and empty last edit', async () => {
    wizardStub.getRoute.mockReturnValue(routeMock);
    repositoryMock.findOneBy.mockImplementation(() => Promise.resolve({ companyId: Companies.PetInsurance }));

    let route = await serviceProvider.getRoute('any', Companies.NewAge);
    expect(repositoryMock.findOneBy).toHaveBeenCalledWith({ sessionId: 'any' });
    expect(route).toEqual({ wizardSections: routeMock, lastEdit: null });

    route = await serviceProvider.getRoute('any', Companies.PetInsurance);
    expect(repositoryMock.findOneBy).toHaveBeenCalledWith({ sessionId: 'any' });
    expect(route).toEqual({ wizardSections: routeMock, lastEdit: null });

    expect(repositoryMock.findOneBy).toHaveBeenCalledTimes(2);
  });

  it('should return route for a company with last edit', async () => {
    wizardStub.getRoute.mockReturnValue(routeMock);
    repositoryMock.findOneBy.mockImplementation(() =>
      Promise.resolve({
        companyId: Companies.PetInsurance,
        lastSection: Sections.Insurance,
        lastPage: Pages.Payment
      })
    );
    const route = await serviceProvider.getRoute('any', Companies.PetInsurance);

    expect(route).toEqual({
      wizardSections: routeMock,
      lastEdit: {
        lastPage: Pages.Payment,
        lastSection: Sections.Insurance
      }
    });
    expect(repositoryMock.findOneBy).toHaveBeenCalledWith({ sessionId: 'any' });
  });

  it('should create a session id', async () => {
    const params = { companyId: Companies.PetInsurance, clientId: 'client_id' };
    repositoryMock.save.mockImplementation(() => Promise.resolve({ sessionId: 'new_uuid' }));
    const sessionRec = await serviceProvider.createSession(params);

    expect(sessionRec).toEqual('new_uuid');
    expect(repositoryMock.save).toHaveBeenCalledWith({ clientId: 'client_id', companyId: Companies.PetInsurance });
  });

  it('create session should return error if it is not possible to create a session', async () => {
    const params = { companyId: Companies.PetInsurance, clientId: 'client_id' };
    repositoryMock.save.mockImplementation(() => Promise.reject('Error'));
    await expect(serviceProvider.createSession(params)).rejects.toEqual('Error');

    expect(repositoryMock.save).toHaveBeenCalledWith({ clientId: 'client_id', companyId: Companies.PetInsurance });
  });

  it('should patch page data successfully', async () => {
    const params = { sessionId: 'uuid', section: Sections.Personal, page: Pages.Document, data: null };
    repositoryMock.findOneBy.mockImplementation(() =>
      Promise.resolve({ companyId: Companies.PetInsurance, clientId: 'client_id' })
    );
    wizardStub.getPageClass.mockReturnValue(getPageMockClass(params.section, params.page, null));
    repositoryMock.update.mockImplementation(() => Promise.resolve());
    wizardStub.getNextPage.mockReturnValue(getPageMockClass(Sections.Insurance, Pages.Address, null));
    wizardStub.getPreviousPage.mockReturnValue(getPageMockClass(params.section, Pages.Personal, null));

    const response = {
      sessionId: 'uuid',
      companyId: Companies.PetInsurance,
      next: { section: Sections.Insurance, page: Pages.Address, data: null },
      previous: { section: params.section, page: Pages.Personal, data: {} }
    };

    const patchedPage = await serviceProvider.patchPage(params);
    expect(patchedPage).toEqual(response);
    expect(repositoryMock.findOneBy).toHaveBeenCalledWith({ sessionId: 'uuid' });
    expect(repositoryMock.findOneBy).toHaveBeenCalledTimes(1);
    expect(wizardStub.getPageClass).toHaveBeenCalledWith(Companies.PetInsurance, params.section, params.page);
    expect(repositoryMock.update).toHaveBeenCalledWith(
      { sessionId: params.sessionId },
      { lastSection: params.section, lastPage: params.page }
    );
    expect(repositoryMock.update).toHaveBeenCalledTimes(1);
    expect(wizardStub.getNextPage).toHaveBeenCalledWith(Companies.PetInsurance, params.section, params.page);
    expect(wizardStub.getPreviousPage).toHaveBeenCalledWith(Companies.PetInsurance, params.section, params.page);
  });

  it('patch method should throw an error if there is no session in db', async () => {
    const params = { sessionId: 'uuid', section: Sections.Personal, page: Pages.Document, data: null };
    repositoryMock.findOneBy.mockImplementation(() => Promise.reject('Not found'));
    await expect(serviceProvider.patchPage(params)).rejects.toEqual('Not found');

    expect(repositoryMock.findOneBy).toHaveBeenCalledWith({ sessionId: 'uuid' });
    expect(repositoryMock.findOneBy).toHaveBeenCalledTimes(1);

    expect(wizardStub.getPageClass).not.toHaveBeenCalled();
    expect(wizardStub.getNextPage).not.toHaveBeenCalled();
    expect(wizardStub.getPreviousPage).not.toHaveBeenCalled();
    expect(repositoryMock.update).not.toHaveBeenCalled();
  });

  it('patch method should not throw an error if it is not possible to update db error', async () => {
    const params = { sessionId: 'uuid', section: Sections.Personal, page: Pages.Document, data: null };
    repositoryMock.findOneBy.mockImplementation(() =>
      Promise.resolve({ companyId: Companies.PetInsurance, clientId: 'client_id' })
    );
    wizardStub.getPageClass.mockReturnValue(getPageMockClass(params.section, params.page, null));
    repositoryMock.update.mockImplementation(() => Promise.reject('Throw an error'));
    wizardStub.getNextPage.mockReturnValue(getPageMockClass(Sections.Insurance, Pages.Address, null));
    wizardStub.getPreviousPage.mockReturnValue(getPageMockClass(params.section, Pages.Personal, null));
    const response = {
      sessionId: 'uuid',
      companyId: Companies.PetInsurance,
      next: { section: Sections.Insurance, page: Pages.Address, data: null },
      previous: { section: params.section, page: Pages.Personal, data: {} }
    };

    const patchedPage = await serviceProvider.patchPage(params);
    expect(patchedPage).toEqual(response);
    expect(repositoryMock.findOneBy).toHaveBeenCalledWith({ sessionId: 'uuid' });
    expect(repositoryMock.findOneBy).toHaveBeenCalledTimes(1);
    expect(wizardStub.getPageClass).toHaveBeenCalledWith(Companies.PetInsurance, params.section, params.page);
    expect(repositoryMock.update).toHaveBeenCalledWith(
      { sessionId: params.sessionId },
      { lastSection: params.section, lastPage: params.page }
    );
    expect(repositoryMock.update).toHaveBeenCalledTimes(1);
    expect(wizardStub.getNextPage).toHaveBeenCalledWith(Companies.PetInsurance, params.section, params.page);
    expect(wizardStub.getPreviousPage).toHaveBeenCalledWith(Companies.PetInsurance, params.section, params.page);
  });

  it('should find page data successfully', async () => {
    const params = { sessionId: 'uuid', section: Sections.Personal, page: Pages.Document };
    repositoryMock.findOneBy.mockImplementation(() =>
      Promise.resolve({ companyId: Companies.PetInsurance, clientId: 'client_id' })
    );
    wizardStub.getPageClass.mockReturnValue(getPageMockClass(params.section, params.page, { field: 'value' }));
    wizardStub.getNextPage.mockReturnValue(getPageMockClass(Sections.Insurance, Pages.Address, null));
    wizardStub.getPreviousPage.mockReturnValue(getPageMockClass(params.section, Pages.Personal, null));

    const response = {
      sessionId: 'uuid',
      companyId: Companies.PetInsurance,
      current: { section: params.section, page: params.page, data: { field: 'value' } },
      next: { section: Sections.Insurance, page: Pages.Address, data: {} },
      previous: { section: params.section, page: Pages.Personal, data: {} }
    };

    const foundData = await serviceProvider.findPageData(params);
    expect(foundData).toEqual(response);
    expect(repositoryMock.findOneBy).toHaveBeenCalledWith({ sessionId: 'uuid' });
    expect(repositoryMock.findOneBy).toHaveBeenCalledTimes(1);
    expect(wizardStub.getPageClass).toHaveBeenCalledWith(Companies.PetInsurance, params.section, params.page);
    expect(wizardStub.getNextPage).toHaveBeenCalledWith(Companies.PetInsurance, params.section, params.page);
    expect(wizardStub.getPreviousPage).toHaveBeenCalledWith(Companies.PetInsurance, params.section, params.page);
  });

  it('find data method should throw an error if there is no session in db', async () => {
    const params = { sessionId: 'uuid', section: Sections.Personal, page: Pages.Document };
    repositoryMock.findOneBy.mockImplementation(() => Promise.reject('Not found'));
    await expect(serviceProvider.findPageData(params)).rejects.toEqual('Not found');

    expect(repositoryMock.findOneBy).toHaveBeenCalledWith({ sessionId: 'uuid' });
    expect(repositoryMock.findOneBy).toHaveBeenCalledTimes(1);

    expect(wizardStub.getPageClass).not.toHaveBeenCalled();
    expect(wizardStub.getNextPage).not.toHaveBeenCalled();
    expect(wizardStub.getPreviousPage).not.toHaveBeenCalled();
  });
});
