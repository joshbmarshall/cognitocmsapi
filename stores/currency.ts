import { acceptHMRUpdate, defineStore } from 'pinia'
import { Tzlocator, getBrowserTimezone } from 'tzlocator'
import { CognitoTime } from '~cognito/models/Cognito/Time'
import { $axios } from '~cognito/plugins/axios'

export const useCurrencyStore = defineStore({
  id: 'currency',

  state: () => {
    return {
      last_updated: new CognitoTime(),
      sitecurrency: 'aud',
      mycurrency: 'aud',
      conversions: <{
        currency: string
        rate: number
      }[]>[],
      mylocale: 'en',
    }
  },

  actions: {
    async initialise() {
      let eur = await $axios.get('https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/eur.json')
      if (!eur) {
        eur = await $axios.get('https://raw.githubusercontent.com/fawazahmed0/currency-api/1/latest/currencies/eur.json')
      }
      if (!eur) {
        return
      }
      this.last_updated = new CognitoTime(eur.data.date)
      this.conversions = Object.entries(eur.data.eur).map(([currency, rate]) => {
        return {
          currency,
          rate,
        }
      })
      const tzlocator = new Tzlocator()
      const location = tzlocator.get(getBrowserTimezone())
      if (location) {
        this.mycurrency = location.currency.code.toLowerCase()
        this.mylocale = location.getMainLocale()
      }
    },
    convert(amount: number, to_currency?: string, from_currency?: string): number {
      if (!to_currency) {
        to_currency = this.mycurrency
      }

      if (!from_currency) {
        from_currency = this.sitecurrency
      }

      // Do we need to initialise?
      if (!this.conversions.length) {
        this.initialise()
        return 0
      }

      // Do we need to refresh?
      if (this.last_updated.diffInDays(new CognitoTime()) > 1) {
        this.initialise()
        return 0
      }

      // Do the lookup
      const fromConversionRate = this.conversions.find(e => e.currency === from_currency)?.rate
      const toConversionRate = this.conversions.find(e => e.currency === to_currency)?.rate

      if (!fromConversionRate) {
        return 0
      }
      if (!toConversionRate) {
        return 0
      }

      // Using EUR as reference, convert between two other currencies
      const conversionRate = toConversionRate / fromConversionRate

      return amount * conversionRate
    },
    formatTo(amount: number, currency: string): string {
      return new Intl.NumberFormat(this.mylocale, {
        style: 'currency',
        currency,
      }).format(amount)
    },
    convertAndFormat(amount: number, to_currency?: string, from_currency?: string): string {
      if (!to_currency) {
        to_currency = this.mycurrency
      }

      if (!from_currency) {
        from_currency = this.sitecurrency
      }

      return this.formatTo(this.convert(amount, to_currency, from_currency), to_currency)
    },
  },

  persist: true,
  share: {
    enable: true,
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCurrencyStore, import.meta.hot))
}
