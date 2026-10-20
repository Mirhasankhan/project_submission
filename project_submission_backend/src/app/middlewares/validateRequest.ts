import { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodError } from "zod";

type RequestPart = "body" | "query" | "params";

const validateRequest =
  (schema: AnyZodObject, requestPart: RequestPart = "body") =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = await schema.parseAsync(req[requestPart]);

      if (requestPart === "query") {
        const query = req.query as Record<string, unknown>;
        Object.keys(query).forEach((key) => delete query[key]);
        Object.assign(query, parsed);
      } else {
        req[requestPart] = parsed;
      }

      return next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: err.errors.map((error) => ({
            path: error.path.join("."),
            message: error.message,
          })),
        });
      }
      return next(err);
    }
  };

export default validateRequest;
//  import { NextFunction, Request, Response } from "express";
//  import { AnyZodObject, ZodError } from "zod";
//  const validateRequest =
//   (schema: AnyZodObject) =>
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       await schema.parseAsync(req.body);
//       return next();
//     } catch (err) {
//       if (err instanceof ZodError) {
//         const formattedErrors = err.errors.map((error) => ({
//           path: error.path.join("."),
//           message: error.message,
//         }));

//         return res.status(400).json({
//           success: false,
//           message: formattedErrors[0]?.message || "Validation failed",
//           errors: formattedErrors,
//         });
//       }
//       return next(err);
//     }
//   };

//    export default validateRequest;
