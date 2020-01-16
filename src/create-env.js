const fs = require("fs");
fs.writeFileSync(
  "./.env",
  `NAME=${process.env.NAME}\nLABEL=${process.env.LABEL}\nEMAIL=${process.env.EMAIL}\n`
);
