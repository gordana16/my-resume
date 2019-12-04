import "./scss/index.scss";
import * as resume from "./resume.json";
import profilePic from "./profile-pic.jpg";

$("#profile-pic").attr("src", profilePic);

$("#basics-summary").html(resume.basics.summary);
$(".name").html(resume.basics.name);
$("#label").html(resume.basics.label);
$("#email").html(resume.basics.email);
$("#phone").html(resume.basics.phone);
$("#address").html(resume.basics.location.address);
$("#city").html(resume.basics.location.city);
$("#region").html(resume.basics.location.region);

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
  $skills.appendTo($("#skills-header"));
});

$(".skills-list ul li:nth-child(odd)").addClass("alternate-odd");
