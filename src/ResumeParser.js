import { resume } from "./config";
import { mergeStringIntoObjArr, stringToArr } from "./utils";

let instance;

class ResumeParser {
  constructor() {
    if (instance) {
      return instance;
    }
    instance = this;
  }

  parseName() {
    return resume.basics.name;
  }

  getFirstName() {
    const name = resume.basics.name;
    return name.substring(0, name.indexOf(" "));
  }

  getLastName() {
    const name = resume.basics.name;
    return name.substring(name.indexOf(" ") + 1);
  }

  parseLabel() {
    return resume.basics.label;
  }
  getEmail() {
    return resume.basics.email;
  }

  getPhone() {
    return resume.basics.phone;
  }

  getWebsite() {
    return resume.basics.website;
  }

  getAddress() {
    return resume.basics.location.address;
  }
  getCity() {
    return resume.basics.location.city;
  }

  parseSummary() {
    return resume.basics.summary;
  }

  parseSkills() {
    const skills = mergeStringIntoObjArr(resume.skills, "name", "keywords");
    return skills.map(skill => ({
      ...skill,
      keywords: stringToArr(skill.keywords)
    }));
  }

  parseWorkExperience() {
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
  }

  parseEducation() {
    return mergeStringIntoObjArr(
      resume.education,
      "institution",
      "area",
      "studyType"
    );
  }

  parseCertificates() {
    return mergeStringIntoObjArr(resume.certificates, "title");
  }

  parseLanguages() {
    return mergeStringIntoObjArr(resume.languages, "language", "fluency");
  }

  parseProfiles() {
    return mergeStringIntoObjArr(
      resume.basics.profiles,
      "network",
      "url",
      "username"
    );
  }
}
export default new ResumeParser();
