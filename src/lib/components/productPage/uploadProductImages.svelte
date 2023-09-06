<script lang="ts">
	import { writable, type Writable } from 'svelte/store';

	let previewURL: string;
	let uploading = false;
	export let file: any = null;
	export let files: any[] = [];
	let imagesUrl: Writable<string[]> = writable([]);

	const previewImage = (e: any) => {
		uploading = true;
		file = e.target.files[0];
		files.push(e.target.files[0]);
		previewURL = URL.createObjectURL(file);
		imagesUrl.update((arr) => [...arr, previewURL]);
		uploading = false;
	};
</script>

<h2 class="card-title">Upload a Product Photos</h2>

<div class="max-w-screen-md w-full">
	<div class="form-control w-full max-w-xs my-10 mx-auto text-center">
		<img src={previewURL} alt="photoURL" width="350" height="350" class="mx-auto" />
		<label for="photoURL" class="label">
			<span class="label-text">Pick a file</span>
		</label>
		<input
			on:change={previewImage}
			name="photoURL"
			type="file"
			class="file-input file-input-bordered w-full max-w-xs"
			accept="image/*"
		/>
		{#if uploading}
			<p>Uploading...</p>
			<progress class="progress progress-info w-56 mt-6" />
		{/if}
	</div>
	<div class="flex flex-wrap">
		{#each $imagesUrl as url, index (url)}
			<div>
				<img src={url} alt="photoURL" width="150" height="150" class="mx-2" />
				<button
					class="btn btn-circle btn-error btn-xs"
					on:click={() => {
						const currentImages = $imagesUrl;
						currentImages.splice(index, 1);
						imagesUrl.set(currentImages);
						files.splice(index, 1);
					}}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-3 w-3"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/></svg
					>
				</button>
			</div>
		{/each}
	</div>
</div>
