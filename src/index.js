import "./scss/index.scss";
import "bootstrap";
import "jquery-ui";
import * as parser from "./utils";
import "./createPdf/htmlToPdf";

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
$("#basic-summary").html(parser.getSummary());
$(".name").html(parser.getName());
$("#label").html(parser.getLabel());
$("#email").html(parser.getEmail());
$("#phone").html(parser.getPhone());

const profiles = parser.parseProfiles();
profiles.push({ network: "email", url: `mailto:${parser.getEmail()}` });

$(".icons a").on("click", function() {
  const networkClass = this.className;
  this.href = profiles.find(profile => profile["network"] === networkClass).url;
});

$(".mail").on("click", function() {
  this.href = `mailto:${parser.getEmail()}`;
});

$("#address").html(parser.getAddress());
$("#city").html(parser.getCity());
$("#region").html(parser.getRegion());
$("#github-t").html(
  profiles.find(profile => profile["network"] === "github").url
);
$("#linkedIn-t").html(
  profiles.find(profile => profile["network"] === "linkedin").url
);

//skills
const skills = parser.parseSkills();
$.each(skills, (index, skill) => {
  let $label = $(
    `<span class="badge badge-pill badge-main pl-2 mr-lg-4">${skill.name}</span>`
  );
  let $list = $("<ul class='pl-2 pl-lg-0 mr-lg-n4'></ul>");
  $.each(skill.keywords, (index, keyword) => {
    $(
      `<li class="py-lg-1"><span class="px-lg-1">${keyword}</span></li>`
    ).appendTo($list);
  });

  let $skills = $(`<div class="col-12 col-md-4 col-lg-12 pl-2 pl-lg-3">
<div class="row align-items-center py-lg-3 mr-lg-n4">
  <div class="skills-badge col-12 col-lg-5 px-lg-0 ml-lg-n4 ml-xl-n3 mr-lg-n4 mb-lg-4 order-lg-last">  
  </div>
  <div class='skills-list col-12 col-lg-7 order-lg-first'> 
  </div>
</div>
</div>`);
  $label.appendTo($skills.find(".skills-badge"));
  $list.appendTo($skills.find(".skills-list"));
  $skills.appendTo($(".skills"));
});

$(".skills-list ul li:nth-child(odd)").addClass("alternate-odd");

//work-experience
const work = parser.parseWorkExperience();
let $jobs = $("#experience-list");
$.each(work, (index, exp) => {
  const highlights = exp.highlights.map(
    highlight => `<li class="mt-1 mb-0">${highlight}</li>`
  );
  $(`<div class="mb-3">
  <h5>${exp.company}</h5>
  <h6>${exp.position}</h6>
  <p class="start-end-date mb-0">${exp.startDate} - ${exp.endDate}</p>
  <ul>
  ${highlights.join(" ")}
  </ul>
  </div>`).appendTo($jobs);
});
$jobs.appendTo($("#experience"));

//education
const education = parser.parseEducation();

let $eduList = $("#education-list");
$.each(education, (index, edu) => {
  $(`<div class="mb-3">
  <h5>${edu.studyType}, ${edu.area}</h5> 
  <h6>${edu.institution}</h6>  
  </div>`).appendTo($eduList);
});
$eduList.appendTo($("#education"));

//certificates
const certificates = parser.parseCertificates();
let $certs = $("#certificates-list");
$.each(certificates, (index, cert) => {
  $(`<h5>${cert.title}</h5>`).appendTo($certs);
});
$certs.appendTo($("#certificates"));

//languages
const languages = parser.parseLanguages();
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
    $(`<div class="col-md-6 d-flex">
      <div class="card mb-4 flex-fill bg-side">
        <div class="card-body d-flex flex-column justify-content-between">
        <div class="mb-3">
        <h5 class="card-title">${repo.name}</h5>
        <p class="card-text">${repo.description || ""}</p>    
        </div>         
          <a href=${
            repo.html_url
          } class="btn btn-main align-self-start" target="_blank">See repo</a>
        </div>
      </div>
    </div>
    `).appendTo($repos);
  });

  $repos.appendTo($("#github"));
});
