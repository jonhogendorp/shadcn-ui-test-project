import React, { useState, useEffect } from "react";
import axios from "axios";

// Define TypeScript interfaces
interface Job {
	id: string;
	title: string;
	company: string;
	location: string;
	type: "Full-time" | "Part-time" | "Contract" | "Remote";
	description: string;
	postedDate: string;
	salary?: string;
}

interface FilterState {
	searchTerm: string;
	jobType: string[];
	location: string;
	sortBy: "newest" | "relevance";
	page: number;
}

interface ApiResponse {
	jobs: Job[];
	totalJobs: number;
	totalPages: number;
}

// You can adjust these to match your actual API endpoints
const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
const JOBS_PER_PAGE = 10;

const JobSearch: React.FC = () => {
	// States for API data and loading
	const [jobs, setJobs] = useState<Job[]>([]);
	console.log("All jobs from API:", jobs);
	const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [totalJobs, setTotalJobs] = useState<number>(0);
	const [totalPages, setTotalPages] = useState<number>(1);
	const [availableLocations, setAvailableLocations] = useState<string[]>([]);

	// Filter state
	const [filters, setFilters] = useState<FilterState>({
		searchTerm: "",
		jobType: [],
		location: "",
		sortBy: "newest",
		page: 1,
	});

	// Fetch jobs from the API
	useEffect(() => {
		setIsLoading(true);
		setError(null);

		// Add a small delay to prevent too many API calls while typing
		const delayDebounceFn = setTimeout(() => {
			const fetchJobs = async () => {
				try {
					// Build query parameters
					const params = new URLSearchParams();
					if (filters.searchTerm) params.append("q", filters.searchTerm);
					if (filters.jobType.length > 0)
						params.append("types", filters.jobType.join(","));
					if (filters.location) params.append("location", filters.location);
					params.append("sortBy", filters.sortBy);
					params.append("page", filters.page.toString());
					params.append("limit", JOBS_PER_PAGE.toString());

					// Make API request
					const response = await axios.get<ApiResponse>(
						`${API_BASE_URL}/jobs`,
						{
							params,
						}
					);

					setJobs(response.data.jobs);
					setFilteredJobs(response.data.jobs);
					setTotalJobs(response.data.totalJobs);
					setTotalPages(response.data.totalPages);
				} catch (err) {
					console.error("Error fetching jobs:", err);
					setError("Failed to fetch job listings. Please try again later.");
					// Set empty arrays to avoid undefined errors
					setJobs([]);
					setFilteredJobs([]);
				} finally {
					setIsLoading(false);
				}
			};
			fetchJobs();
		}, 500);

		// Fetch available locations for the filter dropdown (only once)
		if (availableLocations.length === 0) {
			const fetchLocations = async () => {
				try {
					const response = await axios.get<{ locations: string[] }>(
						`${API_BASE_URL}/locations`
					);
					setAvailableLocations(response.data.locations);
				} catch (err) {
					console.error("Error fetching locations:", err);
					// Set default locations if API fails
					setAvailableLocations([
						"Remote",
						"New York",
						"San Francisco",
						"Austin",
						"Chicago",
						"Seattle",
					]);
				}
			};
			fetchLocations();
		}

		return () => clearTimeout(delayDebounceFn);
	}, [filters, availableLocations.length]);

	// Reset page when filters change
	useEffect(() => {
		if (filters.page !== 1) {
			setFilters((prev) => ({ ...prev, page: 1 }));
		}
	}, [
		filters.searchTerm,
		filters.jobType,
		filters.location,
		filters.sortBy,
		filters.page,
	]);

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

	// Handle sort change
	const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setFilters({
			...filters,
			sortBy: e.target.value as "newest" | "relevance",
		});
	};

	// Handle pagination
	const handlePageChange = (newPage: number) => {
		setFilters({
			...filters,
			page: newPage,
		});
		// Scroll to top when changing pages
		window.scrollTo(0, 0);
	};

	return (
		<div className='max-w-4xl mx-auto p-4'>
			<h1 className='text-2xl font-bold mb-6'>Find Your Dream Job</h1>

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

				{/* Location Filter */}
				<div>
					<h3 className='font-medium mb-2'>Location</h3>
					<select
						className='w-full p-2 border border-gray-300 rounded-md'
						value={filters.location}
						onChange={handleLocationChange}
					>
						<option value=''>All Locations</option>
						{availableLocations.map((location) => (
							<option
								key={location}
								value={location}
							>
								{location}
							</option>
						))}
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
				{isLoading ? (
					"Loading jobs..."
				) : (
					<>
						{totalJobs} {totalJobs === 1 ? "job" : "jobs"} found
						{filters.searchTerm && ` matching "${filters.searchTerm}"`}
					</>
				)}
			</div>

			{/* Error Message */}
			{error && (
				<div className='mb-4 p-4 bg-red-50 text-red-700 rounded-md'>
					{error}
				</div>
			)}

			{/* Loading State */}
			{isLoading ? (
				<div className='flex justify-center items-center py-12'>
					<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500'></div>
				</div>
			) : (
				<>
					{/* Job Results */}
					<div className='space-y-4'>
						{filteredJobs.length > 0 ? (
							filteredJobs.map((job) => (
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
							))
						) : (
							<div className='text-center py-8'>
								<p className='text-gray-500'>
									No jobs found matching your search criteria.
								</p>
							</div>
						)}
					</div>

					{/* Pagination */}
					{totalPages > 1 && (
						<div className='flex justify-center mt-8'>
							<nav className='flex items-center space-x-2'>
								<button
									className='px-3 py-1 rounded border border-gray-300 text-sm font-medium disabled:opacity-50'
									onClick={() => handlePageChange(filters.page - 1)}
									disabled={filters.page === 1}
								>
									Previous
								</button>

								{/* Page numbers - show 5 pages at most */}
								{Array.from({ length: Math.min(5, totalPages) }).map(
									(_, index) => {
										let pageNum;
										if (totalPages <= 5) {
											pageNum = index + 1;
										} else if (filters.page <= 3) {
											pageNum = index + 1;
										} else if (filters.page >= totalPages - 2) {
											pageNum = totalPages - 4 + index;
										} else {
											pageNum = filters.page - 2 + index;
										}

										return (
											<button
												key={pageNum}
												className={`px-3 py-1 rounded text-sm ${
													pageNum === filters.page
														? "bg-blue-600 text-white"
														: "border border-gray-300"
												}`}
												onClick={() => handlePageChange(pageNum)}
											>
												{pageNum}
											</button>
										);
									}
								)}

								<button
									className='px-3 py-1 rounded border border-gray-300 text-sm font-medium disabled:opacity-50'
									onClick={() => handlePageChange(filters.page + 1)}
									disabled={filters.page === totalPages}
								>
									Next
								</button>
							</nav>
						</div>
					)}
				</>
			)}
		</div>
	);
};

export default JobSearch;
