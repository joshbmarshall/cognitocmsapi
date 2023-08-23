const config = {
  devURL: '',
  prodURL: '',
  siteURL: '',
  baseURL: '',
  isEcommerce: false,
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
    manage_addresses: false,
  },
  sentryDsn: '',
  show_back_to_top: true,
  pagebuilderImages: [
    {
      widget: 'core/call_to_action',
      images: [
        {
          name: 'left_image',
          aspect: '16x9',
          width: 300,
        },
        {
          name: 'right_image',
          aspect: '16x9',
          width: 300,
        },
      ],
    },
    {
      widget: 'core/hero_quote',
      images: [
        {
          name: 'background_image',
          aspect: '16x9',
          width: 1920,
        },
      ],
    },
  ],
}

export { config }
