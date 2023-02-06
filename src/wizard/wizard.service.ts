import { Injectable } from '@nestjs/common';
import Companies from 'src/constants/CompaniesEnum';
import Pages from 'src/constants/PagesEnum';
import Sections from 'src/constants/SectionsEnum';
import Status from 'src/constants/StatusEnum';
import DefaultRoute from '../default-company/fullRoute';
import NewAgeRoute from '../new-age-company/fullRoute';
import SafePetRoute from '../safe-pet-company/fullRoute';
import { IWizardSection } from './wizard.interface';

@Injectable()
export class WizardService {
  //constructor() {}

  // strategy pattern
  getRouteByCompany(companyId: Companies) {
    let route = null;
    switch (companyId) {
      case Companies.NewAge: {
        route = NewAgeRoute;
        break;
      }
      case Companies.PetInsurance: {
        route = SafePetRoute;
        break;
      }
      default: {
        route = DefaultRoute;
        break;
      }
    }

    return route;
  }

  getRoute(companyId: Companies): IWizardSection[] {
    // get RouteExample by params
    const wizard = this.getRouteByCompany(companyId);
    const sections = Object.keys(wizard);

    const customizedRoute = sections.map((section) => {
      const currentRoute = wizard[section];
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
