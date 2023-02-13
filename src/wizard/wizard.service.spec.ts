import { Test, TestingModule } from '@nestjs/testing';
import Document from 'src/companies/default-company/handlers/document';
import PersonalInfo from 'src/companies/default-company/handlers/personal-info';
import Address from 'src/companies/shared/address';
import NoPage from 'src/companies/shared/no-page';
import Companies from 'src/constants/CompaniesEnum';
import Pages from 'src/constants/PagesEnum';
import Sections from 'src/constants/SectionsEnum';
import Statuses from 'src/constants/StatusEnum';
import { HttpRepositories } from 'src/external-services/http/http-repos';
import { WizardService } from './wizard.service';

const clientRepositoryStub = {
  createEmptyClient: jest.fn()
};

const httpRepoStub = { clientRepository: clientRepositoryStub };

describe('Wizard', () => {
  let provider: WizardService;
  const companyId = Companies.Default;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WizardService,
        {
          provide: HttpRepositories,
          useValue: httpRepoStub
        }
      ]
    }).compile();

    provider = module.get<WizardService>(WizardService);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  it('should get an instance of a class related to a section and page', async () => {
    const inst = provider.getPageClass(companyId, Sections.Personal, Pages.Document);
    expect(inst).toBeInstanceOf(Document);
    expect(inst.section).toBe(Sections.Personal);
    expect(inst.page).toBe(Pages.Document);
  });

  it('should get an instance of next page class', async () => {
    const inst = provider.getNextPage(companyId, Sections.Personal, Pages.Document);
    expect(inst).toBeInstanceOf(Address);
    expect(inst.section).toBe(Sections.Personal);
    expect(inst.page).toBe(Pages.Address);
  });

  it('should get an instance for the previous page', async () => {
    const inst = provider.getPreviousPage(companyId, Sections.Personal, Pages.Document);
    expect(inst).toBeInstanceOf(PersonalInfo);
    expect(inst.section).toBe(Sections.Personal);
    expect(inst.page).toBe(Pages.Personal);
  });

  it('should get an empty instance if there is no previouse page', async () => {
    const inst = provider.getPreviousPage(companyId, Sections.Personal, Pages.Personal);
    expect(inst).toBeInstanceOf(NoPage);
    expect(inst.section).toBeNull();
    expect(inst.page).toBeNull();
  });

  it('should get an empty instance if there is no next page', async () => {
    const inst = provider.getNextPage(companyId, Sections.Personal, Pages.Address);
    expect(inst).toBeInstanceOf(NoPage);
    expect(inst.section).toBeNull();
    expect(inst.page).toBeNull();
  });

  it.skip('should get an instance of a page from the next section', async () => {
    const inst = provider.getNextPage(Companies.NewAge, Sections.Property, Pages.PropDetails);
    expect(inst.section).toBe(Sections.Insurance);
    expect(inst.page).toBe(Pages.MainOptions);
  });

  it.skip('should get an instance of a page from the previous section', async () => {
    const inst = provider.getPreviousPage(Companies.NewAge, Sections.Insurance, Pages.MainOptions);
    expect(inst.section).toBe(Sections.Property);
    expect(inst.page).toBe(Pages.PropDetails);
  });

  it('should return a new wizard', async () => {
    const wizard = await provider.getRoute(companyId);
    expect(wizard.length).toBe(1);
    expect(wizard[0]).toMatchObject({
      section: 'Personal Data',
      pages: ['Personal Info', 'Passport', 'Address'],
      status: Statuses.New
    });
  });

  it('should throw an error if wizard sections are changes', async () => {
    expect(() => provider.getRoute(companyId, Sections.Insurance)).toThrow(
      'last section with name: Available options is not found in dictionary'
    );
  });

  it('should return a wizard that was started earlier', async () => {
    const wizard = await provider.getRoute(Companies.NewAge, Sections.Property);
    expect(wizard[0]).toMatchObject({
      section: 'Personal Data',
      pages: ['Personal Info', 'Passport', 'Address'],
      status: Statuses.Done
    });
    expect(wizard[1]).toMatchObject({
      section: 'Property',
      pages: ['Property Info', 'Property info'],
      status: Statuses.InProgress
    });
    expect(wizard[2]).toMatchObject({
      section: 'Available options',
      pages: ['Available plans', 'Payment info'],
      status: Statuses.New
    });
  });
});

describe('NoPage tests', () => {
  it('should return a noPage class instance', async () => {
    const instance = new NoPage();
    expect(instance.section).toBeNull();
    expect(instance.page).toBeNull();
    expect(instance.data).toEqual({});
  });
});
