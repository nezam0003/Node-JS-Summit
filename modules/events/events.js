const School = require("./school");
const school = new School();

school.on("bellRing", (perioud) => {
  console.log(`bellRing event happened now ${perioud} `);
});

school.startSchool();
