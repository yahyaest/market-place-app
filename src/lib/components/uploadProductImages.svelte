<script lang="ts">
	let previewURL: string;
	let uploading = false;
	export let file: any = null;

	const previewImage = (e: any) => {
		uploading = true;
		file = e.target.files[0];
		previewURL = URL.createObjectURL(file);
		uploading = false;
	};
</script>

<h2 class="card-title">Upload a Product Photos</h2>

<form class="max-w-screen-md w-full" enctype="multipart/form-data">
	<div class="form-control w-full max-w-xs my-10 mx-auto text-center">
		<img src={previewURL} alt="photoURL" width="256" height="256" class="mx-auto" />
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
</form>
