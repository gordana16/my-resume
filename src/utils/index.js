import { resume } from "../config";
import { mergeStringIntoObjArr, stringToArr } from "./helper";

export const getName = () => resume.basics.name;

export const getFirstName = () => getName().substring(0, name.indexOf(" "));

export const getLastName = () => getName().substring(name.indexOf(" ") + 1);

export const getLabel = () => resume.basics.label;

export const getEmail = () => resume.basics.email;

export const getPhone = () => resume.basics.phone;

export const getWebsite = () => resume.basics.website;

export const getAddress = () => resume.basics.location.address;

export const getCity = () => resume.basics.location.city;

export const getRegion = () => resume.basics.location.region;

export const getSummary = () => resume.basics.summary;

export const parseSkills = () => {
  const skills = mergeStringIntoObjArr(resume.skills, "name", "keywords");
  return skills.map(skill => ({
    ...skill,
    keywords: stringToArr(skill.keywords)
  }));
};

export const parseWorkExperience = () => {
  const exps = mergeStringIntoObjArr(
    resume.work,
    "company",
    "position",
    "startDate",
    "endDate",
    "highlights"
  );
  return exps.map(exp => ({
    ...exp,
    highlights: stringToArr(exp.highlights)
  }));
};

export const parseEducation = () =>
  mergeStringIntoObjArr(resume.education, "institution", "area", "studyType");

export const parseCertificates = () =>
  mergeStringIntoObjArr(resume.certificates, "title");

export const parseLanguages = () =>
  mergeStringIntoObjArr(resume.languages, "language", "fluency");

export const parseProfiles = () =>
  mergeStringIntoObjArr(resume.basics.profiles, "network", "url", "username");
