const fs = require("fs");

fs.writeFileSync(
  "./.env",
  `NAME=${process.env.NAME}\nLABEL=${process.env.LABEL}\nEMAIL=${process.env.EMAIL}\nPHONE=${process.env.PHONE}\nWEBSITE=${process.env.WEBSITE}\nSUMMARY=${process.env.SUMMARY}\nADDRESS=${process.env.ADDRESS}\nPOSTAL_CODE=${process.env.POSTAL_CODE}\nCITY=${process.env.CITY}\nCOUNTRY_CODE=${process.env.COUNTRY_CODE}\nREGION=${process.env.REGION}\nPROFILES=${process.env.PROFILES}\nWORK=${process.env.WORK}\nSKILLS=${process.env.SKILLS}\nEDUCATION=${process.env.EDUCATION}\nCERTIFICATES=${process.env.CERTIFICATES}\nLANGUAGES=${process.env.LANGUAGES}\n`
);
