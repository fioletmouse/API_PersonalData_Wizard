import { Injectable } from '@nestjs/common';
import Pages from 'src/constants/PagesEnum';
import Sections from 'src/constants/SectionsEnum';
import Status from 'src/constants/StatusEnum';
import { RouteExample } from './dictionaries';
import { IWizardSection } from './wizard.interface';

@Injectable()
export class WizardService {
  //constructor() {}

  getRoute(): IWizardSection[] {
    // get RouteExample by params
    const sections = Object.keys(RouteExample);

    const customizedRoute = sections.map((section) => {
      const currentRoute = RouteExample[section];
      const status = Status.New;

      const item = {
        section: section as Sections,
        pages: currentRoute && (Object.keys(currentRoute) as Pages[]),
        status: status
      };
      return item;
    });

    return customizedRoute;
  }
}
