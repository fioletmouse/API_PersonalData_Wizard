import Pages from 'src/constants/PagesEnum';
import Sections from 'src/constants/SectionsEnum';
import Status from 'src/constants/StatusEnum';

export interface IWizardSection {
  section: Sections;
  pages: Pages[];
  status: Status;
}

export interface IPage {
  section: Sections;
  page: Pages;
  data: any;
  handle: (clientId: string, data: any) => void;
}
