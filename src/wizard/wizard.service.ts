import { Injectable } from '@nestjs/common';
import NoPage from 'src/companies/default-company/handlers/no-page';
import Companies from 'src/constants/CompaniesEnum';
import Pages from 'src/constants/PagesEnum';
import Sections from 'src/constants/SectionsEnum';
import Status from 'src/constants/StatusEnum';
import DefaultRoute from '../companies/default-company/fullRoute';
import NewAgeRoute from '../companies/new-age-company/fullRoute';
import SafePetRoute from '../companies/safe-pet-company/fullRoute';
import { IPage, IWizardSection } from './wizard.interface';

@Injectable()
export class WizardService {
  // strategy pattern
  private getRouteByCompany(companyId: Companies) {
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

  getPageClass(companyId: Companies, section: string, page: string): IPage {
    const wizard = this.getRouteByCompany(companyId);
    const currentSection = wizard[section];
    const currentPageClass = currentSection[page];
    const instance: IPage = new currentPageClass();

    return instance;
  }

  private pageCalc(companyId: Companies, section: string, page?: string, isPrevious = false): IPage | undefined {
    const wizard = this.getRouteByCompany(companyId);
    const currentSectionPages = wizard[section];
    const sectionPagesKeys = Object.keys(currentSectionPages);
    let pageIndex;
    if (isPrevious) {
      pageIndex = page ? sectionPagesKeys.indexOf(page) - 1 : sectionPagesKeys.length - 1;
    } else {
      pageIndex = page ? sectionPagesKeys.indexOf(page) + 1 : 0;
    }
    const nextPageKey = sectionPagesKeys[pageIndex];
    if (nextPageKey) {
      const NextPageClass = currentSectionPages[nextPageKey];
      return new NextPageClass();
    }
    return null;
  }

  getNextPage(companyId: Companies, section: string, page: string): IPage {
    // next page in current section
    let classObj = this.pageCalc(companyId, section, page);
    if (!classObj) {
      // next section
      const wizard = this.getRouteByCompany(companyId);
      const sectionsKeys = Object.keys(wizard);
      const currentSectionIndex = sectionsKeys.indexOf(section);
      const nextSectionKey = sectionsKeys[currentSectionIndex + 1];
      // there is no next section
      if (!nextSectionKey) {
        return new NoPage();
      }
      // first page in next section
      classObj = this.pageCalc(companyId, nextSectionKey, null);
      // there is no pages
      if (!classObj) {
        return new NoPage();
      }
    }
    return classObj;
  }

  getPreviousPage(companyId: Companies, section: string, page: string): IPage {
    // previous page in current section
    let classObj = this.pageCalc(companyId, section, page, true);
    if (!classObj) {
      // previous section
      const wizard = this.getRouteByCompany(companyId);
      const sectionsKeys = Object.keys(wizard);
      const currentSectionIndex = sectionsKeys.indexOf(section);
      const previousSectionKey = sectionsKeys[currentSectionIndex - 1];
      // there is no previous section
      if (!previousSectionKey) {
        return new NoPage();
      }
      // first page in previous section
      classObj = this.pageCalc(companyId, previousSectionKey, null, true);
      // there is no pages
      if (!classObj) {
        return new NoPage();
      }
    }
    return classObj;
  }
}
