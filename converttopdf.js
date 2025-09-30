import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { DOMParser } from 'xmldom';
import { Xslt, XmlParser } from 'xslt-processor'

const xslt = new Xslt();
const xmlParser = new XmlParser();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read XML and XSL files
const xmlString = fs.readFileSync(path.join(__dirname, 'views/assets/xml/sample.xml'), 'utf-8');
const xslString = fs.readFileSync(path.join(__dirname, 'views/assets/xsl/sample.xsl'), 'utf-8');

// Parse XML and XSL
// Parse XML and XSL
// (Removed unused xmlDoc and xslDoc variables)
// Transform XML with XSL to HTML
//const htmlString = xsltProcessor.xmlTransform(xmlDoc, xslDoc);

const outXmlString = await xslt.xsltProcess(
	xmlParser.xmlParse(xmlString),
	xmlParser.xmlParse(xslString)
);

// Save HTML output
fs.writeFileSync(path.join(__dirname, 'output.html'), outXmlString);

console.log('HTML generated: output.html');
