import { type UserModule } from '~/types'
import { config } from '~/config'

// https://unhead-schema-org.harlanzw.com/
export const install: UserModule = async (ctx) => {
  // Disables on client build, allows 0kb runtime
  if (ctx.isClient && import.meta.env.PROD) {
    return
  }
  if (!ctx.head) {
    return
  }

  const { SchemaOrgUnheadPlugin } = await import('@vueuse/schema-org')
  ctx.head.use(SchemaOrgUnheadPlugin({
    // config
    host: config.siteURL,
  }, () => {
    return {
      path: ctx.router.currentRoute.value.path,
      ...ctx.router.currentRoute.value.meta,
    }
  }))
}
