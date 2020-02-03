import * as jsPDF from "jspdf";
import "jspdf-autotable";
import * as parser from "../utils";

//colors
const color = {
  DARK_GREY: "#212529",
  LIGHT_GREY: "#adb5bd",
  BLUE: "#16a1b9"
};

//render one line of text to pdf with given properties of chunks which make up the line. Font size and font style should be set before the function gets called, otherwise the last set font size will be taken.
const renderTextLine = (
  doc,
  props,
  y,
  margins,
  halign,
  delim = " ",
  delimColor = color.DARK_GREY
) => {
  const chunks = props.map(prop => {
    let { contents, fontColor } = prop;
    if (typeof contents == "undefined") return y;
    if (typeof fontColor == "undefined") fontColor = color.DARK_GREY;
    return {
      contents,
      fontColor,
      width: doc.getTextWidth(prop.contents)
    };
  });

  const widths = chunks.map(chunk => chunk.width);
  const textWidth = widths.reduce(
    (total, val) => total + val,
    doc.getTextWidth(" ") * (widths.length - 1)
  );
  //horizontal alignment
  let xOffset = margins.left; //default, left
  if (halign === "center") {
    xOffset = doc.internal.pageSize.width / 2 - textWidth / 2;
  } else if (halign === "right") {
    xOffset = doc.internal.pageSize.width - margins.left - textWidth;
  }

  const lineHeight = doc.getFontSize() * doc.getLineHeightFactor();

  chunks.forEach((chunk, index) => {
    doc
      .setTextColor(chunk.fontColor)
      .setFontStyle("normal")
      .text(xOffset, y, chunk.contents);
    if (index < chunks.length - 1) {
      xOffset += chunk.width;
      doc
        .setTextColor(delimColor)
        .setFontStyle("bold")
        .text(xOffset, y, delim);
      xOffset += doc.getTextWidth(delim);
    }
  });
  return y + lineHeight;
};

//render text to pdf with given properties, takes care about adding the new page while keeping the text on the same page
const renderText = (doc, props, x, y, margins) => {
  const chunks = props.map(prop => {
    let {
      contents,
      fontName,
      fontStyle,
      fontSize,
      fontColor,
      marginBottom,
      printed
    } = prop;
    if (typeof contents == "undefined") return y;
    if (typeof fontName == "undefined") fontName = "times";
    if (typeof fontStyle == "undefined") fontStyle = "normal";
    if (typeof fontSize == "undefined") fontSize = 12;
    if (typeof fontColor == "undefined") fontColor = color.DARK_GREY;
    if (typeof marginBottom == "undefined") marginBottom = 0;
    if (typeof printed == "undefined") printed = true;

    const lines = doc.splitTextToSize(contents, margins.width, {
      fontSize,
      fontName
    });
    const lineHeight = fontSize * doc.getLineHeightFactor();
    return {
      lines,
      height: lineHeight * lines.length + marginBottom,
      fontName,
      fontStyle,
      fontSize,
      fontColor,
      printed
    };
  });
  const heights = chunks.map(chunk => chunk.height);
  const totalHeight = heights.reduce((total, val) => total + val, 0);

  if (
    y + totalHeight + 10 >
    doc.internal.pageSize.getHeight() - margins.bottom
  ) {
    doc.addPage();
    y = margins.top;
  }

  chunks.forEach(chunk => {
    if (!chunk.printed) return;
    doc
      .setFont(chunk.fontName, chunk.fontStyle)
      .setFontSize(chunk.fontSize)
      .setTextColor(chunk.fontColor)
      .text(x, y, chunk.lines);
    y += chunk.height;
  });
  return y;
};

const renderFooter = (doc, margins, contents) => {
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
    doc.text(startX, y, contents);
    doc.text(endX, y, pageLabel);
  }
};

const insertTitle = (title, fontSize, fontColor, marginBottom = 0) => {
  const props = [];
  props.push({
    contents: title,
    fontSize: fontSize,
    fontColor: fontColor,
    marginBottom: marginBottom
  });
  return props;
};

$("#pdf-icon").on("click", () => {
  const pdf = new jsPDF("p", "pt", "a4");
  pdf.setFontSize(12);
  pdf.setFont("times", "normal");
  let finalY = 0;
  const margins = {
    top: 80,
    bottom: 50,
    left: 40,
    width: pdf.internal.pageSize.getWidth() - 2 * 40
  };
  const props = [];

  const fullName = parser.getName();
  const nameArr = fullName.split(/\s+/);
  const firstName = nameArr
    .slice(0, -1)
    .join(" ")
    .toUpperCase();
  const lastName = nameArr.pop().toUpperCase();
  props.push(
    { contents: firstName, fontColor: color.BLUE },
    { contents: lastName }
  );

  pdf.setFontSize(26);
  finalY = renderTextLine(pdf, props, 50, margins, "center");

  pdf.setFontSize(12);

  props.length = 0;
  props.push(
    { contents: parser.getEmail() },
    { contents: `${parser.getAddress()}, ${parser.getCity()}` },
    { contents: parser.getPhone() }
  );

  finalY = renderTextLine(
    pdf,
    props,
    finalY,
    margins,
    "center",
    " | ",
    color.BLUE
  );

  props.length = 0;
  const profiles = parser.parseProfiles();
  const linkedIn = profiles.find(profile => profile["network"] === "linkedin")
    .url;
  const github = profiles.find(profile => profile["network"] === "github").url;
  props.push({ contents: `LinkedIn: ${linkedIn}` });
  props.push({ contents: `Github: ${github}` });
  finalY = renderTextLine(
    pdf,
    props,
    finalY,
    margins,
    "center",
    " | ",
    color.BLUE
  );

  props.length = 0;
  console.log("website", process.env);
  props.push({ contents: `Portfolio: ${parser.getWebsite()}` });
  finalY = renderTextLine(pdf, props, finalY, margins, "center");

  props.length = 0;
  props.push(...insertTitle("SUMMARY", 16, color.BLUE, 10));
  props.push({
    contents: parser.getSummary(),
    fontSize: 12,
    marginBottom: 5
  });

  const startYSummary = finalY + 70;
  finalY = renderText(pdf, props, margins.left, startYSummary, {
    ...margins,
    width: (3 / 4) * margins.width - margins.left
  });
  props.length = 0;

  props.push(...insertTitle("SKILLS", 14, color.DARK_GREY));

  //excluding finalY from calculations of vertical position during table printing
  let finalYTable = renderText(
    pdf,
    props,
    margins.left + (3 / 4) * margins.width,
    startYSummary,
    margins
  );

  const skills = parser.parseSkills();
  $.each(skills, (tableIndex, skill) => {
    let rows = [];

    $.each(skill.keywords, (rowIndex, keyword) => (rows[rowIndex] = [keyword]));
    pdf.autoTable({
      head: [[skill.name.toUpperCase()]],
      body: rows,
      startY: finalYTable - 10,
      margin: { left: margins.left + (3 / 4) * margins.width },
      headStyles: {
        font: "times",
        fontStyle: "bold",
        fontSize: 9,
        textColor: [255, 255, 255],
        fillColor: [22, 161, 185],
        halign: "center"
      },
      styles: {
        font: "times",
        cellPadding: 3,
        cellWidth: margins.width / 4,
        halign: "center",
        fillColor: [248, 249, 250],
        textColor: [0, 0, 0]
      },
      alternateRowStyles: {
        fillColor: [248, 249, 250]
      }
    });
    finalYTable = pdf.previousAutoTable.finalY + 10;
  });

  let finalTableCriticalY = pdf.previousAutoTable.finalY + 30;

  //work experience
  const jobs = parser.parseWorkExperience();
  $.each(jobs, (index, job) => {
    props.length = 0;
    if (index == 0) {
      props.push(...insertTitle("EXPERIENCE", 16, color.BLUE, 10));
    }
    props.push({
      contents: job.company,
      fontSize: 14,
      fontStyle: "bold"
    });
    if (job.companyProfile) {
      props.push({
        contents: job.companyProfile,
        fontSize: 12,
        marginBottom: 3
      });
    }
    props.push(
      {
        contents: job.position,
        fontSize: 12,
        fontStyle: "bold",
        marginBottom: 3
      },
      {
        contents: `${job.startDate} - ${job.endDate}`,
        fontSize: 12,
        marginBottom: 10
      }
    );

    let jobsMargins =
      finalY < finalTableCriticalY
        ? { ...margins, width: (3 / 4) * margins.width - margins.left }
        : margins;

    let startY = 0;

    const highlights = job.highlights;
    let highlightsMargins = { ...jobsMargins, width: jobsMargins.width - 20 }; // -20 because we will insert a bullet

    highlights.forEach((highlight, i) => {
      props.push({
        contents: `${highlight}`,
        fontSize: 12,
        marginBottom:
          i < highlights.length - 1 ? 2 : index === jobs.length - 1 ? 0 : 30,
        printed: i == 0 ? false : true
      });
      if (i == 0) {
        startY = index === 0 ? finalY + 30 : finalY;
        finalY = renderText(pdf, props, margins.left, startY, jobsMargins);
        while (props.length > 1) {
          //only first highlight left in array
          props.shift();
        }
        props[0].printed = true;
      }

      //table is passed by || new page
      if (
        finalTableCriticalY > 0 &&
        (finalY > finalTableCriticalY || finalY < startY)
      ) {
        finalTableCriticalY = 0;
        highlightsMargins = {
          ...margins,
          width: margins.width - 20 // -20 because we will insert a bullet
        };
      }

      startY = finalY;
      finalY = renderText(
        pdf,
        props,
        margins.left + 20,
        startY,
        highlightsMargins
      );
      //add bullet
      pdf
        .setFont("zapfdingbats")
        .setFontSize(8)
        .text(margins.left, finalY < startY ? margins.top : startY, "l");
      props.length = 0;
    });
  });

  //education
  const education = parser.parseEducation();
  props.length = 0;
  props.push(...insertTitle("EDUCATION", 16, color.BLUE, 10));
  $.each(education, (index, edu) => {
    props.push({
      contents: `${edu.institution}${edu.area ? `, ${edu.area}` : ""}`,
      fontSize: 12,
      fontStyle: "bold"
    });
    props.push({
      contents: edu.studyType,
      fontSize: 12,
      marginBottom: index === education.length - 1 ? 0 : 10
    });
  });
  finalY = renderText(pdf, props, margins.left, finalY + 30, margins);

  //certificates
  const certificates = parser.parseCertificates();
  props.length = 0;
  props.push(...insertTitle("CERTIFICATES", 16, color.BLUE, 10));
  $.each(certificates, (index, cert) => {
    props.push({
      contents: cert.title,
      fontSize: 12,
      fontStyle: "bold",
      marginBottom: index === certificates.length - 1 ? 0 : 5
    });
  });
  finalY = renderText(pdf, props, margins.left, finalY + 30, margins);

  //LANGUAGES
  const languages = parser.parseLanguages();
  props.length = 0;
  props.push(...insertTitle("LANGUAGES", 16, color.BLUE, 10));
  $.each(languages, (index, lang) => {
    props.push({
      contents: lang.language,
      fontSize: 12,
      fontStyle: "bold"
    });
    props.push({
      contents: lang.fluency,
      marginBottom: index == languages.length - 1 ? 0 : 5
    });
  });
  finalY = renderText(pdf, props, margins.left, finalY + 30, margins);

  renderFooter(pdf, margins, name);

  pdf.save(`${fullName.replace(/ /g, "")}-CV.pdf`);
});
