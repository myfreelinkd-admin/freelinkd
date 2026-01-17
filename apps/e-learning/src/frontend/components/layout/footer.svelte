<script lang="ts">
	const socialLinks = [
		{
			href: 'https://facebook.com',
			label: 'Facebook',
			path: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z'
		},
		{
			href: 'https://www.instagram.com/freelinkd/',
			label: 'Instagram',
			path: 'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z M17.5 6.5h.01 M16 2H8a4 4 0 0 0-4 4v8a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4V6a4 4 0 0 0-4-4z'
		},
		{
			href: 'https://twitter.com',
			label: 'Twitter',
			path: 'M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z'
		},
		{
			href: 'https://linkedin.com',
			label: 'LinkedIn',
			path: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z M2 9h4v12H2z M2 4a2 2 0 1 1 2 2 2 2 0 0 1-2-2z'
		}
	];

	const footerLinks = [{ href: '/faq', label: 'F.A.Q' }];
</script>

<div class="w-full bg-[var(--primary)] px-6 pt-16 font-sans text-white">
	<div class="row-gap-6 mx-auto mb-8 grid max-w-7xl gap-10 sm:grid-cols-2 lg:grid-cols-4">
		<div class="sm:col-span-2">
			<a href="/" aria-label="Go home" title="Freelinkd" class="inline-flex items-center">
				<img
					src="/assets/freelinkd.svg"
					alt="Freelinkd Logo"
					width="120"
					height="80"
					class="max-h-20 w-auto"
				/>
			</a>
			<div class="mt-6 lg:max-w-sm">
				<p class="text-sm text-gray-200">
					Kickstart your professional journey with meaningful projects. Build your portfolio, earn
					an income, and connect with innovative SMEs ready to hire emerging talent.
				</p>
				<p class="mt-4 text-sm text-gray-200">
					Tap into a verified network of ambitious, digitally native students and Gen Z
					professionals. The fresh perspective your project needs is on Freelinkd.
				</p>
			</div>
		</div>

		<!-- Kontak -->
		<div class="space-y-2 text-sm">
			<p class="text-base font-bold tracking-wide text-white">Contacts</p>
			<div class="flex">
				<p class="mr-1 text-gray-200">Phone:</p>
				<a
					href="tel:+6285717269057"
					class="text-gray-100 transition-colors duration-300 hover:text-gray-300"
				>
					+62 857-1726-9057
				</a>
			</div>
			<div class="flex">
				<p class="mr-1 text-gray-200">Email:</p>
				<a
					href="mailto:info.freelinkd@gmail.com"
					class="text-gray-100 transition-colors duration-300 hover:text-gray-300"
				>
					info.freelinkd@gmail.com
				</a>
			</div>
			<div class="flex">
				<p class="mr-1 text-gray-200">Address:</p>
				<a
					href="https://www.google.com/maps"
					target="_blank"
					rel="noopener noreferrer"
					class="text-gray-100 transition-colors duration-300 hover:text-gray-300"
				>
					Jl. H. R. Rasuna Said No.22 Kav. C
				</a>
			</div>
		</div>

		<!-- Social -->
		<div>
			<span class="text-base font-bold tracking-wide text-white"> Social </span>
			<div class="mt-4 flex space-x-4">
				{#each socialLinks as social}
					<a
						href={social.href}
						target="_blank"
						rel="noopener noreferrer"
						aria-label={social.label}
						class="group"
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
							class="h-5 w-5 transform text-gray-300 transition-colors duration-200 group-hover:scale-110 hover:text-white"
						>
							<path d={social.path} />
						</svg>
					</a>
				{/each}
			</div>
			<p class="mt-4 text-sm text-gray-300">
				Connect with fellow creators and independent professionals. Follow us to grow your network.
			</p>
		</div>
	</div>

	<!-- Bagian Bawah -->
	<div
		class="mx-auto flex max-w-7xl flex-col-reverse justify-between border-t border-gray-600 pt-5 pb-10 lg:flex-row"
	>
		<p class="text-sm text-gray-300">&copy; Copyright 2026 Freelinkd. All rights reserved.</p>
		<ul class="mb-3 flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-5 lg:mb-0">
			{#each footerLinks as link}
				<li>
					<a
						href={link.href}
						class="text-sm text-gray-300 transition-colors duration-200 hover:text-gray-100"
					>
						{link.label}
					</a>
				</li>
			{/each}
		</ul>
	</div>
</div>
