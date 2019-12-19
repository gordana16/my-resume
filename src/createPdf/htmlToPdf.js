import * as jsPDF from "jspdf";
import "jspdf-autotable";
import * as resume from "../resume.json";
import "./fonts/Lato-Regular";
import "./fonts/Lato-Thin";
import "./fonts/Lato-Bold";

$("#pdf-icon").on("click", function() {
  const pdf = new jsPDF("p", "pt", "a4");

  let finalY = 0;
  const specialElementHandlers = {
    // element with id of "bypass" - jQuery style selector
    "#table-ignore": () => true
  };

  pdf.setFont("Lato-Regular");
  pdf.setFontType("normal");
  pdf.setTextColor("#16a1b9");
  pdf.setFontSize(28);
  const text = pdf.text(40, 80, resume.basics.name.toUpperCase());
  pdf.setTextColor("#495057");
  pdf.setFont("Lato-Thin");
  pdf.setFontSize(24);
  pdf.text(40, 120, resume.basics.label.toUpperCase());

  const margins = {
    top: 80,
    bottom: 50,
    left: 40,
    width: 522
  };
  pdf.setFont("Lato-Regular");
  pdf.fromHTML(
    $("#basic-summary")[0], // HTML string or DOM elem ref.
    margins.left, // x coord
    margins.top + 80,
    {
      // y coord
      width: margins.width // max width of content on PDF
    },

    function(dispose) {
      finalY = dispose.y;
    }
  );

  pdf.autoTable({
    html: "#my-table-1",
    startY: finalY + 20,
    margin: { right: 305 },
    styles: { font: "Lato-Regular" }
  });
  pdf.autoTable({
    html: "#my-table-2",
    startY: finalY + 20,
    margin: { left: 305 },
    styles: { font: "Lato-Regular" }
  });

  finalY = pdf.previousAutoTable.finalY;
  pdf.setTextColor("#16a1b9");
  pdf.setFontSize(20);
  pdf.text(40, finalY + 50, "PROFESSIONAL SKILLS");
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
    startY: finalY + 70,
    headStyles: { font: "Lato-Bold" },
    styles: { font: "Lato-Regular" }
  });

  pdf.addPage();
  finalY = 100;
  pdf.text(40, 80, "EXPERIENCE");
  pdf.fromHTML(
    $("#experience-list")[0], // HTML string or DOM elem ref.
    margins.left, // x coord
    finalY,
    {
      // y coord
      width: margins.width // max width of content on PDF
    },

    function(dispose) {
      finalY = dispose.y;
    },
    margins
  );
  pdf.save("Test.pdf");
});
