import * as jsPDF from "jspdf";
import "jspdf-autotable";
import * as resume from "../resume.json";
import "./fonts/Lato-Regular";
import "./fonts/Lato-Thin";
import "./fonts/Lato-Bold";

const renderHtml = (doc, $tag, y, margins) => {
  let endY;
  doc.fromHTML(
    $tag, // HTML string or DOM elem ref.
    margins.left, // x coord
    y, // y coord
    {
      width: margins.width // max width of content on PDF
    },
    dispose => {
      endY = dispose.y;
    }
  );
  return endY;
};

const renderTitle = (doc, content, y, margins) => {
  const lineHeight = doc.getLineHeight(content) / doc.internal.scaleFactor;
  if (
    y +
      doc.getLineHeight(content) / doc.internal.scaleFactor +
      3 * margins.bottom >
    doc.internal.pageSize.getHeight()
  ) {
    doc.addPage();
    y = margins.top;
  }
  doc.text(margins.left, y, content);

  return y + lineHeight;
};

const renderFooter = (doc, margins, content) => {
  const pageCount = doc.internal.getNumberOfPages();
  doc.setTextColor("#adb5bd");
  doc.setFontSize(10);
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
  let finalY = 0;

  const margins = {
    top: 80,
    bottom: 50,
    left: 40,
    width: 522
  };
  const name = resume.basics.name;

  pdf.setFont("Lato-Regular");
  pdf.setFontType("normal");
  pdf.setTextColor("#16a1b9");
  pdf.setFontSize(28);
  finalY = renderTitle(pdf, name.toUpperCase(), margins.top, margins);
  pdf.setTextColor("#495057");
  pdf.setFont("Lato-Thin");
  pdf.setFontSize(24);
  finalY = renderTitle(
    pdf,
    resume.basics.label.toUpperCase(),
    finalY + 5,
    margins
  );

  pdf.setFont("Lato-Regular");
  finalY = renderHtml(pdf, $("#basic-summary")[0], finalY - 10, margins);

  pdf.autoTable({
    html: "#my-table-1",
    startY: finalY + 10,
    margin: { right: 305 },
    styles: { font: "Lato-Regular" }
  });
  pdf.autoTable({
    html: "#my-table-2",
    startY: finalY + 10,
    margin: { left: 305 },
    styles: { font: "Lato-Regular" }
  });

  finalY = pdf.previousAutoTable.finalY;
  pdf.setTextColor("#16a1b9");
  pdf.setFontSize(20);
  finalY = renderTitle(pdf, "PROFESSIONAL SKILLS", finalY + 50, margins);

  let columns = [];
  let rows = [];
  $.each(resume.skills, (columnIndex, skill) => {
    columns.push(skill.name.toUpperCase());
    $.each(skill.keywords, (rowIndex, keyword) => {
      if (!rows[rowIndex]) rows[rowIndex] = [];
      rows[rowIndex][columnIndex] = keyword;
    });
  });

  pdf.autoTable({
    head: [columns],
    body: rows,
    startY: finalY,
    headStyles: { font: "Lato-Bold" },
    styles: { font: "Lato-Regular" }
  });

  finalY = pdf.previousAutoTable.finalY;
  finalY = renderTitle(pdf, "EXPERIENCE", finalY + 50, margins);
  finalY = renderHtml(pdf, $("#experience-list")[0], finalY - 10, margins);

  finalY = renderTitle(pdf, "EDUCATION", finalY + 50, margins);
  finalY = renderHtml(pdf, $("#education-list")[0], finalY - 10, margins);

  finalY = renderTitle(pdf, "CERTIFICATES", finalY + 50, margins);
  finalY = renderHtml(pdf, $("#certificates-list")[0], finalY - 10, margins);

  finalY = renderTitle(pdf, "LANGUAGES", finalY + 50, margins);
  finalY = renderHtml(pdf, $("#languages-list")[0], finalY - 10, margins);

  renderFooter(pdf, margins, name);

  pdf.save(`${name.replace(/ /g, "")}-CV.pdf`);
});
