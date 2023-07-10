import { type UserModule } from '~/types'
import { siteURL } from '~/config'

// https://unhead-schema-org.harlanzw.com/
export const install: UserModule = async (ctx) => {
  // Disables on client build, allows 0kb runtime
  if (ctx.isClient && import.meta.env.PROD) {
    return
  }

  const { SchemaOrgUnheadPlugin } = await import('@vueuse/schema-org')
  ctx.head.use(SchemaOrgUnheadPlugin({
    // config
    host: siteURL,
  }, () => {
    return {
      path: ctx.router.currentRoute.value.path,
      ...ctx.router.currentRoute.value.meta,
    }
  }))
}
