import sizes from "./scss/index.scss";
import "bootstrap";
import "jquery-ui";
import "./createPdf/htmlToPdf";
import { resume } from "./config";
import { mergeStringIntoObjArr, stringToArr } from "./utils";
import profilePic from "./profile-pic.jpg";

if ($(window).outerWidth() >= parseInt(sizes.lg)) {
  $("#skills-title").wrap("<h4></h4>");
} else {
  $("#skills-title").wrap("<h3></h3>");
}

$("body").css("padding-top", $(".navbar").outerHeight());

//smooth scrolling
$(".nav-link").on("click", function() {
  var $anchor = $(this);
  $("html, body").animate(
    {
      scrollTop: $($anchor.attr("href")).offset().top - 75
    },
    800,
    "easeInOutExpo"
  );
  event.preventDefault();
});

$(".nav-link").on("click", function() {
  $(".navbar-collapse").collapse("hide");
});

//summary
$("#profile-pic").attr("src", profilePic);
$("#basic-summary").html(resume.basics.summary);
$(".name").html(resume.basics.name);
$("#label").html(resume.basics.label);
$("#email").html(resume.basics.email);
$("#phone").html(resume.basics.phone);

const profiles = mergeStringIntoObjArr(
  resume.basics.profiles,
  "network",
  "url",
  "username"
);
profiles.push({ network: "email", url: `mailto:${resume.basics.email}` });

$(".icons a").on("click", function() {
  const networkClass = this.className;
  this.href = profiles.find(profile => profile["network"] === networkClass).url;
});

$(".mail").on("click", function() {
  this.href = `mailto:${resume.basics.email}`;
});

$("#address").html(resume.basics.location.address);
$("#city").html(resume.basics.location.city);
$("#region").html(resume.basics.location.region);
$("#github-t").html(
  profiles.find(profile => profile["network"] === "github").url
);
$("#linkedIn-t").html(
  profiles.find(profile => profile["network"] === "linkedin").url
);

//skills
const skills = mergeStringIntoObjArr(resume.skills, "name", "keywords");
$.each(skills, (index, skill) => {
  let $label = $(
    `<span class="badge badge-pill badge-main pl-2">${skill.name}</span>`
  );
  let $list = $("<ul class='pl-2 pl-lg-0 mr-lg-n4'></ul>");
  $.each(stringToArr(skill.keywords), (index, keyword) => {
    $(`<li><span>${keyword}</span></li>`).appendTo($list);
  });

  let $skills = $(`<div class="col-12 col-md-4 col-lg-12 pl-2 pl-lg-3">
<div class="row align-items-center py-lg-4 mr-lg-n4">
  <div class="skills-badge col-12 col-lg-5 px-lg-0 ml-lg-n4 ml-xl-n3 mr-lg-n3 mb-lg-4 order-lg-last">  
  </div>
  <div class='skills-list col-12 col-lg-7 order-lg-first'> 
  </div>
</div>
</div>`);
  $label.appendTo($skills.find(".skills-badge"));
  $list.appendTo($skills.find(".skills-list"));
  $skills.appendTo($("#skills-list"));
});

$(".skills-list ul li:nth-child(odd)").addClass("alternate-odd");

//work-experience
const work = mergeStringIntoObjArr(
  resume.work,
  "company",
  "position",
  "startDate",
  "endDate",
  "highlights"
);
let $jobs = $("#experience-list");
$.each(work, (index, exp) => {
  const highlights = stringToArr(exp.highlights).map(
    highlight => `<p class="mt-1 mb-0">${highlight}</p>`
  );
  $(`<div class="mb-3">
  <h5>${exp.company}</h5>
  <h6>${exp.position}</h6>
  <p class="start-end mb-0">${exp.startDate} - ${exp.endDate}</p>
  ${highlights.join(" ")} 
  </div>`).appendTo($jobs);
});
$jobs.appendTo($("#experience"));

//education
const education = mergeStringIntoObjArr(
  resume.education,
  "institution",
  "area",
  "studyType"
);

let $eduList = $("#education-list");
$.each(education, (index, edu) => {
  $(`<div class="mb-3">
  <h5>${edu.studyType}, ${edu.area}</h5> 
  <h6>${edu.institution}</h6>  
  </div>`).appendTo($eduList);
});
$eduList.appendTo($("#education"));

//certificates
const certificates = mergeStringIntoObjArr(resume.certificates, "title");
let $certs = $("#certificates-list");
$.each(certificates, (index, cert) => {
  $(`<h5>${cert.title}</h5>`).appendTo($certs);
});
$certs.appendTo($("#certificates"));

//languages
const languages = mergeStringIntoObjArr(
  resume.languages,
  "language",
  "fluency"
);
let $languages = $("#languages-list");
$.each(languages, (index, l) => {
  $(`<div class="mb-3">
  <h5>${l.language}</h5> 
  <h6>${l.fluency}</h6> 
</div>`).appendTo($languages);
});
$languages.appendTo($("#languages"));

//gitHub repos
const username = profiles.find(profile => profile["network"] === "github")
  .username;
$.getJSON(`https://api.github.com/users/${username}/repos`, gitRepos => {
  let $repos = $(`<div class="row mt-4"></div>`);
  const actualRepos = gitRepos
    .filter(repo => !repo.archived)
    .sort((r1, r2) => {
      return new Date(r2.created_at) - new Date(r1.created_at);
    });
  $.each(actualRepos, (index, repo) => {
    $(`<div class="col-md-6">
    <div class="card mb-4 bg-side">
    <div class="card-body">
        <h5 class="card-title">${repo.name}</h5>
        <p class="card-text">${repo.description || ""}</p>
        <a href=${
          repo.html_url
        } class="btn btn-main" target="_blank">See repo</a>
      </div>
    </div>
    </div>
    `).appendTo($repos);
  });

  $repos.appendTo($("#github"));
});
