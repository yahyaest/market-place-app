<script lang="ts">
    let email : string;
    let username : string
    let password : string
    let password2 : string
    let phone : number
	let previewURL: string;
	let file: any = null;
	let uploading = false;

	const previewImage = (e: any) => {
		uploading = true;
		file = e.target.files[0];
		previewURL = URL.createObjectURL(file);
		uploading = false;
	};
</script>

<div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
	<div class="sm:mx-auto sm:w-full sm:max-w-sm">
		<img
			class="mx-auto h-10 w-auto"
			src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
			alt="Your Company"
		/>
		<h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight">
			Sign up to your account
		</h2>
	</div>

	<div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
		<div class="space-y-6">
			<div>
				<label for="email" class="block text-sm font-medium leading-6"
					>Email address</label
				>
				<div class="mt-2">
					<input
						id="email"
						name="email"
						type="email"
						autocomplete="email"
						required
						class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        bind:value={email}
					/>
				</div>
			</div>

			<div>
				<label for="username" class="block text-sm font-medium leading-6">Username</label
				>
				<div class="mt-2">
					<input
						id="username"
						name="username"
						type="text"
						autocomplete="username"
						required
						class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        bind:value={username}
					/>
				</div>
			</div>

			<div>
				<label for="password" class="block text-sm font-medium leading-6"
					>Password</label
				>
				<div class="mt-2">
					<input
						id="password"
						name="password"
						type="password"
						autocomplete="current-password"
						required
						class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        bind:value={password}
					/>
				</div>
			</div>

			<div>
				<label for="password2" class="block text-sm font-medium leading-6"
					>Confirm Password</label
				>
				<div class="mt-2">
					<input
						id="password2"
						name="password2"
						type="password"
						autocomplete="current-password"
						required
						class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        bind:value={password2}
					/>
				</div>
			</div>

			<div>
				<label for="phone" class="block text-sm font-medium leading-6">Phone</label
				>
				<div class="mt-2">
					<input
						id="phone"
						name="phone"
						type="number"
						autocomplete="cc-number"
						required
						class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        bind:value={phone}
					/>
				</div>
			</div>

			<h2 class="font-semibold leading-6">
				Upload Your Account Photo
			</h2>

			<div class="max-w-screen-md w-full">
				<div class="form-control w-full max-w-xs my-10 mx-auto text-center">
					{#if previewURL}
						<img src={previewURL} alt="photoURL" width="350" height="350" class="mx-auto" />
					{/if}
					<label for="photoURL" class="label">
						<span class="label-text">Pick a file</span>
					</label>
					<input
						on:change={previewImage}
						name="photoURL"
						type="file"
						class="file-input file-input-bordered file-input-primary w-full max-w-xs "
						accept="image/*"
					/>
					{#if uploading}
						<p>Uploading...</p>
						<progress class="progress progress-info w-56 mt-6" />
					{/if}
				</div>
			</div>

			<div class="space-y-6">
				<button
					type="submit"
					class="flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 btn btn-primary"
					>Register</button
				>
				<p class="mt-10 text-center text-sm">
					Already a member?
					<a href="#" class="font-semibold leading-6"
						>Sign In</a
					>
				</p>
				<a
                    href="login"
					class="flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 btn btn-primary"
					>Sign in</a
				>
			</div>
		</div>
	</div>
</div>
