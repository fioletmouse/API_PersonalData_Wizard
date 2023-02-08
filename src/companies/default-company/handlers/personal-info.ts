import Pages from 'src/constants/PagesEnum';
import Sections from 'src/constants/SectionsEnum';
import { IPage } from 'src/wizard/wizard.interface';

class ClassData {
  nameFirst: string = null;
  nameLast: string = null;
  gender: string = null;
  dob: string = null;
  maritalStatus: string = null;
}

class PersonalInfo implements IPage {
  data: any;
  section: Sections = Sections.Personal;
  page: Pages = Pages.Personal;

  private async saveTo(clientId: string, obj: ClassData) {}

  private async getFrom(clientId: string) {}

  async handle(clientId: string, obj: any) {
    if (obj) {
      await this.saveTo(clientId, obj);
    } else {
      await this.getFrom(clientId);
    }
  }
}
export default PersonalInfo;
