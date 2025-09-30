const express = require("express")
const path = require('path')
const fs = require('fs');
const xml2json = require('xml2js');
const axios = require('axios');
const { xsltProcess, xmlParse } = require('xslt-processor');
const { exec } = require('child_process');
const tmp = require('tmp');

const app = express();

app.use('/css', express.static(path.join(__dirname, 'views/assets/css')))
app.use('/js', express.static(path.join(__dirname, 'views/assets/js')))
app.use('/img', express.static(path.join(__dirname, 'views/assets/img')))
app.use('/components', express.static(path.join(__dirname, 'views/components')))

app.use('/css/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
app.use('/css/bootstrap-icons', express.static(path.join(__dirname, 'node_modules/bootstrap-icons/font')))
app.use('/js/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))
app.use('/js/jquery', express.static(path.join(__dirname, 'node_modules/jquery/dist')))
app.use('/js/popper', express.static(path.join(__dirname, 'node_modules/@popperjs/core/dist/umd')));

app.use(express.static(path.join(__dirname)));

app.get("/test", (req, res) => {
  res.sendFile(path.join(__dirname, 'views/test.html'))
});

app.get("/test2", (req, res) => {
  res.sendFile(path.join(__dirname, 'views/test2.html'))
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'views/index.html'))
});

app.get("/home", (req, res) => {
    res.sendFile(path.join(__dirname, 'views/index.html'))
});

app.get("/destination/:country", (req, res) => {
  res.sendFile(path.join(__dirname, 'views/destination.html'))
});

app.get("/converttopdf", (req, res) => {
  res.sendFile(path.join(__dirname, 'converttopdf.html'))
});

app.get("/tour/:id", (req, res) => {
  res.sendFile(path.join(__dirname, 'views/tour.html'))
});

app.post("/encrypt-test", express.json(), async (req, res) => {
  const value  = req.body.data;
  if (!value) {
    return res.status(400).json({ error: "Missing 'value' in request body" });
  }
  console.log('Value to encrypt:', value);
  try {
    const response = await axios.post('http://localhost:8220/v1/security/encrypt-data', {
        "input_type": "TEXT",
        "data": [value],
        "xml_tag": null
    });
    res.json(response.data);
  } catch (error) {
    console.error('Encryption error:', error);
    res.status(500).json({ error: "Encryption failed" });
  }
});

// app.get("/converttopdf", (req, res) => {
//   const xmlFile = path.join(__dirname, 'views/assets/xml/sample.xml');
//   const xslFile = path.join(__dirname, 'views/assets/xsl/sample.xsl');
//   const pdfFile = path.join(__dirname, 'views/assets/pdf/result.pdf');


//   try {
//     const xml = fs.readFileSync(xmlFile, 'utf8');
//     const xsl = fs.readFileSync(xslFile, 'utf8');
//     const transformed = xsltProcess(
//       xmlParse(xml),
//       xmlParse(xsl)
//     );

//     // Write transformed HTML to temp file
//     const tmpHtml = tmp.fileSync({ postfix: '.html' });
//     fs.writeFileSync(tmpHtml.name, transformed, 'utf8');

//     // Use wkhtmltopdf to convert HTML to PDF with millisecond timestamp filename
//     const timestamp = Date.now();
//     const pdfFileWithTimestamp = path.join(__dirname, 'views/assets/pdf', `result_${timestamp}.pdf`);
//     exec(`wkhtmltopdf ${tmpHtml.name} ${pdfFileWithTimestamp}`, (error) => {
//       tmpHtml.removeCallback();
//       if (error) {
//       console.error('PDF generation error:', error);
//       return res.status(500).send('PDF generation failed');
//       }
//       res.download(pdfFileWithTimestamp, `result_${timestamp}.pdf`, (err) => {
//       if (err) {
//         console.error('Error sending PDF:', err);
//       }
//       // Optionally delete the PDF after sending
//       // fs.unlinkSync(pdfFileWithTimestamp);
//       });
//     });
//   } catch (err) {
//     console.error('Error:', err);
//     res.status(500).send('Internal Server Error');
//   }
// });

app.get("/batchencryption", (req, res) => {
  const xmlDir = path.join(__dirname, 'views/assets/xml');
  const xmlResultDir = path.join(__dirname, 'views/assets/xml-result');
  fs.readdir(xmlDir, async (err, files) => {
    if (err) {
      console.error("Error reading XML files:", err);
      return res.status(500).send("Internal Server Error");
    }
    const parser = new xml2json.Parser();
    const builder = new xml2json.Builder();
    let xmlResultArray = [];

    for (const file of files) {
      if (path.extname(file) === '.xml') {
      const xml = fs.readFileSync(path.join(xmlDir, file), 'utf8');
      try {
        const data = await parser.parseStringPromise(xml);
        // Encrypt PD
        let pdValue = data.Response.Report[0].SMEProfile[0].CreditRating[0].PD[0];
        if (!isNaN(pdValue) && Number(pdValue) % 1 === 0) {
          pdValue = Number(pdValue).toString();
        }
        const pdResponse = await axios.post('http://localhost:8220/v1/security/encrypt-data', {
        "input_type": "TEXT",
        "data": [pdValue],
        "xml_tag": null
        });
        data.Response.Report[0].SMEProfile[0].CreditRating[0].PD[0] = pdResponse.data.data[0];

        // Encrypt PCTL
        let pctlValue = data.Response.Report[0].SMEProfile[0].CreditRating[0].PCTL[0];
        if (!isNaN(pctlValue) && Number(pctlValue) % 1 === 0) {
          pctlValue = Number(pctlValue).toString();
        }
        const pctlResponse = await axios.post('http://localhost:8220/v1/security/encrypt-data', {
        "input_type": "TEXT",
        "data": [pctlValue],
        "xml_tag": null
        });
        data.Response.Report[0].SMEProfile[0].CreditRating[0].PCTL[0] = pctlResponse.data.data[0];

        const xmlResult = builder.buildObject(data);
        xmlResultArray.push(xmlResult);

        // Write result to same filename
        fs.writeFileSync(path.join(xmlResultDir, file), xmlResult, 'utf8');
      } catch (error) {
        console.error(`Error processing file ${file}:`, error);
      }
      }
    }
    res.type('application/xml').send(xmlResultArray.join('\n'));
  });
});


// app.get("/batchbuyb2b", (req, res) => {
//   //read json list from b2btobuy.json
//   const jsonList = JSON.parse(fs.readFileSync(path.join(__dirname, 'b2btobuy.json'), 'utf8'));
//   //compile json into xml
//   const xmlData = json2xml(jsonList);
//   //get xml response from third party url
//   axios.post("https://third-party-url.com/api", {
//     data: 
//   })
//     .then(response => {
//       //parse xml into json
//       const jsonResponse = JSON.parse(response.data);
//       //check does it contain error or subject, and same RegNo with Request sent
//       //if no error and have subject proceed to thrid party second time with Seqno 002
//     })
//     .catch(error => {
//       console.error("Error fetching data from third party:", error);
//     });
// });




app.listen(5000, () => {
  console.log('Listening on port ' + 5000);
});