import * as jsPDF from "jspdf";
import { resume } from "../config";
import parser from "../ResumeParser";
import { mergeStringIntoObjArr, stringToArr } from "../utils";
import "jspdf-autotable";
import "./fonts/EBGaramond-bold";
import "./fonts/EBGaramond-normal";
import "./fonts/CormorantGaramond-normal";
import "./fonts/CormorantGaramond-bold";
import ResumeParser from "../ResumeParser";

//colors
const color = {
  DARK_GREY: "#212529",
  LIGHT_GREY: "#adb5bd",
  BLUE: "#16a1b9"
};

//fonts
const font = {
  REGULAR: "EBGaramond",
  LIGHT: "CormorantGaramond"
};

const renderText = (doc, props, y, margins) => {
  const details = props.map(prop => {
    let {
      contents,
      fontType,
      fontStyle,
      fontSize,
      fontColor,
      marginBottom
    } = prop;
    if (typeof contents == "undefined") return y;
    if (typeof fontType == "undefined") fontType = font.REGULAR;
    if (typeof fontStyle == "undefined") fontStyle = "normal";
    if (typeof fontSize == "undefined") fontSize = doc.getFontSize();
    if (typeof fontColor == "undefined") fontColor = color.DARK_GREY;
    if (typeof marginBottom == "undefined") marginBottom = 0;

    const lines = doc.splitTextToSize(contents, margins.width, {
      fontSize: fontSize
    });
    const lineHeight = fontSize * doc.getLineHeightFactor();
    return {
      lines: lines,
      height: lineHeight * lines.length + marginBottom,
      fontType: fontType,
      fontStyle: fontStyle,
      fontSize: fontSize,
      fontColor: fontColor
    };
  });
  const heights = details.map(detail => detail.height);
  const totalHeight = heights.reduce((total, val) => total + val, 0);

  if (
    y + totalHeight + 10 >
    doc.internal.pageSize.getHeight() - margins.bottom
  ) {
    doc.addPage();
    y = margins.top;
  }

  details.forEach(detail => {
    doc
      .setFont(detail.fontType, detail.fontStyle)
      .setFontSize(detail.fontSize)
      .setTextColor(detail.fontColor)
      .text(margins.left, y, detail.lines);
    y += detail.height;
  });
  return y;
};

const renderFooter = (doc, margins, content) => {
  const pageCount = doc.internal.getNumberOfPages();
  doc.setFontSize(10).setTextColor(color.LIGHT_GREY);
  for (let i = 1; i <= pageCount; i++) {
    const startX = margins.left;
    const endX = startX + margins.width;
    const y = doc.internal.pageSize.getHeight() - margins.bottom;

    doc.line(startX, y, margins.left + margins.width, y); // draw a line

    const pageLabel = `Page ${i} of ${pageCount}`;
    endX -= doc.getTextWidth(pageLabel);
    y += margins.bottom / 2;
    doc.setPage(i);
    doc.text(startX, y, content);
    doc.text(endX, y, pageLabel);
  }
};

$("#pdf-icon").on("click", () => {
  const pdf = new jsPDF("p", "pt", "a4");
  pdf.setFontSize(14);
  pdf.setFont(font.REGULAR, "normal");
  let finalY = 0;
  const margins = {
    top: 80,
    bottom: 50,
    left: 40,
    width: pdf.internal.pageSize.getWidth() - 2 * 40
  };

  const props = [];

  const name = resume.basics.name;
  props.push({
    contents: name.toUpperCase(),
    fontSize: 28,
    fontColor: color.BLUE,
    marginBottom: 5
  });

  props.push({
    contents: resume.basics.label.toUpperCase(),
    fontSize: 24,
    fontColor: color.LIGHT_GREY,
    fontType: font.LIGHT,
    marginBottom: 10
  });

  props.push({
    contents: resume.basics.summary,
    fontSize: 14,
    marginBottom: 5
  });

  finalY = renderText(pdf, props, margins.top, margins);

  pdf.autoTable({
    html: "#my-table-1",
    startY: finalY + 10,
    // margin: { right: 305 },
    margin: { right: margins.width / 2 + margins.left + 10 },
    styles: { font: font.REGULAR, fontStyle: "normal" }
  });
  pdf.autoTable({
    html: "#my-table-2",
    startY: finalY + 10,
    margin: { left: margins.width / 2 + margins.left + 10 },
    styles: { font: font.REGULAR, fontStyle: "normal" }
  });

  finalY = pdf.previousAutoTable.finalY;
  props.length = 0;
  props.push({
    contents: "PROFESSIONAL SKILLS",
    fontSize: 18,
    fontColor: color.BLUE,
    marginBottom: 0
  });

  finalY = renderText(pdf, props, finalY + 40, margins);

  let columns = [];
  let rows = [];
  const skills = parser.getSkills();
  $.each(skills, (columnIndex, skill) => {
    columns.push(skill.name.toUpperCase());
    $.each(stringToArr(skill.keywords), (rowIndex, keyword) => {
      if (!rows[rowIndex]) rows[rowIndex] = [];
      rows[rowIndex][columnIndex] = keyword;
    });
  });

  pdf.autoTable({
    head: [columns],
    body: rows,
    startY: finalY,
    headStyles: { font: font.REGULAR, fontStyle: "bold" },
    styles: { font: font.REGULAR, fontStyle: "normal" }
  });

  finalY = pdf.previousAutoTable.finalY;

  const jobs = parser.getWorkExperience();
  $.each(jobs, (index, job) => {
    props.length = 0;
    if (index == 0) {
      props.push({
        contents: "EXPERIENCE",
        fontSize: 18,
        fontColor: color.BLUE,
        marginBottom: 10
      });
    }
    props.push({
      contents: job.company,
      fontSize: 16,
      fontStyle: "bold"
    });
    props.push({ contents: job.position, fontSize: 14 });
    props.push({
      contents: `${job.startDate} - ${job.endDate}`,
      fontSize: 12,
      marginBottom: 5
    });
    const highlights = stringToArr(job.highlights);
    highlights.forEach((highlight, i) =>
      props.push({
        contents: highlight,
        fontSize: 14,
        marginBottom:
          index == jobs.length - 1 ? 0 : i < highlights.length - 1 ? 0 : 10
      })
    );
    const startY = index > 0 ? finalY : finalY + 40;
    finalY = renderText(pdf, props, startY, margins);
  });

  //education
  const education = parser.getEducation();
  props.length = 0;
  props.push({
    contents: "EDUCATION",
    fontSize: 18,
    fontColor: color.BLUE,
    marginBottom: 10
  });
  $.each(education, (index, edu) => {
    props.push({
      contents: `${edu.institution}, ${edu.area}`,
      fontSize: 14,
      fontStyle: "bold"
    });
    props.push({
      contents: edu.studyType,
      fontSize: 14,
      marginBottom: index == education.length - 1 ? 0 : 5
    });
  });
  finalY = renderText(pdf, props, finalY + 30, margins);

  //certificates
  const certificates = parser.getCertificates();
  props.length = 0;
  props.push({
    contents: "CERTIFICATES",
    fontSize: 18,
    fontColor: color.BLUE,
    marginBottom: 10
  });
  $.each(certificates, (index, cert) => {
    props.push({
      contents: cert.title,
      fontSize: 14,
      fontStyle: "bold",
      marginBottom: index == certificates.length - 1 ? 0 : 5
    });
  });
  finalY = renderText(pdf, props, finalY + 30, margins);

  //LANGUAGES
  const languages = parser.getLanguages();
  props.length = 0;
  props.push({
    contents: "LANGUAGES",
    fontSize: 18,
    fontColor: color.BLUE,
    marginBottom: 10
  });
  $.each(languages, (index, lang) => {
    props.push({
      contents: lang.language,
      fontSize: 14,
      fontStyle: "bold"
    });
    props.push({
      contents: lang.fluency,
      marginBottom: index == languages.length - 1 ? 0 : 5
    });
  });
  finalY = renderText(pdf, props, finalY + 30, margins);

  renderFooter(pdf, margins, name);

  pdf.save(`${name.replace(/ /g, "")}-CV.pdf`);
});
