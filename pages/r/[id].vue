<script setup>
const route = useRoute()
navigateTo({ path: '/', query: { id: route.params.id } })
</script>
