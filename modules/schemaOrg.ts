import type { UserModule } from '~/types'

// https://unhead-schema-org.harlanzw.com/
// Note: Schema.org is now handled via auto-imports in components
// using useSchemaOrg(), defineArticle(), etc.
export const install: UserModule = async () => {
  // Plugin installation is no longer needed with @unhead/schema-org/vue
  // Components now use useSchemaOrg() directly with auto-imports
}
