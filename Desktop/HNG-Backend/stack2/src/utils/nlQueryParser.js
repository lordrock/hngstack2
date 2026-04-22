const countryMap = {
  nigeria: "NG",
  kenya: "KE",
  angola: "AO",
  benin: "BJ",
  cameroon: "CM",
  ghana: "GH",
  uganda: "UG",
  tanzania: "TZ",
  rwanda: "RW",
  ethiopia: "ET",
  "south africa": "ZA",
  egypt: "EG"
};

const parseNaturalLanguageQuery = (query) => {
  if (!query || typeof query !== "string" || query.trim() === "") {
    return null;
  }

  const text = query.toLowerCase().trim();
  const filters = {};
  let matchedSomething = false;

  // Gender parsing
  const hasMale = text.includes("male") || text.includes("males");
  const hasFemale = text.includes("female") || text.includes("females");

  if (hasMale && !hasFemale) {
    filters.gender = /^male$/i;
    matchedSomething = true;
  }

  if (hasFemale && !hasMale) {
    filters.gender = /^female$/i;
    matchedSomething = true;
  }

  // If both male and female are present, do not set a gender filter,
  // because it means both are acceptable.
  if (hasMale && hasFemale) {
    matchedSomething = true;
  }

  // Age group parsing
  if (text.includes("child") || text.includes("children")) {
    filters.age_group = /^child$/i;
    matchedSomething = true;
  }

  if (text.includes("teenager") || text.includes("teenagers")) {
    filters.age_group = /^teenager$/i;
    matchedSomething = true;
  }

  if (text.includes("adult") || text.includes("adults")) {
    filters.age_group = /^adult$/i;
    matchedSomething = true;
  }

  if (text.includes("senior") || text.includes("seniors")) {
    filters.age_group = /^senior$/i;
    matchedSomething = true;
  }

  // Young parsing (special rule: 16–24)
  if (text.includes("young")) {
    filters.age = {
      ...(filters.age || {}),
      $gte: 16,
      $lte: 24
    };
    matchedSomething = true;
  }

  // Above age parsing
  const aboveMatch = text.match(/above\s+(\d+)/);
  if (aboveMatch) {
    filters.age = {
      ...(filters.age || {}),
      $gte: Number(aboveMatch[1])
    };
    matchedSomething = true;
  }

  // Below age parsing
  const belowMatch = text.match(/below\s+(\d+)/);
  if (belowMatch) {
    filters.age = {
      ...(filters.age || {}),
      $lte: Number(belowMatch[1])
    };
    matchedSomething = true;
  }

  // From country parsing
  for (const countryName in countryMap) {
    if (text.includes(`from ${countryName}`)) {
      filters.country_id = new RegExp(`^${countryMap[countryName]}$`, "i");
      matchedSomething = true;
      break;
    }
  }

  if (!matchedSomething) {
    return null;
  }

  return filters;
};

module.exports = parseNaturalLanguageQuery;