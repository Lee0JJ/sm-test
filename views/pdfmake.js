    var codeBag = document.querySelector('#code');
    
    
    function convert () {
      var errorStyles = document.querySelector('#styles_error');
      var errorOptions = document.querySelector('#options_error');
      // hide errors
      errorStyles.style.display="none";
      errorOptions.style.display="none";
      // retrieve options
      try {
        var p = document.querySelector('#options').value.trim() || '{}';
        var options = JSON.parse(document.querySelector('#options').value.trim() || '{}');
      } catch(err) {
        errorOptions.style.display='block';
        errorOptions.innerHTML = err;
      }
      // retrieve styles
      try {
        var styles = JSON.parse(document.querySelector('#styles').value.trim() || '{}');
      } catch(err) {
        errorStyles.style.display='block';
        errorStyles.innerHTML = err;
      }
      var val = htmlToPdfmake(code.value, options);
      var dd = (typeof val.content !== "undefined" ? val : {content:val});
      if (typeof styles === 'object') dd.styles = styles;
      document.querySelector('#result').value = "var dd = " + JSON.stringify(dd, null, '  ');
      // is IE ?
      var isIE = '-ms-scroll-limit' in document.documentElement.style && '-ms-ime-align' in document.documentElement.style;
      if (isIE) {
        document.getElementById('pdf').style.display='none';
        document.getElementById('pdf_ie').style.display='block';
        pdfMake.createPdf(dd).download();
      } else {
        pdfMake.createPdf(dd).getDataUrl(function(outDoc) {
          document.getElementById('pdf').src = outDoc;
        });
      }
}

convert();

toHTML();