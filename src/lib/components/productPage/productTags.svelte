<script lang="ts">
	import { writable, type Writable } from 'svelte/store';

	const severity = ['badge-info', 'badge-success', 'badge-warning', 'badge-error', 'badge-primary', 'badge-secondary', 'badge-accent', 'badge-ghost'];

	export let tags: Writable<string[]> = writable([]);
	let currentTag = '';
	let warningMessage = '';

	const handleKeyPress = (event: any) => {
		if (event.key === 'Enter') {
			const tagsArray = $tags;
			if (!tagsArray.includes(currentTag) && currentTag.trim() !== '') {
				tags.update((arr) => [...arr, currentTag]);
				currentTag = '';
				warningMessage = '';
			} else {
				if (currentTag) {
					currentTag = '';
					warningMessage = 'Tag already added';
				}
			}
		}
	};
</script>

<div class="space-y-12 max-w-screen-md w-full">
	<h1>Product Tags</h1>
	<div class="flex flex-col">
		<div class="flex flex-wrap">
			{#each $tags as tag, index (tag)}
				<div class={`badge badge-lg ${severity[index % severity.length]} gap-2 m-2`}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						class="inline-block w-4 h-4 stroke-current"
						on:click={() => {
							const currentTags = $tags;
							currentTags.splice(index, 1);
							tags.set(currentTags);
						}}
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/></svg
					>
					{tag}
				</div>
			{/each}
		</div>
		<input class="my-5 add_tag" type="text" bind:value={currentTag} on:keydown={handleKeyPress} />
		{#if warningMessage}
			<div class="alert alert-warning">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="stroke-current shrink-0 h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
					/></svg
				>
				<span>Warning: {warningMessage}</span>
			</div>
		{/if}
	</div>
</div>
