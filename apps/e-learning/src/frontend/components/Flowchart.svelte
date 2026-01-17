<script lang="ts">
	import { onMount } from 'svelte';
	import { animate, inView } from 'motion';

	import Search from '@lucide/svelte/icons/search';
	import BookOpen from '@lucide/svelte/icons/book-open';
	import Laptop from '@lucide/svelte/icons/laptop';
	import TrendingUp from '@lucide/svelte/icons/trending-up';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import Mockup from './Mockup.svelte';

	let sectionRef: HTMLElement;

	const steps = [
		{
			icon: Search,
			label: 'Choose Class',
			description: 'Find a topic that interests you',
			color: 'bg-blue-50 text-blue-700'
		},
		{
			icon: BookOpen,
			label: 'Watch Material',
			description: 'Access interactive learning videos',
			color: 'bg-orange-50 text-orange-700'
		},
		{
			icon: Laptop,
			label: 'Do Exercises',
			description: 'Test your understanding with quizzes',
			color: 'bg-blue-50 text-blue-700'
		},
		{
			icon: TrendingUp,
			label: 'Track Progress',
			description: 'Monitor your learning results',
			color: 'bg-orange-50 text-orange-700'
		}
	];

	onMount(() => {
		if (sectionRef) {
			inView(sectionRef, () => {
				// Title
				animate('.flow-title', { opacity: [0, 1], y: [20, 0] } as any, { duration: 0.6 });

				// Mockup
				animate('.flow-mockup', { opacity: [0, 1], x: [50, 0] } as any, {
					duration: 0.8,
					delay: 0.2
				});

				// Vertical Line
				animate('.flow-line', { height: ['0%', '100%'], opacity: [0, 1] } as any, {
					duration: 1.5,
					delay: 0.3
				});

				// Steps - staggered
				animate('.flow-step', { opacity: [0, 1], x: [-20, 0] } as any, {
					delay: (_el: any, i: number) => 0.5 + i * 0.3,
					duration: 0.6
				});

				// Quote
				animate('.flow-quote', { opacity: [0, 1], y: [20, 0] } as any, {
					delay: 2,
					duration: 0.8
				});
			});
		}
	});
</script>

<section
	bind:this={sectionRef}
	class="w-full overflow-hidden bg-[var(--background)] py-20 lg:py-32"
>
	<div class="container mx-auto px-6">
		<!-- Title -->
		<div class="flow-title mx-auto mb-16 text-center opacity-0 lg:mb-20">
			<h2 class="mb-4 text-2xl font-extrabold text-[#081f5c] lg:mb-6 lg:text-5xl">
				Your Learning Path
			</h2>
			<p class="mx-auto max-w-xl text-sm leading-relaxed text-gray-600 lg:max-w-none lg:text-lg">
				A fun and structured learning path for you
			</p>
		</div>

		<div class="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center lg:gap-20">
			<!-- Left Column: Content + Timeline -->
			<div class="mx-auto max-w-xl lg:mx-0">
				<!-- Vertical Timeline Container -->
				<div class="relative pl-4 md:pl-0">
					<!-- Vertical Line -->
					<div
						class="flow-line absolute top-4 left-[28px] h-full w-[3px] rounded-full bg-gray-200 opacity-0 md:left-[38px]"
					></div>

					<!-- Steps -->
					<div class="relative flex flex-col space-y-12">
						{#each steps as step}
							<div class="flow-step flex items-start gap-6 opacity-0 md:gap-8">
								<!-- Icon Circle -->
								<div class="relative z-10 shrink-0">
									<div
										class="flex h-14 w-14 items-center justify-center rounded-full border-4 border-white shadow-md transition-transform duration-300 hover:scale-110 md:h-20 md:w-20 md:border-8 {step.color}"
									>
										<svelte:component this={step.icon} size={24} class="md:h-8 md:w-8" />
									</div>
								</div>

								<!-- Text Content -->
								<div class="pt-2 md:pt-5">
									<h3 class="text-xl font-bold text-[#081f5c] md:text-2xl">{step.label}</h3>
									<p class="mt-2 text-sm font-medium text-gray-600 md:text-base">
										{step.description}
									</p>
								</div>
							</div>
						{/each}
					</div>
				</div>
			</div>

			<!-- Right Column: Mockup -->
			<div class="flow-mockup hidden opacity-0 lg:block">
				<Mockup />
			</div>
		</div>

		<!-- Friendly Quote (Centered) -->
		<div class="flow-quote mx-auto mt-24 max-w-2xl text-center opacity-0">
			<div
				class="relative inline-block rounded-[2rem] bg-white px-8 py-6 shadow-xl ring-1 shadow-blue-900/5 ring-black/5"
			>
				<p class="text-lg leading-relaxed font-medium text-gray-600 italic">
					"Take it easy, follow the flow. Enjoy every step of your learning process."
				</p>
				<div class="mt-4 flex justify-center gap-2">
					<div class="h-2 w-2 rounded-full bg-[#081f5c]"></div>
					<div class="h-2 w-2 rounded-full bg-[#ff6f00]"></div>
					<div class="h-2 w-2 rounded-full bg-[#081f5c]"></div>
				</div>
			</div>
		</div>
	</div>
</section>
