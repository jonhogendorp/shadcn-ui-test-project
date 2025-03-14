import React from "react";
import { TvIcon } from "lucide-react";

export default function page() {
	return (
		<div className='max-w-[950px] flex-col flex items-center justify-center h-screen mx-auto'>
			<button className='btn btn-xs sm:btn-md '>
				<TvIcon className='w-3 h-3 sm:h-5 sm:w-5'></TvIcon>
			</button>
			<figure className='flex flex-col gap-1 rounded-xl bg-gray-950/5 p-1 inset-ring inset-ring-gray-950/5 dark:bg-white/10 dark:inset-ring-white/10'>
				<div className='not-prose overflow-auto rounded-lg bg-white outline outline-white/5 dark:bg-gray-950/50'>
					<div className='my-8 overflow-hidden'>
						<table className='table-auto w-full border-collapse text-sm'>
							<thead>
								<tr>
									<th className='border-b border-gray-200 p-4 pt-0 pb-3 pl-8 text-left font-medium text-gray-400 dark:border-gray-600 dark:text-gray-200'>
										Song
									</th>
									<th className='border-b border-gray-200 p-4 pt-0 pb-3 pl-8 text-left font-medium text-gray-400 dark:border-gray-600 dark:text-gray-200'>
										Artist
									</th>
									<th className='border-b border-gray-200 p-4 pt-0 pb-3 pl-8 text-left font-medium text-gray-400 dark:border-gray-600 dark:text-gray-200'>
										Year
									</th>
								</tr>
							</thead>
							<tbody className='bg-white dark:bg-gray-800'>
								<tr>
									<td className='border-b border-gray-100 p-4 pl-8 text-gray-500 dark:border-gray-700 dark:text-gray-400'>
										The Sliding Mr. Bones (Next Stop, Pottersville)
									</td>
									<td className='border-b border-gray-100 p-4 pl-8 text-gray-500 dark:border-gray-700 dark:text-gray-400'>
										Malcolm Lockyer
									</td>
									<td className='border-b border-gray-100 p-4 pl-8 text-gray-500 dark:border-gray-700 dark:text-gray-400'>
										1961
									</td>
								</tr>
								<tr>
									<td className='border-b border-gray-100 p-4 pl-8 text-gray-500 dark:border-gray-700 dark:text-gray-400'>
										Witchy Woman
									</td>
									<td className='border-b border-gray-100 p-4 pl-8 text-gray-500 dark:border-gray-700 dark:text-gray-400'>
										The Eagles
									</td>
									<td className='border-b border-gray-100 p-4 pl-8 text-gray-500 dark:border-gray-700 dark:text-gray-400'>
										1972
									</td>
								</tr>
								<tr>
									<td className='border-b border-gray-100 p-4 pl-8 text-gray-500 dark:border-gray-700 dark:text-gray-400'>
										Shining Star
									</td>
									<td className='border-b border-gray-100 p-4 pl-8 text-gray-500 dark:border-gray-700 dark:text-gray-400'>
										Earth, Wind, and Fire
									</td>
									<td className='border-b border-gray-100 p-4 pl-8 text-gray-500 dark:border-gray-700 dark:text-gray-400'>
										1975
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</figure>
		</div>
	);
}
