import Pages from 'src/constants/PagesEnum';
import Sections from 'src/constants/SectionsEnum';
import PersonalInfo from './handlers/personal-info';
import PropertyClass from './handlers/property';

const AboutYou = {
  [Pages.Personal]: PersonalInfo,
  [Pages.Document]: PersonalInfo,
  [Pages.Address]: PersonalInfo
};

const Property = {
  [Pages.AboutProp]: PropertyClass,
  [Pages.AnimalDetails]: PropertyClass
};

const Insurance = {
  [Pages.MainOptions]: PropertyClass,
  [Pages.Payment]: PropertyClass
};

const Route = {
  [Sections.Personal]: AboutYou,
  [Sections.Property]: Property,
  [Sections.Insurance]: Insurance
};

export default Route;
