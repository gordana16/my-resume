export const resume = {
  basics: {
    name: process.env.NAME,
    label: process.env.LABEL,
    email: process.env.EMAIL,
    phone: process.env.PHONE,
    website: process.env.WEBSITE,
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

  work: process.env.WORK,

  skills: process.env.SKILLS,
  education: process.env.EDUCATION,
  certificates: process.env.CERTIFICATES,
  languages: process.env.LANGUAGES
};
