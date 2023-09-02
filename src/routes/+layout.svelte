<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { themeChange } from 'theme-change';

	// NOTE: the element that is using one of the theme attributes must be in the DOM on mount
	onMount(() => {
		themeChange(false);
		// 👆 false parameter is required for svelte
	});
</script>

<select data-choose-theme>
	<option value="">Default</option>
	<option value="dark">Dark</option>
	<option value="night">Night</option>
	<option value="coffe">Coffe</option>
	<option value="light">Light</option>
	<option value="cupcake">Cupcake</option>
	<option value="luxury">Luxury</option>
</select>
<slot />
