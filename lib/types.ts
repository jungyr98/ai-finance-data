export interface Company {
  corp_code: string
  corp_name: string
  corp_eng_name: string
  stock_code: string
  modify_date: string
}

export interface FinancialData {
  rcept_no: string
  reprt_code: string
  bsns_year: string
  corp_code: string
  stock_code: string
  fs_div: 'OFS' | 'CFS'
  fs_nm: string
  sj_div: 'BS' | 'IS'
  sj_nm: string
  account_nm: string
  thstrm_nm: string
  thstrm_dt: string
  thstrm_amount: string
  thstrm_add_amount?: string
  frmtrm_nm: string
  frmtrm_dt: string
  frmtrm_amount: string
  frmtrm_add_amount?: string
  bfefrmtrm_nm?: string
  bfefrmtrm_dt?: string
  bfefrmtrm_amount?: string
  bfefrmtrm_add_amount?: string
  ord: string
  currency: string
}

export interface OpenDartResponse {
  status: string
  message: string
  list: FinancialData[]
}

export interface ChartData {
  category: string
  current: number
  previous: number
  previous2: number
}
