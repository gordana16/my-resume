export const resume = {
  basics: {
    name: process.env.NAME,
    label: process.env.LABEL,
    picture: "",
    email: process.env.EMAIL,
    phone: process.env.PHONE,
    website: "",
    summary: process.env.SUMMARY,
    location: {
      address: process.env.ADDRESS,
      postalCode: process.env.POSTAL_CODE,
      city: process.env.CITY,
      countryCode: process.env.COUNTRY_CODE,
      region: process.env.REGION
    },
    profiles: process.env.PROFILES
  },
  work: [
    {
      company: "Company-2",
      position: "Senior Software Engineer",
      website: "",
      startDate: "January 2013",
      endDate: "December 2015",
      summary: "",
      highlights: [
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Habitasse platea dictumst quisque sagittis purus. Libero id faucibus nisl tincidunt eget nullam non nisi. In iaculis nunc sed augue lacus. Nibh cras pulvinar mattis nunc. Ultricies lacus sedturpis tincidunt id aliquet risus. Tristique nulla aliquet enim tortor at auctor urna nunc."
      ]
    },
    {
      company: "Company-1",
      position: "Software Developer",
      website: "",
      startDate: "February 2010",
      endDate: "December 2012",
      summary: "",
      highlights: [
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Habitasse platea dictumst quisque sagittis purus. Libero id faucibus nisl tincidunt eget nullam non nisi. In iaculis nunc sed augue lacus. Nibh cras pulvinar mattis nunc. Ultricies lacus sedturpis tincidunt id aliquet risus. Tristique nulla aliquet enim tortor at auctor urna nunc."
      ]
    },
    {
      company: "Company-3",
      position: "Software Developer",
      website: "",
      startDate: "April 2007",
      endDate: "November 2009",
      summary: "",
      highlights: [
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Habitasse platea dictumst quisque sagittis purus. Libero id faucibus nisl tincidunt eget nullam non nisi. In iaculis nunc sed augue lacus. Nibh cras pulvinar mattis nunc. Ultricies lacus sedturpis tincidunt id aliquet risus. Tristique nulla aliquet enim tortor at auctor urna nunc."
      ]
    }
  ],

  education: [
    {
      institution: "University of California",
      area: "Software Development",
      studyType: "Bachelor of Science",
      startDate: "2011-01-01",
      endDate: "2013-01-01",
      gpa: "",
      courses: []
    }
  ],

  skills: [
    {
      name: "Coding",
      keywords: [
        "HTML5 & CSS3",
        "Bootstrap 4",
        "Javascript",
        "React & Redux",
        "jQuery",
        "NodeJS",
        "Webpack",
        "MongoDB"
      ]
    },
    {
      name: "Hard Skills",
      keywords: [
        "Data Collection",
        "Data Analysis",
        "Design and Implementation"
      ]
    },
    {
      name: "Soft Skills",
      keywords: ["Attention to Detail", "Problem Solving", "Teamwork"]
    }
  ],
  certificates: [
    {
      title: "Microsoft Azure Developer Associate",
      date: "April 2015",
      expires: ""
    }
  ],
  languages: [
    {
      language: "English",
      fluency: "Native speaker"
    }
  ]
};
