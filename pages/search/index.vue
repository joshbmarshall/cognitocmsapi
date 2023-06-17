<script setup>
const router = useRouter()

onMounted(() => {
  usePageStore().setSEO({
    title: 'Search',
    canonical: '/search',
  })
  router.replace('/search/')
})
</script>
