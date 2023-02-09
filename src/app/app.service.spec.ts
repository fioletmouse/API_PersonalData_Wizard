import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { WSession } from 'src/db_entities';
import { WizardService } from 'src/wizard/wizard.service';
import { Repository } from 'typeorm';
import { AppService } from './app.service';
export type MockType<T> = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [P in keyof T]?: jest.Mock<{}>;
};
const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(() => ({
  findOne: jest.fn((entity) => entity)
}));

describe('AppService', () => {
  let serviceProvider: AppService;

  const wizardStub = {
    getPageClass: jest.fn(),
    getNextPage: jest.fn(),
    getPreviousPage: jest.fn(),
    getRoute: jest.fn()
  };
  let repositoryMock: MockType<Repository<WSession>>;

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

  it('should be defined', () => {
    expect(serviceProvider).toBeDefined();
  });
});
