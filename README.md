# My Resume

### JavaScript, JQuery, Bootstrap 4, jspdf, JSON Resume, webpack

The aim is to create online resume based on JSON Resume standard (https://jsonresume.org/schema/) by preventing exposure of private personal information.

## Installation

Clone the directory

```
> git clone https://github.com/gordana16/my-resume.git
```

or

click [here](https://github.com/gordana16/my-resume/archive/master.zip) to download zip file. Once downloaded extract the zip file to your local computer.

Install dependencies by running

```
> cd my-resume
> npm install
```

## Build

Build to development environment, start application and development server:

```
> npm run dev
```

Build to production environment:

```
> npm run build
```

## Data configuration

Use environment variables to keep personal resume data secret. dotenv-webpack expects there to be a .env file to load in variables during the webpack build of bundle. .env is not comitted to Github, because for good reason it is in .gitignore.

The example of environment variables in .env:

```
NAME = Jane Doe
LABEL = SENIOR JAVA PROGRAMMER
EMAIL = jane@gmail.com
PHONE = (912) 555-4321
WEBSITE = https://jane.doe.com
SUMMARY = Lead programmer with a track record of incorporating user and business requirements into cost-effective, secure and user-friendly solutions known for scalability and durability.Innovator of next-generation solutions, systems and applications giving companies a competitive edge and producing outstanding results for customers.

ADDRESS = 20 Main Avenue
POSTAL_CODE = CA 94115
CITY = San Francisco
COUNTRY_CODE = US
REGION = California

PROFILES = twitter^http://twitter.com/jane-doe,linkedin^https://www.linkedin.com/in/jane-doe,github^https://github.com/jane-doe^gordana16

WORK = ABC COMPANY^Leading information technology and software engineering company^Lead Programmer^January 2009^Present^Develop, maintain and support application programs for administrative, Web and mobile systems using Java and related tools.|Analyze code for system testing and debugging; create test transactions to find, isolate and rectify issues; and manage a team of three programmers.,DEF COMPANY^Leading company^Programmer II / Programmer I^January 2005^December 2008^Led programming tasks including enhancements, maintenance and support for clients’ applications and interfaces.|Engineered software products, handling complex analysis and intricate programming to meet project requirements.

SKILLS = Coding^Java|C|C++/CLI|Python|Visual C++|MySQL|J2EE|C|JavaScript|AngularJS|JQuery|Bootstrap,Hard Skills^Data Collection|Software Development|Project Managament,Soft Skills^Attention to Detail|Problem Solving|Teamwork

EDUCATION = ABC UNIVERSITY^Software Development^MS in Software Engineering Candidate,ABC UNIVERSITY^^BS in Computer Information Science

CERTIFICATES = Microsoft Azure Developer Associate,Oracle Certified Professional Java SE Programmer (OCPJP)

LANGUAGES = English^Native or billingual proficiency,Spanish^Professional working proficiency
```

Each of environment variables is represented by "long" string which should be tokenized by using following delimiters: , ^ | Spaces before or after token are not allowed. If space is found, the token is disregarded.

## Deployment on Netlify

Environment variables should only be used by webpack build scripts to create content during build.When the repository is checked out by Netlify, the .env does not exist because it is in .gitignore.

Store resume data in the Netlify build environment variables and build the .env using a script prior to running the build command.

_script/create-env.js:_

```javascript
const fs = require("fs");

fs.writeFileSync(
  "./.env",
  `NAME=${process.env.NAME}\nLABEL=${process.env.LABEL}\nEMAIL=${process.env.EMAIL}\nPHONE=${process.env.PHONE}\nWEBSITE=${process.env.WEBSITE}\nSUMMARY=${process.env.SUMMARY}\nADDRESS=${process.env.ADDRESS}\nPOSTAL_CODE=${process.env.POSTAL_CODE}\nCITY=${process.env.CITY}\nCOUNTRY_CODE=${process.env.COUNTRY_CODE}\nREGION=${process.env.REGION}\nPROFILES=${process.env.PROFILES}\nWORK=${process.env.WORK}\nSKILLS=${process.env.SKILLS}\nEDUCATION=${process.env.EDUCATION}\nCERTIFICATES=${process.env.CERTIFICATES}\nLANGUAGES=${process.env.LANGUAGES}\n`
);
```

In order to deploy application on Netlify use:

npm run deploy

## Code Example

```javascript
export const mergeStringIntoObjArr = (longString, ...keys) => {
  const merged = {};
  return longString.split(/,(?!\s)/).map(str => {
    const values = str.split(/\^(?!\s)/);
    let localMerged = {};
    localMerged = keys.reduce(
      (obj, key, i) => ({ ...obj, [key]: values[i] }),
      {}
    );
    return { ...merged, ...localMerged };
  });
};

export const stringToArr = longString => {
  const result = longString.split(/\|(?!\s)/);
  return result;
};
```

The above functions are utility functions used for parsing environment variables.

```javascript
export const parseWorkExperience = () => {
  const exps = mergeStringIntoObjArr(
    resume.work,
    "company",
    "companyProfile",
    "position",
    "startDate",
    "endDate",
    "highlights"
  );
  return exps.map(exp => ({
    ...exp,
    highlights: stringToArr(exp.highlights)
  }));
};
```

For more information about JSON resume check https://jsonresume.org/schema/
