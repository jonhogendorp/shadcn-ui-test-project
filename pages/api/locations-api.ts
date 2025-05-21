// pages/api/locations.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client"; // Assuming you're using Prisma

// Initialize Prisma client
const prisma = new PrismaClient();

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<{ locations: string[] } | { error: string }>
) {
	if (req.method !== "GET") {
		return res.status(405).json({ error: "Method not allowed" });
	}

	try {
		// Get distinct locations from the database
		// Note: This syntax may vary depending on your ORM/database
		const locations = await prisma.job.findMany({
			select: {
				location: true,
			},
			distinct: ["location"],
		});

		// Extract location strings and sort them
		const locationList = locations
			.map((item) => item.location)
			.filter(Boolean)
			.sort();

		return res.status(200).json({ locations: locationList });
	} catch (error) {
		console.error("Error fetching locations:", error);
		return res.status(500).json({ error: "Failed to fetch locations" });
	}
}
