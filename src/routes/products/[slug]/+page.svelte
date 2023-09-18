<script lang="ts">
    import type { PageData } from './$types';
    
    export let data: PageData;

    const product = data.product

    console.log(data)
</script>


<h1>{product.title}</h1>
