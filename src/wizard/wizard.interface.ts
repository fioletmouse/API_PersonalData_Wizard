import Pages from 'src/constants/PagesEnum';
import Sections from 'src/constants/SectionsEnum';
import Status from 'src/constants/StatusEnum';

export interface IWizardSection {
  section: Sections;
  pages: Pages[];
  status: Status;
}
