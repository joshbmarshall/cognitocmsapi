<script setup lang="ts">
import { $racersaxios } from '~cognito/plugins/racersapi'
import { useToastStore } from '~cognito/stores/toast'

const toastStore = useToastStore()
const router = useRouter()
onMounted(() => {
  const state = new URL(location.href).searchParams.get('state')
  const code = new URL(location.href).searchParams.get('code')

  $racersaxios.oauth2GetToken(code, state)
    .then(() => {
      router.replace('/')
    })
    .catch((error) => {
      toastStore.addToast(error?.response?.data?.error_description || 'Could not sign in, please try again', 'fail', 5000)
    })
})
</script>
