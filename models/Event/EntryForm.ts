class EventEntryForm {
  event_id: number
  category_id: number
  address_id: number
  licence_id: number
  vehicle_id: number
  aasa_licence: string
  extras: []
  spectators: []
  merch: []
  url: string
  entry_transfer_from_invoice: number
  entry_transfer_from_name: string
  blood_type_id: number
  date_of_last_tetanus_vaccination: string
  has_allergies: boolean
  has_had_psychiatric_psychological_illness: boolean
  has_had_brain_injury: boolean
  has_had_heart_issues: boolean
  has_had_cancer_diabeties: boolean
  has_had_significant_illness_or_injury: boolean
  is_on_medication: boolean
  has_hearing_impairment: boolean
  has_hearing_disorder: boolean
  is_normal_eyesight: boolean
  date_of_last_medical_exam: string

  constructor(source?: Partial<EventEntryForm>) {
    this.event_id = 0
    this.category_id = 0
    this.address_id = 0
    this.licence_id = 0
    this.vehicle_id = 0
    this.aasa_licence = ''
    this.extras = []
    this.spectators = []
    this.merch = []
    this.url = ''
    this.entry_transfer_from_invoice = 0
    this.entry_transfer_from_name = ''
    this.blood_type_id = 0
    this.date_of_last_tetanus_vaccination = ''
    this.has_allergies = false
    this.has_had_psychiatric_psychological_illness = false
    this.has_had_brain_injury = false
    this.has_had_heart_issues = false
    this.has_had_cancer_diabeties = false
    this.has_had_significant_illness_or_injury = false
    this.is_on_medication = false
    this.has_hearing_impairment = false
    this.has_hearing_disorder = false
    this.is_normal_eyesight = false
    this.date_of_last_medical_exam = ''
    Object.assign(this, source)
  }
}

export { EventEntryForm }
