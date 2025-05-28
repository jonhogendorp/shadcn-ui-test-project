"use client";

import React, { useState, useEffect } from "react";

// Define TypeScript interfaces
interface Job {
	id: string;
	title: string;
	company: string;
	location: string;
	type: "Full-time" | "Part-time" | "Contract" | "Remote";
	skills: string[];
	description: string;
	postedDate: string;
	salary?: string;
}

interface FilterState {
	searchTerm: string;
	jobType: string[];
	location: string;
	sortBy: "newest" | "relevance";
	skills: string[]; // Add skills filter if needed
}

const numbers = [1, 2, 3, 4, 5];
const strings = ["one", "two", "three", "four", "five"];

const numbersAndStrings = { ...numbers, ...strings };
console.log(numbersAndStrings);

const JobSearch: React.FC = () => {
	// Sample job data (you would fetch this from an API in a real application)
	const [jobs, setJobs] = useState<Job[]>([
		{
			id: "1",
			title: "Frontend Developer",
			company: "Tech Solutions Inc.",
			location: "New York, NY",
			type: "Full-time",
			skills: ["React", "JavaScript", "Node"],
			description:
				"We are looking for a skilled frontend developer with React experience.",
			postedDate: "2025-05-15",
			salary: "$90,000 - $120,000",
		},
		{
			id: "2",
			title: "Backend Engineer",
			company: "Data Systems",
			location: "Remote",
			type: "Full-time",
			skills: ["Node", "Python", "Go"],
			description: "Experienced backend developer needed for our growing team.",
			postedDate: "2025-05-10",
			salary: "$100,000 - $130,000",
		},
		{
			id: "3",
			title: "UI/UX Designer",
			company: "Creative Labs",
			location: "San Francisco, CA",
			type: "Contract",
			skills: ["JavaScript", "React", "Ruby"],
			description:
				"Looking for a creative UI/UX designer for a 6-month project.",
			postedDate: "2025-05-18",
		},
		{
			id: "4",
			title: "DevOps Engineer",
			company: "Cloud Solutions",
			location: "Remote",
			type: "Full-time",
			skills: ["Go", "Python", "Java"],
			description: "Join our team to build and maintain cloud infrastructure.",
			postedDate: "2025-05-12",
			salary: "$110,000 - $140,000",
		},
		{
			id: "5",
			title: "Part-time Web Developer",
			company: "Startup Ventures",
			location: "Austin, TX",
			type: "Part-time",
			skills: ["PHP", "JavaScript", "React"],
			description:
				"Looking for a part-time web developer for ongoing projects.",
			postedDate: "2025-05-16",
			salary: "$40/hour",
		},
	]);

	// Example: Add Job button to demonstrate setJobs usage
	const handleAddJob = () => {
		const newJob: Job = {
			id: (jobs.length + 1).toString(),
			title: "New Job Title",
			company: "New Company",
			location: "Remote",
			type: "Full-time",
			skills: ["JavaScript", "React"],
			description: "This is a newly added job.",
			postedDate: new Date().toISOString().split("T")[0],
			salary: "$100,000",
		};
		setJobs([...jobs, newJob]);
	};

	// Filter state
	const [filters, setFilters] = useState<FilterState>({
		searchTerm: "",
		jobType: [],
		location: "",
		sortBy: "newest",
		skills: [],
		// Add skills filter if needed
	});

	// Filtered jobs
	const [filteredJobs, setFilteredJobs] = useState<Job[]>(jobs);

	// Handle search input change
	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFilters({
			...filters,
			searchTerm: e.target.value,
		});
	};

	// Handle job type filter change
	const handleJobTypeChange = (type: string) => {
		const updatedJobTypes = filters.jobType.includes(type)
			? filters.jobType.filter((t) => t !== type)
			: [...filters.jobType, type];

		setFilters({
			...filters,
			jobType: updatedJobTypes,
		});
	};

	// Handle location filter change
	const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setFilters({
			...filters,
			location: e.target.value,
		});
	};

	const handleSkillsChange = (type: string) => {
		const updatedSkills = filters.skills.includes(type)
			? filters.skills.filter((t) => t !== type)
			: [...filters.skills, type];
		setFilters({
			...filters,
			skills: updatedSkills,
		});
	};

	// Handle sort change
	const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setFilters({
			...filters,
			sortBy: e.target.value as "newest" | "relevance",
		});
	};

	// Apply filters whenever filter state changes
	useEffect(() => {
		let result = [...jobs];

		// Apply search term filter
		if (filters.searchTerm) {
			const searchLower = filters.searchTerm.toLowerCase();
			result = result.filter(
				(job) =>
					job.title.toLowerCase().includes(searchLower) ||
					job.company.toLowerCase().includes(searchLower) ||
					job.description.toLowerCase().includes(searchLower) ||
					job.skills.some((skill) => skill.toLowerCase().includes(searchLower))
			);
		}

		// Apply job type filter
		if (filters.jobType.length > 0) {
			result = result.filter((job) => filters.jobType.includes(job.type));
		}

		// Apply location filter
		if (filters.location) {
			result = result.filter((job) => job.location.includes(filters.location));
		}

		if (filters.skills.length > 0) {
			result = result.filter((job) =>
				job.skills.some((skill) => filters.skills.includes(skill))
			);
		}

		// Apply sorting
		if (filters.sortBy === "newest") {
			result.sort(
				(a, b) =>
					new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()
			);
		} else if (filters.sortBy === "relevance" && filters.searchTerm) {
			// Basic relevance sorting - jobs with the search term in the title ranked higher
			const searchTerm = filters.searchTerm.toLowerCase();
			result.sort((a, b) => {
				const aTitle = a.title.toLowerCase().includes(searchTerm) ? 1 : 0;
				const bTitle = b.title.toLowerCase().includes(searchTerm) ? 1 : 0;
				return bTitle - aTitle;
			});
		}

		setFilteredJobs(result);
	}, [filters, jobs]);

	return (
		<div className='max-w-4xl mx-auto p-4'>
			<h1 className='text-2xl font-bold mb-6'>Find Your Dream Job</h1>

			{/* Example Add Job Button */}
			<button
				className='mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition'
				onClick={handleAddJob}
			>
				Add Example Job
			</button>

			{/* Search Bar */}
			<div className='mb-6'>
				<div className='relative'>
					<input
						type='text'
						placeholder='Search for jobs, companies, or keywords...'
						className='w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
						value={filters.searchTerm}
						onChange={handleSearchChange}
					/>
					<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
						<svg
							className='h-5 w-5 text-gray-400'
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'
							xmlns='http://www.w3.org/2000/svg'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth='2'
								d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
							></path>
						</svg>
					</div>
				</div>
			</div>

			{/* Filters Section */}
			<div className='mb-8 grid grid-cols-1 md:grid-cols-3 gap-4'>
				{/* Job Type Filter */}
				<div>
					<h3 className='font-medium mb-2'>Job Type</h3>
					<div className='space-y-2'>
						{["Full-time", "Part-time", "Contract", "Remote"].map((type) => (
							<label
								key={type}
								className='flex items-center'
							>
								<input
									type='checkbox'
									className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
									checked={filters.jobType.includes(type)}
									onChange={() => handleJobTypeChange(type)}
								/>
								<span className='ml-2 text-sm'>{type}</span>
							</label>
						))}
					</div>
				</div>
				{/* Skills Filter */}
				<div>
					<h3 className='font-medium mb-2'>Skills</h3>
					<div className='space-y-2'>
						{[
							"JavaScript",
							"React",
							"Node",
							"Python",
							"Go",
							"Ruby",
							"PHP",
							"php",
						].map((skill) => (
							<label
								key={skill}
								className='flex items-center'
							>
								<input
									type='checkbox'
									className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
									checked={filters.skills.includes(skill)}
									onChange={() => handleSkillsChange(skill)}
								/>
								<span className='ml-2 text-sm'>{skill}</span>
							</label>
						))}
					</div>
				</div>

				{/* Location Filter */}
				<div>
					<h3 className='font-medium mb-2'>Location</h3>
					<select
						className='w-full p-2 border border-gray-300 rounded-md'
						value={filters.location}
						onChange={handleLocationChange}
					>
						<option value=''>All Locations</option>
						<option value='Remote'>Remote</option>
						<option value='New York'>New York</option>
						<option value='San Francisco'>San Francisco</option>
						<option value='Austin'>Austin</option>
					</select>
				</div>

				{/* Sort By */}
				<div>
					<h3 className='font-medium mb-2'>Sort By</h3>
					<select
						className='w-full p-2 border border-gray-300 rounded-md'
						value={filters.sortBy}
						onChange={handleSortChange}
					>
						<option value='newest'>Newest</option>
						<option value='relevance'>Relevance</option>
					</select>
				</div>
			</div>

			{/* Results Counter */}
			<div className='mb-4 text-sm text-gray-600'>
				{filteredJobs.length} {filteredJobs.length === 1 ? "job" : "jobs"} found
			</div>

			{/* Job Results */}
			<div className='space-y-4'>
				{filteredJobs.map((job) => (
					<div
						key={job.id}
						className='border rounded-lg p-4 hover:shadow-md transition'
					>
						<div className='flex justify-between items-start'>
							<div>
								<h2 className='text-lg font-semibold'>{job.title}</h2>
								<p className='text-gray-600'>{job.company}</p>
								<div className='flex flex-wrap gap-2 mt-2'>
									<span className='bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded'>
										{job.location}
									</span>
									<span className='bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded'>
										{job.type}
									</span>
									{job.skills.map((skill) => (
										<span
											key={skill}
											className='bg-green-100 text-green-800 text-xs px-2 py-1 rounded'
										>
											{skill}
										</span>
									))}
								</div>
								<p className='mt-2 text-sm'>{job.description}</p>
							</div>
							<div className='text-right'>
								<p className='text-sm text-gray-500'>
									Posted: {new Date(job.postedDate).toLocaleDateString()}
								</p>
								{job.salary && (
									<p className='text-sm font-medium text-gray-700 mt-1'>
										{job.salary}
									</p>
								)}
							</div>
						</div>
					</div>
				))}

				{filteredJobs.length === 0 && (
					<div className='text-center py-8'>
						<p className='text-gray-500'>
							No jobs found matching your search criteria.
						</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default JobSearch;
