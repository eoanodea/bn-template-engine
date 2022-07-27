import { Request } from "express";

/**
 * Extending Request to contain middleware
 */
export default interface RequestMiddleware extends Request {
  body: { input: string };
}
