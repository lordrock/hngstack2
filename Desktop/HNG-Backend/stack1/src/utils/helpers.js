const normalizeName = (name) => {
  return name.trim().toLowerCase();
};

const getAgeGroup = (age) => {
  if (age >= 0 && age <= 12) return "child";
  if (age >= 13 && age <= 19) return "teenager";
  if (age >= 20 && age <= 59) return "adult";
  if (age >= 60) return "senior";
  return null;
};

const getTopCountry = (countries) => {
  if (!Array.isArray(countries) || countries.length === 0) {
    return null;
  }

  let topCountry = countries[0];

  for (let i = 1; i < countries.length; i++) {
    if (countries[i].probability > topCountry.probability) {
      topCountry = countries[i];
    }
  }

  return topCountry;
};

const sendError = (res, statusCode, message) => {
  return res.status(statusCode).json({
    status: "error",
    message
  });
};

module.exports = {
  normalizeName,
  getAgeGroup,
  getTopCountry,
  sendError
};