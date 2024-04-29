import { devbase } from '../devbase.js'

const config = {
  devbase,
  devURL: '',
  prodURL: '',
  siteURL: '',
  baseURL: '',
  isEcommerce: false,
  payment_to_user_id: 1,
  profile: {
    edit_date_of_birth: false,
    edit_drivers_licence: false,
    edit_emergency_contact: false,
    edit_company_name: false,
    edit_company_phone: false,
    edit_trading_name: false,
    edit_abn: false,
    edit_website: false,
    edit_facebook: false,
    edit_club_additional_member: false,
    club_additional_member_label: 'Partner Name',
    manage_addresses: false,
  },
  login: {
    code_only: false,
    google: false,
  },
  signUp: {
    ask_date_of_birth: false,
  },
  racers: {
    clientApiId: '',
    eventManager: '',
  },
  sentryDsn: '',
  show_back_to_top: true,
  pagebuilderImages: [
    {
      widget: 'core/call_to_action',
      images: [
        {
          name: 'left_image',
          image_aspect: '16x9',
          image_width: 300,
        },
        {
          name: 'right_image',
          image_aspect: '16x9',
          image_width: 300,
        },
      ],
    },
    {
      widget: 'core/hero_quote',
      images: [
        {
          name: 'overlay_image',
          image_width: 300,
        },
        {
          name: 'background_image',
          image_aspect: '16x9',
          image_width: 1920,
        },
        {
          name: 'background_video',
          image_aspect: '16x9',
          image_width: 1920,
        },
      ],
    },
    {
      widget: 'core/image_with_content',
      images: [
        {
          name: 'image',
          image_aspect: '16x9',
          image_width: 1920,
        },
      ],
    },
  ],
  group_args: {
    image_aspect: '1x1',
    image_width: 300,
  },
}

export { config }
