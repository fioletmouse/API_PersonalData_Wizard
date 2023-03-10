import Pages from 'src/constants/PagesEnum';
import Sections from 'src/constants/SectionsEnum';
import { HttpRepositories } from 'src/external-services/http/http-repos';
import { IPage } from 'src/wizard/wizard.interface';

class ClassData {
  type: string = null;
  city: string = null;
  street: string = null;
  building: string = null;
  apartment: string = null;
}

class Address implements IPage {
  data: any;
  section: Sections = Sections.Personal;
  page: Pages = Pages.Address;

  constructor(private readonly externalConn: HttpRepositories) {}

  private async saveTo(clientId: string, obj: ClassData) {
    console.log('Save method');
    await this.externalConn.clientRepository.createEmptyClient('external Address');
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
export default Address;
