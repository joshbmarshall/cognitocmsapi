import { config } from '~/config'

const cgnTemplates = [
  'core/html',
  'core/heading',
  'core/faq',
  'core/raw_code',
  'core/form',
  'core/google_map',
  'core/button_link',
  'core/image_with_content',
  'core/person_list',
  'core/call_to_action',
  'core/hero_quote',
  'core/hero_testimonial',
  'core/testimonial_grid',
  'core/gallery',
  'core/gallery_group',
  'core/gift_voucher_purchase',
  'core/link_children',
  'core/image',
  'core/video',
]
const templateList = cgnTemplates.concat(config.siteSpecificTemplates)

export default templateList
