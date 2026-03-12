(function(){

function extrairExames(texto) {
  texto = texto.replace(/\r\n|\n|\t/g, ' ');
  texto = texto.replace(/\s{2,}/g, ' ');

  const resultado = [];

  const regexHemograma = {
    HEMOGLOBINA: /Hemoglobina\s*\.{0,}\s*[:]*\s*([0-9.,]+)/i,
    LEUCÓCITOS: /Leuc[óo]citos\s*\.{0,}\s*[:]*\s*([0-9.,]+)/i,
    PLAQUETAS: /Plaquetas\s*\.{0,}\s*[:]*\s*([0-9.,]+)/i,
    NEUTRÓFILOS: /Neutrófilos\s*\.{0,}\s*[:]*\s*([0-9.,]+)/i,
    LINFÓCITOS: /Linf[óo]citos\s*\.{0,}\s*[:]*\s*([0-9.,]+)/i
  };

  for (const [key, regex] of Object.entries(regexHemograma)) {
    const match = texto.match(regex);
    if (match) {
      if (key === 'NEUTRÓFILOS' || key === 'LINFÓCITOS') {
        resultado.push(`${key}: ${match[1]}%`);
      } else {
        resultado.push(`${key}: ${match[1]}`);
      }
    }
  }

  const regexGasometria = {
    pH: /pH\s*[:]*\s*([0-9.,]+)/i,
    pCO2: /pCO2\s*[:]*\s*([0-9.,]+)/i,
    pO2: /pO2\s*[:]*\s*([0-9.,]+)/i,
    HCO3: /HCO3\s*[:]*\s*([0-9.,]+)/i,
    BE: /BE\s*(?:\(Excesso de Base\))?\s*[:]*\s*([-\d.,]+)/i,
    ctCO2: /ctCO2\s*[:]*\s*([0-9.,]+)/i,
    SO2: /SO2\s*[:]*\s*([0-9.,]+)/i,
    Lactato: /Lactato\s*[:]*\s*([0-9.,]+)/i
  };

  for (const [key, regex] of Object.entries(regexGasometria)) {
    const match = texto.match(regex);
    if (match) resultado.push(`${key}: ${match[1]}`);
  }

  const regexBilirrubina = {
    'BILIRRUBINA TOTAL': /TOTAL\s*[:]*\s*([0-9.,]+)/i,
    'BILIRRUBINA DIRETA': /DIRETA\s*[:]*\s*([0-9.,]+)/i,
    'BILIRRUBINA INDIRETA': /INDIRETA\s*[:]*\s*([0-9.,]+)/i
  };

  for (const [key, regex] of Object.entries(regexBilirrubina)) {
    const match = texto.match(regex);
    if (match) resultado.push(`${key}: ${match[1]}`);
  }

  const regexOutros = {
    'CÁLCIO TOTAL': /C[áa]lcio Total\s*Valor de referência\s*Resultado\s*[:]*\s*([0-9.,]+)/i,
    'CREATININA': /CREATININA\s*RESULTADO\s*[:]*\s*([0-9.,]+)/i,
    'FÓSFORO SÉRICO': /F[óo]sforo S[ée]rico\s*Valor de referência\s*Resultado\s*[:]*\s*([0-9.,]+)/i,
    'MAGNESIO': /MAGNESIO\s*Valor de referência\s*Resultado\s*[:]*\s*([0-9.,]+)/i,
    'POTASSIO SÉRICO': /POTASSIO S[ée]rico\s*Valor de referência\s*Resultado\s*[:]*\s*([0-9.,]+)/i,
    'PROTEINA C REATIVA': /PROTEINA C REATIVA\s*Valor de referência\s*Resultado\s*[:]*\s*([0-9.,]+)/i,
    'SÓDIO SÉRICO': /S[óo]dio S[ée]rico\s*Valor de referência\s*Resultado\s*[:]*\s*([0-9.,]+)/i,
    'UREIA': /UREIA\s*Valor de referência\s*Resultado\s*[:]*\s*([0-9.,]+)/i,
    'CÁLCIO IÔNICO': /C[áa]lcio I[oô]nico\s*[:]*\s*([0-9.,]+)/i,
  };

  for (const [key, regex] of Object.entries(regexOutros)) {
    const match = texto.match(regex);
    if (match) resultado.push(`${key}: ${match[1]}`);
  }

  return resultado.join(' // ');
}


async function obterTextoPDF() {

  if (!window.PDFViewerApplication) {
    alert("PDFViewerApplication não encontrado. Abra o PDF no visualizador do navegador.");
    return;
  }

  const pdf = window.PDFViewerApplication.pdfDocument;
  const total = pdf.numPages;

  let texto = "";

  for (let i = 1; i <= total; i++) {

    const page = await pdf.getPage(i);
    const content = await page.getTextContent();

    const pageText = content.items
      .map(item => item.str)
      .join(" ");

    texto += pageText + " ";
  }

  const resultado = extrairExames(texto);

  if (resultado) {
    alert(resultado);
  } else {
    alert("Nenhum exame encontrado.");
  }
}

obterTextoPDF();

})();