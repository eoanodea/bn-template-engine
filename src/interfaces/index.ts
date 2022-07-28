import { Request } from "express";

/**
 * Extending Request to an input string in the body
 */
export default interface RequestMiddleware extends Request {
  body: { input: string };
}
