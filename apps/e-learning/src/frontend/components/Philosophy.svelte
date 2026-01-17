<script lang="ts">
	import { onMount } from 'svelte';
	import Quote from '@lucide/svelte/icons/quote';
	import { animate, inView } from 'motion';

	let sectionRef: HTMLElement;
	let quoteRef: HTMLElement;
	let authorRef: HTMLElement;

	onMount(() => {
		if (sectionRef) {
			inView(sectionRef, () => {
				if (quoteRef) {
					animate(quoteRef, { opacity: [0, 1], y: [20, 0] } as any, {
						duration: 0.8
					});
				}
				if (authorRef) {
					animate(authorRef, { opacity: [0, 1], y: [20, 0] } as any, {
						duration: 0.8,
						delay: 0.3
					});
				}
			});
		}
	});
</script>

<section
	bind:this={sectionRef}
	class="relative w-full overflow-hidden bg-[var(--background)] py-20 lg:py-32"
>
	<div class="relative z-10 container mx-auto px-6 lg:px-20">
		<div class="mx-auto max-w-4xl text-center">
			<div class="mb-8 flex justify-center opacity-80">
				<Quote class="h-10 w-10 text-[#081f5c]/20 lg:h-16 lg:w-16" />
			</div>

			<blockquote bind:this={quoteRef} class="opacity-0">
				<p
					class="mb-8 font-serif text-2xl leading-relaxed font-medium text-[#081f5c] italic lg:text-3xl lg:leading-normal"
				>
					"Education is an effort to advance the growth of character (inner strength and character),
					intellect, and body of the child."
				</p>
			</blockquote>

			<div bind:this={authorRef} class="flex flex-col items-center opacity-0">
				<div class="h-1 w-20 rounded-full bg-[#ff6f00]"></div>
				<h3 class="mt-4 text-xl font-bold tracking-wider text-gray-900 uppercase">
					Ki Hadjar Dewantara
				</h3>
				<p class="text-sm font-medium text-gray-500">Father of National Education in Indonesia</p>
			</div>
		</div>
	</div>
</section>
