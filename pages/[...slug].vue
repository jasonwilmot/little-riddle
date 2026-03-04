<template>
    <main>
        <ContentDoc>
            <template #default="{ doc }">
                <article>
                    <h1 class="text-3xl">{{ doc.title }}</h1>
                    <ContentRenderer :value="doc" />
                </article>
            </template>
            <template #not-found>
                <div class="flex flex-col items-center justify-center min-h-[60vh] text-center">
                    <h1 class="text-4xl font-bold mb-2">Page not found</h1>
                    <p class="text-gray-500 mb-6">The page you're looking for doesn't exist.</p>
                    <NuxtLink to="/" class="text-blue-500 underline">Go home</NuxtLink>
                </div>
            </template>
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