<script lang="ts">
	import { onMount } from 'svelte';
	import { animate } from 'motion';
	import Sparkles from '@lucide/svelte/icons/sparkles';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import CheckCircle2 from '@lucide/svelte/icons/check-circle-2';
	import Star from '@lucide/svelte/icons/star';

	let sectionRef: HTMLElement;
	let textContainer: HTMLElement;
	let imageContainer: HTMLElement;
	let badge: HTMLElement;
	let highlightsContainer: HTMLElement;

	onMount(() => {
		if (textContainer) {
			animate(textContainer, { opacity: [0, 1], x: [-30, 0] } as any, { duration: 0.8 });
		}

		if (badge) {
			animate(badge, { opacity: [0, 1], y: [20, 0] } as any, { duration: 0.8, delay: 0.2 });
		}

		if (sectionRef) {
			const path = sectionRef.querySelector('.path-draw');
			if (path) {
				animate(path, { pathLength: [0, 1] } as any, { duration: 1, delay: 0.5 });
			}
		}

		if (highlightsContainer) {
			const items = highlightsContainer.querySelectorAll('.highlight-item');
			if (items.length > 0) {
				animate(items, { opacity: [0, 1], x: [-10, 0] } as any, {
					delay: (i) => 0.6 + i * 0.1
				});
			}
		}

		if (imageContainer) {
			animate(imageContainer, { opacity: [0, 1] } as any, { duration: 1.2 });

			const floatCard = imageContainer.querySelector('.float-card');
			if (floatCard) {
				animate(floatCard, { opacity: [0, 1], y: [20, 0] } as any, {
					delay: 1,
					duration: 0.8
				});
			}
		}
	});

	const highlights = [
		'Expert Instructors',
		'Flexible Learning',
		'Global Community',
		'Career Certificates'
	];
</script>

<section
	bind:this={sectionRef}
	class="relative flex min-h-[100dvh] w-full flex-col overflow-hidden bg-[var(--background)] pt-16 font-sans lg:flex-row lg:pt-0"
>
	<div
		class="z-10 order-1 flex w-full items-center justify-center bg-[var(--background)] px-4 py-8 lg:order-1 lg:w-1/2 lg:px-20 lg:py-0"
	>
		<div
			bind:this={textContainer}
			class="flex max-w-xl flex-col items-center gap-4 text-center opacity-0 lg:-mt-16 lg:items-start lg:gap-8 lg:text-left"
		>
			<div
				bind:this={badge}
				class="inline-flex w-fit items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-[#081f5c] opacity-0 lg:px-4 lg:py-2 lg:text-sm"
			>
				<Sparkles class="h-3 w-3 text-[#081f5c] lg:h-4 lg:w-4" />
				<span>Premium E-Learning Platform</span>
			</div>

			<!-- Heading -->
			<h1 class="text-3xl leading-tight font-extrabold tracking-tight text-gray-900 lg:text-7xl">
				Unlock Your <br />
				<span class="relative inline-block">
					Learning
					<svg
						class="absolute -bottom-1 left-0 h-2 w-full text-[#081f5c] lg:h-3"
						viewBox="0 0 100 10"
						preserveAspectRatio="none"
					>
						<path
							d="M0 5 Q 50 10 100 5"
							stroke="currentColor"
							stroke-width="8"
							fill="none"
							class="path-draw"
						/>
					</svg>
				</span>{' '}
				<br />
				Potential
			</h1>

			<p class="max-w-sm text-sm leading-relaxed text-gray-600 lg:max-w-none lg:text-lg">
				Join an exclusive platform where industry experts teach vetted, professional courses to
				accelerate your career growth.
			</p>

			<!-- CTA Buttons -->
			<div class="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
				<!-- Start Learning -->
				<a
					href="/courses"
					class="group relative flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-[10px_20px_10px_20px] border border-[#ff6f00] bg-[#ff6f00] px-6 py-3 font-semibold transition-all hover:shadow-lg sm:w-auto lg:px-8 lg:py-4"
				>
					<div
						class="absolute inset-0 translate-y-full bg-white transition-transform duration-500 ease-in-out group-hover:translate-y-0"
					></div>
					<span
						class="relative z-10 flex items-center gap-2 text-white transition-colors duration-500 group-hover:text-[#ff6f00]"
					>
						Start Learning
						<ArrowRight class="h-5 w-5 transition-transform group-hover:translate-x-1" />
					</span>
				</a>

				<!-- Explore Courses -->
				<a
					href="#courses"
					class="group relative flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-[10px_20px_10px_20px] border border-[#081f5c] bg-transparent px-6 py-3 font-semibold transition-all sm:w-auto lg:px-8 lg:py-4"
				>
					<div
						class="absolute inset-0 -translate-y-full bg-[#081f5c] transition-transform duration-500 ease-in-out group-hover:translate-y-0"
					></div>
					<span
						class="relative z-10 flex items-center gap-2 text-[#081f5c] transition-colors duration-500 group-hover:text-white"
					>
						Explore Courses
					</span>
				</a>
			</div>

			<!-- Highlights -->
			<div
				bind:this={highlightsContainer}
				class="mt-2 grid grid-cols-2 gap-x-4 gap-y-2 text-left lg:mt-4 lg:gap-4"
			>
				{#each highlights as item, index}
					<div class="highlight-item flex items-center gap-2 text-gray-600 opacity-0">
						<CheckCircle2 class="h-4 w-4 shrink-0 text-green-500 lg:h-5 lg:w-5" />
						<span class="text-sm font-medium">{item}</span>
					</div>
				{/each}
			</div>
		</div>
	</div>

	<!-- Right Content: Image -->
	<div
		bind:this={imageContainer}
		class="relative order-2 min-h-[40vh] w-full opacity-0 lg:order-2 lg:min-h-screen lg:w-1/2"
	>
		<img
			src="/assets/img/hero_student.png"
			alt="Student learning online"
			class="absolute inset-0 h-full w-full object-cover"
			fetchpriority="high"
		/>

		<!-- Decorative Overlay -->
		<div
			class="absolute inset-0 block bg-gradient-to-b from-transparent via-transparent to-[var(--background)] lg:bg-gradient-to-r lg:from-[var(--background)] lg:to-transparent"
		></div>

		<!-- Bottom Floating Card -->
		<div
			class="float-card absolute right-6 bottom-6 left-6 mx-auto max-w-xs rounded-2xl border border-white/50 bg-white/90 p-4 opacity-0 shadow-lg backdrop-blur-md lg:right-auto lg:bottom-24 lg:left-12 lg:mx-0"
		>
			<div class="flex items-center gap-4">
				<div
					class="flex h-12 w-12 items-center justify-center rounded-full bg-[#081f5c]/10 text-[#081f5c]"
				>
					<Star class="h-6 w-6 fill-yellow-500 text-yellow-500" />
				</div>
				<div>
					<p class="text-sm font-medium text-gray-500">Student Success</p>
					<p class="text-lg font-bold text-[#081f5c]">4.8 / 5.0</p>
				</div>
			</div>
		</div>
	</div>
</section>
