<script lang="ts">
	import { onMount } from 'svelte';
	import { animate, stagger, inView } from 'motion';

	let sectionRef: HTMLElement;
	let headerRef: HTMLElement;
	let gridRef: HTMLElement;

	onMount(() => {
		// Animate Header Section on scroll
		if (headerRef) {
			inView(headerRef, (info) => {
				const target = info as HTMLElement;
				animate(target, { opacity: [0, 1], y: [30, 0] } as any, { duration: 0.6 });
			});
		}

		// Animate Grid Items on scroll
		if (gridRef) {
			inView(gridRef, (info) => {
				const target = info as HTMLElement;
				animate(
					target.querySelectorAll('.feature-card'),
					{ opacity: [0, 1], y: [30, 0] } as any,
					{ delay: stagger(0.1), duration: 0.6 }
				);
			});
		}
	});

	const features = [
		{
			title: 'Expert-Led Courses',
			description:
				'Learn from industry professionals with real-world experience and deep subject knowledge.',
			icon: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`
		},
		{
			title: 'Peer Support Community',
			description:
				'Connect with fellow learners, exchange ideas, and grow together in a collaborative environment.',
			icon: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`
		},
		{
			title: 'Skill Mastery',
			description:
				'Follow structured learning paths designed to take you from beginner to master efficiently.',
			icon: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>`
		},
		{
			title: 'Recognized Certifications',
			description:
				'Earn certificates that validate your skills and enhance your professional portfolio.',
			icon: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>`
		}
	];
</script>

<section
	bind:this={sectionRef}
	id="about"
	class="relative w-full overflow-hidden bg-[var(--background)] px-4 py-12 lg:px-20 lg:py-24"
>
	<div class="relative z-10 container mx-auto">
		<div bind:this={headerRef} class="mx-auto mb-8 max-w-3xl text-center opacity-0 lg:mb-20">
			<h2 class="mb-4 text-2xl font-extrabold text-[#081f5c] lg:mb-6 lg:text-5xl">
				Your Learning Journey, Elevated
			</h2>
			<p class="mx-auto max-w-xl text-sm leading-relaxed text-gray-600 lg:max-w-none lg:text-lg">
				Go beyond simple tutorials. Join a comprehensive platform designed to connect you with
				high-quality education and accelerate your personal growth.
			</p>
		</div>

		<div bind:this={gridRef} class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
			{#each features as feature, index}
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div
					class="feature-card group relative flex h-full cursor-pointer flex-col rounded-3xl border border-gray-100 bg-white p-6 opacity-0 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] transition-all duration-500 ease-in-out hover:-translate-y-1 hover:border-blue-100 hover:shadow-[0_20px_50px_-10px_rgba(8,31,92,0.1)] lg:p-8"
				>
					<div class="relative mb-6 lg:mb-8">
						<div
							class="flex h-16 w-16 transform items-center justify-center rounded-2xl bg-blue-50 text-[#081f5c] transition-all duration-500 group-hover:scale-110 group-hover:-rotate-6 group-hover:bg-[#081f5c] group-hover:text-white"
						>
							{@html feature.icon}
						</div>
					</div>

					<h3
						class="mb-4 text-xl font-bold text-[#081f5c] transition-colors duration-300 group-hover:text-[#081f5c]"
					>
						{feature.title}
					</h3>

					<p class="grow text-sm leading-relaxed text-gray-600">
						{feature.description}
					</p>

					<!-- Bottom Accent -->
					<div
						class="mt-8 h-1 w-12 rounded-full bg-gray-100 transition-all duration-500 group-hover:w-full group-hover:bg-[#081f5c]"
					></div>
				</div>
			{/each}
		</div>
	</div>
</section>
