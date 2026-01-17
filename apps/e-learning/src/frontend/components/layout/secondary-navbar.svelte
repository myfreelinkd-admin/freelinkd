<script lang="ts">
	export let title: string = 'E-Learning';
	export let href: string = '/';
</script>

<div
	class="sticky top-0 z-50 w-full border-b border-gray-200 bg-white font-sans text-[#081f5c] shadow-sm"
>
	<div
		class="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4 md:gap-6 md:px-8 md:py-6 lg:px-16"
	>
		<a
			{href}
			class="group flex cursor-pointer items-center gap-2 font-medium text-gray-600 transition-opacity hover:opacity-80"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1"
			>
				<path d="m12 19-7-7 7-7" />
				<path d="M19 12H5" />
			</svg>
			<span class="hidden sm:inline">Back to Home</span>
			<span class="sm:hidden">Back</span>
		</a>
		<div class="h-6 w-px bg-gray-300"></div>
		<h1 class="truncate text-xl font-bold text-[#081f5c] capitalize md:text-2xl">
			{title}
		</h1>
	</div>
</div>
