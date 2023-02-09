import Companies from 'src/constants/CompaniesEnum';
import Pages from '../constants/PagesEnum';
import Sections from '../constants/SectionsEnum';
import { IWizardSection } from './../wizard/wizard.interface';

interface ILastPage {
  lastSection: Sections;
  lastPage: Pages;
}

export interface IRoute {
  wizardSections: IWizardSection[];
  lastEdit?: ILastPage;
}

interface IPageOutput {
  section: Sections;
  page: Pages;
  data: any;
}

export interface IPatchPageOutput {
  sessionId: string;
  companyId: Companies;
  next: IPageOutput;
  previous: IPageOutput;
}

export interface IFindPageOutput {
  sessionId: string;
  companyId: Companies;
  current: IPageOutput;
  next: IPageOutput;
  previous: IPageOutput;
}
