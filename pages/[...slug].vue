<template>
    <main>
        <ContentDoc v-slot="{ doc }">
            <article>
                <h1 class="text-3xl">{{ doc.title }}</h1>
                <ContentRenderer :value="doc" />
            </article>
        </ContentDoc>
    </main>
</template>

<style lang="postcss">
h1 {
    @apply mb-3 text-red-500 text-3xl;
}

h2 {
    @apply mb-1 text-2xl;
}


</style>