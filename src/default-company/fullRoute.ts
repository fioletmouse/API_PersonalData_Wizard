import Pages from 'src/constants/PagesEnum';
import Sections from 'src/constants/SectionsEnum';
import PersonalInfo from './handlers/personal-info';

const AboutYou = {
  [Pages.Personal]: PersonalInfo,
  [Pages.Document]: PersonalInfo,
  [Pages.Address]: PersonalInfo
};

const Property = {
  [Pages.AboutProp]: null
};

const Route = {
  [Sections.Personal]: AboutYou,
  [Sections.Property]: Property
};

export default Route;
