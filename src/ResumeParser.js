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

  parseLabel() {
    return resume.basics.label;
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
}
export default new ResumeParser();
