const fs = require('fs')
const path = require('path')
const xml2js = require('xml2js')

const xmlParser = new xml2js.Parser()

async function convertXmlToJson() {
  try {
    const corpXmlPath = 'c:\\Users\\yourg\\Downloads\\corp.xml'
    const outputPath = path.join(__dirname, '..', 'public', 'data', 'companies.json')

    // Create output directory if it doesn't exist
    const outputDir = path.dirname(outputPath)
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }

    console.log('Reading corp.xml...')
    const xmlData = fs.readFileSync(corpXmlPath, 'utf-8')

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
