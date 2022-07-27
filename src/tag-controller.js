import axios from "axios";

/**
 * Resolves a input string with any known tags
 *
 * @param {String} input
 * @returns {String} output
 */
export const resolveTags = (input) => {
  return new Promise((resolve) => {
    const rgx = new RegExp(/(\$\([a-z]{2,}:[0-9]\))/g);
    const matches = input.match(rgx);

    if (!matches) resolve(input);
    let output = input;

    Promise.all(
      matches.map(async (match) => {
        const tag = await replaceTag(match);
        output = output.replace(match, tag);
      })
    ).then(() => {
      resolve(output);
    });
  });
};

/**
 * Takes in a matched string e.g. "$(firstname:1)"
 * Seperates the name and value and runs the fetchTag function on it
 *
 * Also recursively checks the fetchTag response
 *
 * @param {String} match
 * @returns {Promise<String>} Either a string or an error
 */
const replaceTag = (match) => {
  return new Promise(async (resolve, reject) => {
    const [name, value] = match.split(/[$()]/)[2].split(":");

    try {
      const response = await fetchTag(name, value);
      const recursiveCheck = await resolveTags(response.data);
      resolve(recursiveCheck);
    } catch (err) {
      console.log("Error repacing tag", err.message);
      resolve("<ERROR>");
    }
  });
};

/**
 *
 * @param {String} name
 * @param {String} value
 * @returns {String}
 */
const fetchTag = (name, value) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get(
        `${process.env.EXISTING_MICROSERVICE_URL}/template/${name}/${value}`
      );

      resolve(response);
    } catch (err) {
      console.log("Error fetching tag", err.message);
      reject(err);
    }
  });
};
