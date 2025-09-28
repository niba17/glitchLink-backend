import { ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";
import { ValidationError } from "../utils/errors";

export function validateRequest(schema: ZodSchema<any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const formattedErrors = result.error.issues.map((issue) => ({
        path: issue.path[0]?.toString() || "unknown",
        message: issue.message,
      }));

      return next(new ValidationError(formattedErrors));
    }

    req.body = result.data;
    next();
  };
}
