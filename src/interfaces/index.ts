import { Request } from "express";

/**
 * Extending Request to contain middleware
 */
export default interface RequestMiddleware extends Request {
  body: { input: string };
}

/**
 * Used to keep track of already resolved tags
 */
export interface ResolvedTags {
  [key: string]: number;
}
