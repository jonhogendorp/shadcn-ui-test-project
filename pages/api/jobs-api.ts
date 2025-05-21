// pages/api/jobs.ts
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma"; // Importing the singleton Prisma client
import { Prisma } from "@prisma/client"; // Importing Prisma namespace

// Types for our API response
type Job = {
	id: string;
	title: string;
	company: string;
	location: string;
	type: "Full-time" | "Part-time" | "Contract" | "Remote";
	description: string;
	postedDate: string;
	salary?: string;
};

type ApiResponse = {
	jobs: Job[];
	totalJobs: number;
	totalPages: number;
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<ApiResponse | { error: string }>
) {
	if (req.method !== "GET") {
		return res.status(405).json({ error: "Method not allowed" });
	}

	const {
		q, // search query
		types, // comma-separated job types
		location,
		sortBy = "newest",
		page = "1",
		limit = "10",
	} = req.query;

	const pageNum = parseInt(page as string, 10) || 1;
	const limitNum = parseInt(limit as string, 10) || 10;
	const skip = (pageNum - 1) * limitNum;

	try {
		// Build the where clause for prisma query
		const whereClause: Prisma.JobWhereInput = {};

		// Search functionality
		if (q) {
			whereClause.OR = [
				{ title: { contains: q as string, mode: "insensitive" } },
				{ company: { contains: q as string, mode: "insensitive" } },
				{ description: { contains: q as string, mode: "insensitive" } },
			];
		}

		// Job type filter
		if (types) {
			const jobTypes = (types as string).split(",");
			whereClause.type = { in: jobTypes };
		}

		// Location filter
		if (location) {
			whereClause.location = {
				contains: location as string,
				mode: "insensitive",
			};
		}

		// Execute the queries
		const [jobs, totalJobs] = await Promise.all([
			prisma.job.findMany({
				where: whereClause,
				orderBy:
					sortBy === "newest" ? { postedDate: "desc" } : { title: "asc" }, // Simple relevance sorting by title
				skip,
				take: limitNum,
				select: {
					id: true,
					title: true,
					company: true,
					location: true,
					type: true,
					description: true,
					postedDate: true,
					salary: true,
				},
			}),
			prisma.job.count({ where: whereClause }),
		]);

		// Calculate total pages
		const totalPages = Math.ceil(totalJobs / limitNum);

		// Return the API response
		return res.status(200).json({
			jobs,
			totalJobs,
			totalPages,
		});
	} catch (error) {
		console.error("Error fetching jobs:", error);
		return res.status(500).json({ error: "Failed to fetch jobs" });
	}
}
