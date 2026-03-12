javascript:(function(){

function extrairExames(texto) {
  texto = texto.replace(/\r\n|\n|\t/g, ' ');
  texto = texto.replace(/\s{2,}/g, ' ');

  const resultado = [];

  const regexHemograma = {
    HEMOGLOBINA: /Hemoglobina\s*\.{0,}\s*[:]*\s*([0-9.,]+)/i,
    LEUCÓCITOS: /Leuc[óo]citos\s*\.{0,}\s*[:]*\s*([0-9.,]+)/i,
    PLAQUETAS: /Plaquetas\s*\.{0,}\s*[:]*\s*([0-9.,]+)/i,
    NEUTRÓFILOS: /Neutr[óo]filos\s*\.{0,}\s*[:]*\s*([0-9.,]+)/i,
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
    BE: /BE\s*(?:\(Excesso de Base\))?\s*[:]*\s*(-?\s*\d+[.,]?\d*)/i,
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
    'CREATININA': /CREATININA\s*Resultado\s*[:]*\s*([0-9.,]+)/i,
    'FÓSFORO SÉRICO': /F[óo]sforo S[ée]rico\s*Valor de referência\s*Resultado\s*[:]*\s*([0-9.,]+)/i,
    'MAGNESIO': /MAGNESIO\s*Valor de referência\s*Resultado\s*[:]*\s*([0-9.,]+)/i,
    'POTASSIO SÉRICO': /POTASSIO S[ée]rico\s*Valor de referência\s*Resultado\s*[:]*\s*([0-9.,]+)/i,
    'PROTEINA C REATIVA': /PROTEINA C REATIVA\s*Valor de referência\s*Resultado\s*[:]*\s*([0-9.,]+)/i,
    'SÓDIO SÉRICO': /S[óo]dio S[ée]rico\s*Valor de referência\s*Resultado\s*[:]*\s*([0-9.,]+)/i,
    'UREIA': /UREIA\s*Valor de referência\s*Resultado\s*[:]*\s*([0-9.,]+)/i,
    'CÁLCIO IÔNICO': /C[áa]lcio I[oô]nico\s*[:]*\s*([0-9.,]+)/i,
    'TGP': /ALANINA AMINOTRANSFERASE.*?Resultado:\s*([0-9.,]+)/i,
    'TGO': /ASPARTATO AMINOTRANSFERASE.*?Resultado:\s*([0-9.,]+)/i,
    'ALBUMINA': /ALBUMINA\s*Valor de referência\s*Resultado:\s*([0-9.,]+)/i,
    'AMILASE': /AMILASE\s*Valor de referência\s*Resultado:\s*([0-9.,]+)/i,
    'GAMA GT': /GAMA-GLUTAMILTRANSFERASE.*?Resultado:\s*([0-9.,]+)/i,
    'FOSFATASE ALCALINA': /FOSFATASE ALCALINA\s*Valor de referência\s*Resultado:\s*([0-9.,]+)/i,
    'TP': /Tempo Paciente:\s*([0-9.,]+)/i,
    'INR': /INR:\s*([0-9.,]+)/i,
    'TTPA': /Rela[çc][ãa]o paciente\/normal:\s*([0-9.,]+)/i
  };

  for (const [key, regex] of Object.entries(regexOutros)) {
    const match = texto.match(regex);
    if (match) resultado.push(`${key}: ${match[1]}`);
  }

  return resultado.join(' // ');
}

function abreviarExames(texto){

const mapa = {

'HEMOGLOBINA':'Hb',
'LEUCÓCITOS':'Leuco',
'PLAQUETAS':'Plq',
'NEUTRÓFILOS':'Neutro',
'LINFÓCITOS':'Linfo',
'ALBUMINA':'ALB',
'CREATININA':'Cr',
'UREIA':'Ur',
'SÓDIO SÉRICO':'Na',
'POTASSIO SÉRICO':'K',
'PROTEINA C REATIVA':'PCR',
'CÁLCIO TOTAL':'Ca TOT',
'GAMA GT':'Gama-GT',
'FOSFATASE ALCALINA':'FA',
'BILIRRUBINA TOTAL':'BT',
'BILIRRUBINA DIRETA':'BD',
'BILIRRUBINA INDIRETA':'BI',
'FÓSFORO SÉRICO':'P',
'MAGNESIO: ':'Mg',
'CÁLCIO IÔNICO':'Ca ion',

};

for (const [original, curto] of Object.entries(mapa)) {
  const regex = new RegExp(original, 'g');
  texto = texto.replace(regex, curto);
}

return texto;

}

async function obterTextoPDF() {

  if (!window.PDFViewerApplication) {
    alert("PDFViewerApplication não encontrado.");
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
    alert(abreviarExames(resultado));
  } else {
    alert("Nenhum exame encontrado.");
  }
}

obterTextoPDF();

})();
