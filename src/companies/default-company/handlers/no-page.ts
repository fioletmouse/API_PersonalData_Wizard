import Pages from 'src/constants/PagesEnum';
import Sections from 'src/constants/SectionsEnum';
import { IPage } from 'src/wizard/wizard.interface';

class NoPage implements IPage {
  data: any;
  section: Sections = null;
  page: Pages = null;

  constructor() {
    this.data = {};
  }

  async handle() {
    // stub
  }
}

export default NoPage;
