const OPENDART_API_URL = 'https://opendart.fss.or.kr/api/fnlttSinglAcnt.json'

export async function fetchFinancialData(
  corp_code: string,
  bsns_year: string,
  reprt_code: string
) {
  const apiKey = process.env.OPENDART_API_KEY

  if (!apiKey) {
    throw new Error('OPENDART_API_KEY is not configured')
  }

  const params = new URLSearchParams({
    crtfc_key: apiKey,
    corp_code,
    bsns_year,
    reprt_code,
  })

  const response = await fetch(`${OPENDART_API_URL}?${params}`, {
    next: { revalidate: 3600 },
  })

  if (!response.ok) {
    throw new Error(`OpenDart API error: ${response.status}`)
  }

  const data = await response.json()

  if (data.status !== '000') {
    const errorMessage = getErrorMessage(data.status)
    throw new Error(`OpenDart API error: ${data.status} - ${errorMessage}`)
  }

  return data
}

function getErrorMessage(status: string): string {
  const errors: { [key: string]: string } = {
    '010': '등록되지 않은 키입니다',
    '011': '사용할 수 없는 키입니다',
    '012': '접근할 수 없는 IP입니다',
    '013': '조회된 데이터가 없습니다',
    '014': '파일이 존재하지 않습니다',
    '020': '요청 제한을 초과하였습니다',
    '021': '조회 가능한 회사 개수가 초과하였습니다',
    '100': '필드의 부적절한 값입니다',
    '101': '부적절한 접근입니다',
    '800': '시스템 점검 중입니다',
    '900': '정의되지 않은 오류가 발생하였습니다',
    '901': '사용자 계정 정보가 만료되었습니다',
  }
  return errors[status] || '알 수 없는 오류'
}
