const wkhtmltopdf = require('wkhtmltopdf');
const fs = require('fs');

// Example HTML content to generate PDF
const htmlContent = `
  <html>
    <body>
      <h1>My PDF Document</h1>
      <p>This is a paragraph of text in the PDF.</p>
    </body>
  </html>
`;

const htmlBufferFromString = Buffer.from(htmlContent, 'utf-8');
const link = document.createElement('a');
link.href = `data:application/pdf;base64,${htmlBufferFromString}`;
link.download = `BTH PDF_`;
document.body.appendChild(link);
link.click();
document.body.removeChild(link);
// // Generate PDF from HTML string and save it to file
// wkhtmltopdf(htmlContent, { output: 'output.pdf' }, function (err, stream) {
//   if (err) {
//     console.error('Error generating PDF:', err);
//   } else {
//     console.log('PDF generated successfully');
//   }
// });
