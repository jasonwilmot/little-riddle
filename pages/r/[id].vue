<script setup>
const route = useRoute()
await navigateTo({ path: '/', query: { id: route.params.id } }, { redirectCode: 302 })
</script>
