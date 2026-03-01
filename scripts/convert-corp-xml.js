const fs = require('fs')
const path = require('path')
const xml2js = require('xml2js')

const xmlParser = new xml2js.Parser()

async function convertXmlToJson() {
  const outputPath = path.join(__dirname, '..', 'public', 'data', 'companies.json')

  // Vercel/CI: corp.xml 없으면 변환 건너뛰기 (이미 커밋된 companies.json 사용)
  const corpXmlPath = path.join(__dirname, '..', 'corp.xml')
  const fallbackPath = 'c:\\Users\\yourg\\Downloads\\corp.xml'
  const xmlPath = fs.existsSync(corpXmlPath) ? corpXmlPath : (fs.existsSync(fallbackPath) ? fallbackPath : null)

  if (!xmlPath) {
    if (fs.existsSync(outputPath)) {
      console.log('⏭️  corp.xml not found, using existing public/data/companies.json')
      return
    }
    console.error('❌ corp.xml not found and companies.json missing. Add corp.xml to project root or run convert locally first.')
    process.exit(1)
  }

  try {
    const outputDir = path.dirname(outputPath)
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }

    console.log('Reading corp.xml...')
    const xmlData = fs.readFileSync(xmlPath, 'utf-8')

    console.log('Parsing XML...')
    const result = await xmlParser.parseStringPromise(xmlData)

    // Extract companies from the XML structure
    const companies = result.result.list.map((item) => ({
      corp_code: item.corp_code[0],
      corp_name: item.corp_name[0],
      corp_eng_name: item.corp_eng_name[0],
      stock_code: item.stock_code[0],
      modify_date: item.modify_date[0],
    }))

    console.log(`Converting to JSON... (${companies.length} companies)`)
    fs.writeFileSync(outputPath, JSON.stringify(companies, null, 2), 'utf-8')

    console.log(`✅ Successfully converted ${companies.length} companies to ${outputPath}`)
  } catch (error) {
    console.error('❌ Error converting XML to JSON:', error.message)
    process.exit(1)
  }
}

convertXmlToJson()
