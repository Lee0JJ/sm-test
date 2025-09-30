const puppeteer = require('puppeteer');
const fs = require('fs');

// Your HTML content
const htmlContent = `
<html>
    <head>
        <style>
            html { zoom: 0.5; }
            body { font-family: Arial, Helvetica, sans-serif; }
            .bg-blue { background-color: #add8e6; }
            .datetime-now { font-size: 10px; float: right; margin-top: 11px; }
            .border-none td { border: none; }
            .text-center { text-align: center; }
            .cell-total { text-align: center; border-bottom: 4px double !important; border-top: 1px solid #000 !important; }
            table { width: 100%; border-collapse: collapse; margin-top: 5px; page-break-inside: avoid; }
            table td, table th { border: 1px solid black; padding: 3px; }
            table th { color: white; text-align: center; background-color: #716868; }
            table td {word-break: break-word;}
        </style>
    </head>
    <body style="font-size:12px; font-family:Arial, Helvetica;">
        <p style="font-size:20px; margin:10px 0px;">Sunway Money Sdn. Bhd.</p>
        <p style="font-size:20px; text-align:right;margin-top: -10px">Private & Confidential. For Internal Use Only.</p>
        <p style="font-size:20px; text-align:right;margin-top: -10px">Generation Date/Time: 2025-05-15 16:08:13</p>
        <br>
        <div style="page-break-inside: avoid">
        <p style="font-size:20px; margin:0;">Batch Number: <b>BTH-2025-0097</b></p>
        <p style="font-size:20px; margin:0">SMSB Bank:OCBC 9987 MYR</p>
        <p style="font-size:20px;margin:0;">Payout Method: OTT Text File</p>
        <br>
        <div>
        <table>
        <thead>
        <tr>
            <th>Transaction Reference No</th>
            <th>Beneficiary Name</th>
            <th>Payout Currency</th>
            <th>Payout Amount</th>
            <th>Remarks</th>
            <th>Bank Country</th>
            <th>Swift Code</th>
            <th>Bank Name</th>
            <th>Account Number</th>
            <th>IBAN Number</th>
            <th>Routing Codes</th>
            <th>Purpose <br>of<br>Payment<br>(Bank)</th>
            <th>Amount to deduct from SMSB Bank</th>
            <th>Collection Status</th>
            <th>Approval Status</th>
            <th>Approval By</th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td>TRN-2025-0000466</td>
            <td>TTSGD</td>
            <td>SGD</td>
            <td style="word-break: normal">31.90</td>
            <td><br></td>
            <td>SINGAPORE</td>
            <td>HKBCCATT001</td>
            <td>BANK NEGARA INDONESIA (PERSERO) P.T</td>
            <td>413423100</td>
            <td></td>
            <td></td>
            <td>16410</td>
            <td style="word-break: normal">143.37</td>
            <td>Manual Collection (Successful)</td>
            <td>Pending to approve in bank</td>
            <td></td>
        </tr>
        <tr>
            <td>TRN-2025-0000491</td>
            <td>TTSGD</td>
            <td>SGD</td>
            <td style="word-break: normal">34.49</td>
            <td><br></td>
            <td>SINGAPORE</td>
            <td>HKBCCATT001</td>
            <td>BANK NEGARA INDONESIA (PERSERO) P.T</td>
            <td>413423100</td>
            <td></td>
            <td></td>
            <td>16410</td>
            <td style="word-break: normal">118.01</td>
            <td>Manual Collection (Successful)</td>
            <td>Pending to approve in bank</td>
            <td></td>
        </tr>
        <tr class="border-none" style="background-color: yellow;">
            <td colspan="3" style="padding-top :10px;"><b>TOTAL:</b></td>
            <td class="cell-total" colspan="1">66.39</td>
            <td colspan="8" style="padding-top :10px;"><b>&ensp;TOTAL:</b></td>
            <td class="cell-total" colspan="1">261.38</td>
            <td colspan="3"></td>
        </tr>
        <tr style="height: 50px;"></tr>
        <tr class="border-none bg-blue">
            <td colspan="12" style="padding-top :15px;"><b>GRAND TOTAL</b></td>
            <td class="cell-total" colspan="1">261.38</td>
            <td colspan="3"></td>
        </tr>
        </tbody>
        </table>
        </div>
    </body>
</html>
`;

async function generatePdf() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Set content for the PDF
  await page.setContent(htmlContent);

  // Add watermark
  await page.addStyleTag({
    content: `
      body::after {
        content: 'CONFIDENTIAL';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 5em;
        color: rgba(255, 0, 0, 0.3);
        z-index: 9999;
        opacity: 0.5;
        pointer-events: none;
        transform: rotate(-45deg);
      }
    `,
  });

  // Generate the PDF with custom options including footer
  const buffer =await page.pdf({
    path: 'output_with_footer.pdf',
    format: 'A4',
    printBackground: true,
    displayHeaderFooter: true, // Enable header/footer
    margin: {
      top: '24px',
      right: '24px',
      bottom: '24px',
      left: '24px',
    },
    // footer: {
    //   height: '20px', // Increased footer height for better visibility
    //   contents: {
    //     default: `
    //       <div style="text-align: center; font-size: 10px; color: #444;">
    //         Page {{page}} of {{pages}}
    //       </div>
    //     `, // Display page number and total pages in the center of the footer
    //   },
    // },
    footerTemplate: `
        <div style="width: 100%; font-size: 9px; padding: 5px 5px 0; color: #bbb; position: relative;">
            <div style="position: absolute; right: 10px; top: 5px;"><span class="pageNumber"></span></div>
            </div>
        `,
  });

  console.log('PDF with watermark, footer, and borders generated successfully');
  await browser.close();

  var base64PDF = buffer.toString('base64');
  return base64PDF;
}


const path = require('path');

/**
 * Saves a PDF buffer or base64 string to a PDF file.
 * @param {Buffer|string} data - PDF data as Buffer or base64 string
 * @param {string} outputPath - Path to save the PDF file
 */
async function saveBufferToPDF(data, outputPath) {
    data = await generatePdf();
    outputPath = 'abc';
    // Ensure the output path has a .pdf extension
    if (path.extname(outputPath).toLowerCase() !== '.pdf') {
        outputPath += '.pdf';
    }

    console.log("typess", data);
    let buffer;
    if (typeof data === 'string') {
        // Assume base64 string
        buffer = Buffer.from(data, 'base64');
    } else if (Buffer.isBuffer(data)) {
        buffer = data;
    } else {
        throw new Error('Input must be a Buffer or a base64 string');
    }

    fs.writeFileSync(outputPath, buffer);
    console.log(`PDF saved to ${outputPath}`);
}

saveBufferToPDF();