import axios from "axios";

/**
 * Resolves a input string with any known tags
 *
 * @param {string} input
 * @returns {string} The resulting output string
 */
export const resolveTags = (input: string): Promise<string> => {
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
const replaceTag = (match: string): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    const [name, value] = match.split(/[$()]/)[2].split(":");

    try {
      const response = await fetchTag(name, value);
      const recursiveCheck = await resolveTags(response);
      resolve(recursiveCheck);
    } catch (err) {
      resolve(err);
    }
  });
};

/**
 * Fetches a tag based on its name and value from the existing microservice
 *
 * @param {String} name
 * @param {String} value
 * @returns {String}
 */
const fetchTag = (name: string, value: string): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get(
        `${process.env.EXISTING_MICROSERVICE_URL}/template/${name}/${value}`
      );

      resolve(response.data);
    } catch (err) {
      console.log("Error fetching tag", err.message);
      reject("<ERROR>");
    }
  });
};
