import Pages from 'src/constants/PagesEnum';
import Sections from 'src/constants/SectionsEnum';
import { IPage } from 'src/wizard/wizard.interface';
import { HttpRepositories } from './../../../external-services/http/http-repos';

class ClassData {
  nameFirst: string = null;
  nameLast: string = null;
  gender: string = null;
  dob: string = null;
}

class PersonalInfo implements IPage {
  data: any;
  section: Sections = Sections.Personal;
  page: Pages = Pages.Personal;

  constructor(private readonly externalConn: HttpRepositories) {}

  private async saveTo(clientId: string, obj: ClassData) {
    await this.externalConn.clientRepository.createEmptyClient('external clll');
    console.log('Save method');
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
export default PersonalInfo;
