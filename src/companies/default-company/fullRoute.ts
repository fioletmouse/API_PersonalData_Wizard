import Pages from 'src/constants/PagesEnum';
import Sections from 'src/constants/SectionsEnum';
import Address from '../shared/address';
import Document from './handlers/document';
import PersonalInfo from './handlers/personal-info';

const AboutYou = {
  [Pages.Personal]: PersonalInfo,
  [Pages.Document]: Document,
  [Pages.Address]: Address
};

const Route = {
  [Sections.Personal]: AboutYou
};

export default Route;
