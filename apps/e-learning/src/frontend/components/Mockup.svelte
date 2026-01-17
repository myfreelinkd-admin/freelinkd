<script lang="ts">
	import { onMount } from 'svelte';
	import { animate } from 'motion';

	onMount(() => {
		animate(
			'.mockup-float',
			{ y: [10, -10] } as any,
			{
				duration: 5,
				repeat: Infinity,
				direction: 'alternate',
				easing: 'ease-in-out'
			} as any
		);
	});
</script>

<div class="mockup-float perspective-1000 relative mx-auto w-full max-w-[600px]">
	<div class="relative z-10 mx-auto w-[90%] md:w-full">
		<div class="relative rounded-xl bg-[#1a1c23] p-[2%] shadow-2xl ring-1 ring-white/10">
			<div class="aspect-video overflow-hidden rounded-lg bg-[#0f1115]">
				<div class="flex h-full w-full text-xs">
					<div class="w-16 flex-none space-y-4 border-r border-white/5 bg-[#13151a] p-3">
						<div class="h-6 w-6 rounded bg-blue-500/20"></div>
						<div class="space-y-2">
							<div class="h-2 w-8 rounded bg-white/10"></div>
							<div class="h-2 w-full rounded bg-white/5"></div>
							<div class="h-2 w-full rounded bg-white/5"></div>
						</div>
					</div>
					<div class="flex-1 space-y-4 p-4">
						<div class="flex items-center justify-between">
							<div class="h-3 w-32 rounded bg-white/10"></div>
							<div class="flex gap-2">
								<div class="h-6 w-6 rounded-full bg-white/5"></div>
								<div class="h-6 w-6 rounded-full bg-orange-500"></div>
							</div>
						</div>
						<div
							class="h-24 w-full rounded-lg border border-white/5 bg-gradient-to-r from-blue-900/40 to-blue-800/20 p-4"
						>
							<div class="mb-2 h-3 w-24 rounded bg-blue-400/20"></div>
							<div class="h-2 w-48 rounded bg-white/10"></div>
						</div>
						<div class="grid grid-cols-2 gap-3">
							<div class="h-20 rounded-lg border border-white/5 bg-white/5"></div>
							<div class="h-20 rounded-lg border border-white/5 bg-white/5"></div>
						</div>
					</div>
				</div>
			</div>

			<div
				class="absolute top-[1%] left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-gray-600"
			></div>
		</div>

		<div
			class="relative -z-10 mx-auto -mt-1 h-3 w-[120%] rounded-t-sm rounded-b-xl bg-[#23252d] shadow-xl"
		>
			<div
				class="absolute top-0 left-1/2 h-1 w-16 -translate-x-1/2 rounded-b-md bg-[#1a1c23]"
			></div>
		</div>
	</div>

	<div
		class="absolute -right-4 -bottom-6 z-20 w-[22%] min-w-[90px] md:-right-8 md:-bottom-12 md:w-[25%]"
	>
		<div class="rounded-[1.5rem] border-[4px] border-[#1a1c23] bg-[#1a1c23] shadow-2xl">
			<div class="aspect-[9/19] overflow-hidden rounded-[1.2rem] bg-white">
				<div class="flex h-full flex-col bg-gray-50">
					<div class="flex h-12 items-end bg-blue-600 p-3">
						<div class="h-2 w-12 rounded bg-white/30"></div>
					</div>
					<div class="space-y-2 p-3">
						<div class="h-16 w-full rounded-lg border border-gray-100 bg-white shadow-sm"></div>
						<div class="h-16 w-full rounded-lg border border-gray-100 bg-white shadow-sm"></div>
						<div class="h-16 w-full rounded-lg border border-gray-100 bg-white shadow-sm"></div>
					</div>
					<div class="mt-auto flex h-10 items-center justify-around border-t bg-white px-2">
						<div class="h-4 w-4 rounded bg-gray-200"></div>
						<div class="h-4 w-4 rounded bg-blue-500"></div>
						<div class="h-4 w-4 rounded bg-gray-200"></div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
