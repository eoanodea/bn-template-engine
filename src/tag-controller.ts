import axios from "axios";
import { ResolvedTags } from "./interfaces";

/**
 * Resolves a input string with any known tags
 *
 * @param {string} input
 * @returns {string} The resulting output string
 */
export const resolveTags = (
  input: string,
  resolvedTags: ResolvedTags
): Promise<string> => {
  return new Promise((resolve) => {
    // Some complicated regex expression that basically searches for tags with any integer
    const rgx = new RegExp(/(\$\([a-z]{2,}:-?[0-9]\d*(\.\d+)?\))/g);

    // Check for matches in the input
    const matches = input.match(rgx);

    // If there's nothing then we're done here, resolve the input
    if (!matches) return resolve(input);
    let output = input;

    // Loop through each match, and recursively resolve any tags
    Promise.all(
      matches.map(async (match) => {
        const tag = await replaceTag(match, resolvedTags);
        output = output.replace(match, tag);
      })
    ).then(() => {
      // Once all of our async business is done we can resolve the output back to the main
      resolve(output);
    });
  });
};

/**
 * Takes in a matched string e.g. "$(firstname:1)"
 * Seperates the name and value e.g. ["firstname", "1"] and runs the fetchTag function on it
 *
 * Also recursively checks the fetchTag response
 *
 * @param {String} match
 * @returns {Promise<String>} Either a string or an error
 */
const replaceTag = (
  match: string,
  resolvedTags: ResolvedTags
): Promise<string> => {
  return new Promise(async (resolve) => {
    const [name, value] = match.split(/[$()]/)[2].split(":"); // Splits something like $(firstname:0) to ["fisrtname", "0"]

    try {
      const response = await fetchTag(name, value);

      /**
       * If we've checked for this tag before,
       * resolve <CIRCULAR> to avoid infinite loops
       */
      if (resolvedTags[match] === 0) {
        resolve("<CIRCULAR>");
        return;
      }

      // If not, mark it as the first time we've resolved this tag
      resolvedTags[match] = 0;

      const recursiveCheck = await resolveTags(response, resolvedTags);

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
        `${process.env.EXISTING_MICROSERVICE_URL}/template/${name}/${value}`,
        { timeout: 3000 }
      );

      resolve(response.data);
    } catch (err) {
      console.log("Error fetching tag", err.message);
      err.code === "ECONNABORTED" ? reject("<TIMEOUT>") : reject("<ERROR>");
    }
  });
};
