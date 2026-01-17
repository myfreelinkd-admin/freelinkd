<script>
	import SecondaryNavbar from '../frontend/components/layout/secondary-navbar.svelte';
	import HeroSection from '../frontend/components/HeroSection.svelte';
	import AboutSection from '../frontend/components/AboutSection.svelte';
	import Flowchart from '../frontend/components/Flowchart.svelte';
	import Philosophy from '../frontend/components/Philosophy.svelte';
	import Footer from '../frontend/components/layout/footer.svelte';
</script>

<SecondaryNavbar title="E-Learning" />
<main class="w-full overflow-x-hidden">
	<HeroSection />
	<Flowchart />
	<AboutSection />
	<Philosophy />
</main>
<Footer />
