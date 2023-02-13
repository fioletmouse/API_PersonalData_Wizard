import Pages from 'src/constants/PagesEnum';
import Sections from 'src/constants/SectionsEnum';
import { IPage } from 'src/wizard/wizard.interface';
import { HttpRepositories } from './../../../external-services/http/http-repos';

class ClassData {
  type: string = null;
  prefixNumber: string = null;
  number: string = null;
  bestBefore: string = null;
}

class Document implements IPage {
  data: any;
  section: Sections = Sections.Personal;
  page: Pages = Pages.Document;

  constructor(private readonly externalConn: HttpRepositories) {}

  private async saveTo(clientId: string, obj: ClassData) {
    console.log('Save method');
    await this.externalConn.clientRepository.createEmptyClient('external Document');
  }

  private async getFrom(clientId: string) {
    console.log('get method');
  }

  async handle(clientId: string, obj: any) {
    if (obj) {
      await this.saveTo(clientId, obj);
    } else {
      await this.getFrom(clientId);
    }
  }
}
export default Document;
