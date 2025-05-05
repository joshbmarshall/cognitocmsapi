import { $axios } from '~cognito/plugins/axios'

export async function useGql<T>(query: string, variables?: object) {
  return <T>$axios.graphql(query, variables)
}

export function useGqlStatic<T>(query: string, variables?: MaybeRefOrGetter<object>) {
  let readyCallback = () => { }
  let refreshCallback = () => { }
  const onReady = (callback: () => void) => readyCallback = callback
  const onRefresh = (callback: () => void) => refreshCallback = callback

  const queryReady = ref(false)

  const data = ref<T>()
  const doQuery = async () => {
    data.value = await useGql<T>(query, toValue(variables))
    if (queryReady.value) {
      refreshCallback()
      return
    }
    queryReady.value = true
    readyCallback()
  }

  doQuery()
  watch(() => toValue(variables), doQuery)

  return { data, refresh: doQuery, execute: doQuery, onReady, onRefresh }
}
