"use client";
// pages/jobs.tsx
import type { NextPage } from "next";
import JobSearch from "./JobSearch";

const JobsPage: NextPage = () => {
	return (
		<div className='container mx-auto py-8'>
			<JobSearch />
		</div>
	);
};

export default JobsPage;
