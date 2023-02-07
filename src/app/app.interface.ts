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
