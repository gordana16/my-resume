import sizes from "./scss/index.scss";
import "bootstrap";
import "jquery-ui";
import "./createPdf/htmlToPdf";
import { resume } from "./config";
import profilePic from "./profile-pic.jpg";
import { DH_CHECK_P_NOT_SAFE_PRIME } from "constants";

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

const mergeStringIntoObjArr = (someString, objToken, ...keys) => {
  const merged = {};
  return someString.split(",").map(prop => {
    const values = prop.split(objToken);
    let localMerged = {};
    localMerged = keys.reduce(
      (obj, key, index) => ({ ...obj, [key]: values[index] }),
      {}
    );
    return { ...merged, ...localMerged };
  });
};

const profiles = mergeStringIntoObjArr(
  resume.basics.profiles,
  "&",
  "network",
  "url"
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

//skills
$.each(resume.skills, (index, skill) => {
  let $label = $(
    `<span class="badge badge-pill badge-main pl-2">${skill.name}</span>`
  );
  let $list = $("<ul class='pl-2 pl-lg-0 mr-lg-n4'></ul>");
  $.each(skill.keywords, (index, keyword) => {
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
let $jobs = $("<div class='pl-0'></div>");
$.each(resume.work, (index, exp) => {
  $(`<div class="mb-5">
  <h5>${exp.company}</h5>
  <h6>${exp.position}</h6>
  <time>${exp.startDate} - ${exp.endDate}</time>
  <p class="mt-1">${exp.highlights}</p>
</div>`).appendTo($jobs);
});
$jobs.appendTo($("#experience-list"));

//education
let $eduList = $("<div class='pl-0'></div>");
$.each(resume.education, (index, edu) => {
  $(`<div class="mb-5">
  <h5>${edu.institution}</h5>
  <h6>${edu.area}</h6>  
</div>`).appendTo($eduList);
});
$eduList.appendTo($("#education-list"));

//certificates
let $certs = $("<div class='pl-0'></div>");
$.each(resume.certificates, (index, cert) => {
  $(`<div class="mb-5">
  <h5>${cert.title}</h5> 
</div>`).appendTo($certs);
});
$certs.appendTo($("#certificates-list"));

//languages
let $languages = $("<div class='pl-0'></div>");
$.each(resume.languages, (index, l) => {
  $(`<div class="mb-5">
  <h5>${l.language}</h5> 
  <h6>${l.fluency}</h6> 
</div>`).appendTo($languages);
});
$languages.appendTo($("#languages-list"));

//gitHub repos
$.getJSON("https://api.github.com/users/gordana16/repos", gitRepos => {
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
