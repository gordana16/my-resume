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

  getSkills() {
    return mergeStringIntoObjArr(resume.skills, "name", "keywords");
  }

  getWorkExperience() {
    return mergeStringIntoObjArr(
      resume.work,
      "company",
      "position",
      "startDate",
      "endDate",
      "highlights"
    );
  }

  getEducation() {
    return mergeStringIntoObjArr(
      resume.education,
      "institution",
      "area",
      "studyType"
    );
  }

  getCertificates() {
    return mergeStringIntoObjArr(resume.certificates, "title");
  }

  getLanguages() {
    return mergeStringIntoObjArr(resume.languages, "language", "fluency");
  }
}
export default new ResumeParser();
