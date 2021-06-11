<script lang="ts">
    import Edit from './Edit.svelte';
    import Overview from './Overview.svelte';
</script>

<main>
    <Overview />
    <Edit />
</main>

<style>
    main {
        padding: 1em;
        width: 100%;
        max-width: 640px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
    }
</style>
