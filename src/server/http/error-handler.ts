import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

import { ApplicationError } from "../services";

export function errorHandler(
	error: unknown,
	_req: Request,
	res: Response,
	_next: NextFunction,
) {
	if (error instanceof ApplicationError) {
		return res.status(error.status).json({
			message: error.message,
			details: error.details,
		});
	}

	if (error instanceof ZodError) {
		return res.status(400).json({
			message: "Invalid request payload",
			details: error.flatten(),
		});
	}

	console.error(error);

	return res.status(500).json({
		message: "Internal server error",
	});
}
