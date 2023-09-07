<script setup lang="ts">
import { $racersaxios } from '~cognito/plugins/racersapi'

const router = useRouter()
onMounted(() => {
  const state = new URL(location.href).searchParams.get('state')
  const code = new URL(location.href).searchParams.get('code')

  $racersaxios.oauth2GetToken(code, state)
    .then(() => {
      router.replace('/')
    })
})
</script>
