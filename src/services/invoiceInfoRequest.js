const puppeteer = require('puppeteer');
const cherrio = require('cheerio');
const moment = require('moment');

const Invoice = require('../models/Invoice');
const Product = require('../models/Product');
const Market = require('../models/Market');

const NUMBER_PATTERN = /(\d)+(\,)*(\d)*/;
const DATE_FORMAT = 'DD/MM/YYYY HH:mm:ss';

const getRequestPage = async (accessCode, page) => {    
    const url = 'http://nfce.fazenda.rj.gov.br/consulta';

    const [response] = await Promise.all([
        page.waitForResponse(response => response.url().includes('CarregaImagem')),
        page.goto(url)
    ]);
    
    const buffer = await response.buffer();
    const captchaImage = 'data:image/png;base64,' + buffer.toString('base64');

    const reponseObject = {
        accessCode: accessCode,
        captchaImage: captchaImage,
    }

    return reponseObject;
}

const goToResult = async (accessCode, captchaCode, page) => {

    try {
        await page.type('#chaveAcesso', accessCode);
        await page.type('#captcha', captchaCode);

        await page.click('#consultar');

        await page.waitForNavigation();
        
        const content = await page.content();

        return parserResultPage(content);
        
    } catch (ex) {
        throw ex;
    }
}

const requestAccess = (accessCode, page) => {
    return new Promise( (resolve, reject) => {

        getRequestPage(accessCode, page)
            .then((reponseObject) => { resolve(reponseObject); })
            .catch((err) => { reject(err); });
    });
}

const getResultPage = (accessCode, captchaCode, page) => {
    return new Promise( (resolve, reject) => {

        goToResult(accessCode, captchaCode, page).then((response) => {
            resolve(response);
        })
        .catch((err) => {
            reject(err);
        });
    });
}

const teste = (page) => {
    return new Promise( (resolve, reject) => {

        const teste2 = async () => {
            // var url = 'http://www4.fazenda.rj.gov.br/consultaNFCe/QRCode?p=33191007473160000105650170002990359005980709|2|1|14|35.57|72694A614867486C6F736971763941363959714F446957305735673D|1|5399D1C5FA9D065F2DF5D46C84E761C2F2E88C48'
            /*var url = 'http://www4.fazenda.rj.gov.br/consultaNFCe/QRCode?p=33190907473160000105650060002395699004791386|2|1|17|47.00|664B5631394868534E786250516643574C4B75315A3971634346453D|1|4B22BB6481D4F0A6C682923421EF7C84B8199561';

            page.setDefaultTimeout(100000);

            const accessCode = '3319 0907 4731 6000 0105 6500 6000 2395 6990 0479 1386';

            const [response] = await Promise.all([
                page.waitForResponse(response => response.url().includes('consultaQRCode.faces')),
                page.goto(url)
            ]);

            // await page.waitFor('');
            
            // const content = await page.content();
            const content = await response.buffer();
            const res = parserResultPage(content);*/
            
            const contentMock = `<!doctype html><html lang=pt-br xml:lang=pt-br xmlns=http://www.w3.org/1999/xhtml><meta content="IE=9, IE=edge"http-equiv=X-UA-Compatible><meta charset=utf-8><meta content="width=device-width,initial-scale=1"name=viewport><meta content="telephone=no"name=format-detection><title>Consulta NFC-e</title><script src="/consultaNFCe/javax.faces.resource/jquery.js.faces?ln=js"></script><script src="/consultaNFCe/javax.faces.resource/index.js.faces?ln=js"></script><script src="/consultaNFCe/javax.faces.resource/jquery.mobile-1.4.5.min.js.faces?ln=js"></script><link href="/consultaNFCe/javax.faces.resource/jquery.mobile-1.4.5.min.css.faces?ln=css"rel=stylesheet><link href="/consultaNFCe/javax.faces.resource/nfceMob.css.faces?ln=css"rel=stylesheet><link href="/consultaNFCe/javax.faces.resource/nfceMob_ie.css.faces?ln=css"rel=stylesheet><div data-role=header xmlns:chave=http://exslt.org/chaveacesso xmlns:n=http://www.portalfiscal.inf.br/nfe xmlns:r=http://www.serpro.gov.br/nfe/remessanfe.xsd><h1 class=tit><img alt=NFC-e height=64 src=../resources/images/logoNFCe.png width=112><p>DOCUMENTO AUXILIAR DA NOTA FISCAL DE CONSUMIDOR ELETRÔNICA<p></h1></div><div data-role=content><div id=conteudo><div id=avisos></div><div class=txtCenter><div id=u20 class=txtTopo>SUPERMERCADO ULTRA SUL LTDA</div><div class=text>CNPJ: 07.473.160/0001-05</div><div class=text>RUA DO CATETE , 00154 , , CATETE , RIO DE JANEIRO , RJ</div></div><table align=center border=0 cellpadding=0 cellspacing=0 data-filter=true id=tabResult><tr id="Item + 1"><td valign=top><span class=txtTit>TODDY QUAKER FR 400G</span><span class=RCod> (Código: 07894321711263 )</span><br><span class=Rqtd><strong>Qtde.:</strong>1</span><span class=RUN><strong>UN: </strong>UN</span><span class=RvlUnit><strong>Vl. Unit.:</strong>   5,87</span><td valign=top align=right class="txtTit noWrap">Vl. Total<br><span class=valor>5,87</span><tr id="Item + 2"><td valign=top><span class=txtTit>TODDY QUAKER FR 400G</span><span class=RCod> (Código: 07894321711263 )</span><br><span class=Rqtd><strong>Qtde.:</strong>1</span><span class=RUN><strong>UN: </strong>UN</span><span class=RvlUnit><strong>Vl. Unit.:</strong>   5,87</span><td valign=top align=right class="txtTit noWrap">Vl. Total<br><span class=valor>5,87</span><tr id="Item + 3"><td valign=top><span class=txtTit>GUARAVITA CP 290ML</span><span class=RCod> (Código: 07898923217031 )</span><br><span class=Rqtd><strong>Qtde.:</strong>3</span><span class=RUN><strong>UN: </strong>UN</span><span class=RvlUnit><strong>Vl. Unit.:</strong>   0,99</span><td valign=top align=right class="txtTit noWrap">Vl. Total<br><span class=valor>2,97</span><tr id="Item + 4"><td valign=top><span class=txtTit>LARANJADA CRAC CP 290ML</span><span class=RCod> (Código: 07897559900430 )</span><br><span class=Rqtd><strong>Qtde.:</strong>1</span><span class=RUN><strong>UN: </strong>UN</span><span class=RvlUnit><strong>Vl. Unit.:</strong>   0,89</span><td valign=top align=right class="txtTit noWrap">Vl. Total<br><span class=valor>0,89</span><tr id="Item + 5"><td valign=top><span class=txtTit>BEBIDA CRAC UVA CP 290ML</span><span class=RCod> (Código: 07897559900577 )</span><br><span class=Rqtd><strong>Qtde.:</strong>2</span><span class=RUN><strong>UN: </strong>UN</span><span class=RvlUnit><strong>Vl. Unit.:</strong>   0,89</span><td valign=top align=right class="txtTit noWrap">Vl. Total<br><span class=valor>1,78</span><tr id="Item + 6"><td valign=top><span class=txtTit>PAO NUTRELLA SUPREME FRUTAS PC 600G</span><span class=RCod> (Código: 07896002300377 )</span><br><span class=Rqtd><strong>Qtde.:</strong>1</span><span class=RUN><strong>UN: </strong>UN</span><span class=RvlUnit><strong>Vl. Unit.:</strong>   9,9</span><td valign=top align=right class="txtTit noWrap">Vl. Total<br><span class=valor>9,90</span><tr id="Item + 7"><td valign=top><span class=txtTit>MACA GALA KG</span><span class=RCod> (Código: 00000000001632 )</span><br><span class=Rqtd><strong>Qtde.:</strong>0,71</span><span class=RUN><strong>UN: </strong>KG</span><span class=RvlUnit><strong>Vl. Unit.:</strong>   6,99</span><td valign=top align=right class="txtTit noWrap">Vl. Total<br><span class=valor>4,96</span><tr id="Item + 8"><td valign=top><span class=txtTit>LEITE ELEGE INTEGRAL TP 1L</span><span class=RCod> (Código: 07896079500151 )</span><br><span class=Rqtd><strong>Qtde.:</strong>4</span><span class=RUN><strong>UN: </strong>UN</span><span class=RvlUnit><strong>Vl. Unit.:</strong>   3,69</span><td valign=top align=right class="txtTit noWrap">Vl. Total<br><span class=valor>14,76</span></table><div id=totalNota class=txtRight><div id=linhaTotal><label>Qtd. total de itens:</label><span class=totalNumb>8</span></div><div id=linhaTotal class=linhaShade><label>Valor a pagar R$:</label><span class="totalNumb txtMax">47,00</span></div><div id=linhaForma><label>Forma de pagamento:</label><span class="totalNumb txtTitR">Valor pago R$:</span></div><div id=linhaTotal><label class=tx>Cartão de Crédito</label><span class=totalNumb>47,00</span></div><div id=linhaTotal><label class=tx>Troco</label><span class=totalNumb>NaN</span></div></div></div><div id=infos class=txtCenter><div data-role=collapsible data-collapsed=false data-collapsed-icon=carat-d data-expanded-icon=carat-u><h4>Informações gerais da Nota</h4><ul data-inset=false data-role=listview><li><strong>EMITIDA EM CONTINGÊNCIA</strong><br><br><strong>Número: </strong>239569<strong> Série: </strong>6<strong> Emissão: </strong>17/09/2019 19:02:02 - Via Consumidor<br><br><strong>Protocolo de Autorização: </strong>333191944480232 18/09/2019 07:44:38<br><br><strong>Ambiente de Produção - Versão XML: 4.00 - Versão XSLT: 2.05</strong></ul></div><div data-role=collapsible data-collapsed=false data-collapsed-icon=carat-d data-expanded-icon=carat-u><h4>Chave de acesso</h4><ul data-inset=false data-role=listview><li>Consulte pela Chave de Acesso em http://www.fazenda.rj.gov.br/nfce/consulta<br><br><strong>Chave de acesso:</strong><br><span class=chave>3319 0907 4731 6000 0105 6500 6000 2395 6990 0479 1386</span></ul></div><div data-role=collapsible data-collapsed=false data-collapsed-icon=carat-d data-expanded-icon=carat-u><h4>Consumidor</h4><ul data-inset=false data-role=listview><li><strong>Consumidor não identificado</strong></ul></div><div data-role=collapsible data-collapsed=false data-collapsed-icon=carat-d data-expanded-icon=carat-u><h4>Informações de interesse do contribuinte</h4><ul data-inset=false data-role=listview><li>Valor Recebido Do Cliente = 47,00;Troco = 0,00;Qt Itens Vendidos : 14 ;Operador(a) : ALINE ;Val Aproximado Tributos 14,73 (31,34%) Fonte: IBPT;</ul></div></div></div><script>$(function(){$("#linkMsg").click(function(n){$("#mensagem").toggle()})})</script><script id=f5_cspm>!function(){var r={f5_p:"NEKIIGBAPKABONMDGKAIGEINFEJLGIDEMHNPJGHBOBOBCOCOILEMIOEAJNGJAOJLGMABCCLJAAHOMDCDJJOAONNIAADNNECGMKPJCBCELLINKKGFEJEGDDLDEJMEIFHG",setCharAt:function(t,e,a){return e>t.length-1?t:t.substr(0,e)+a+t.substr(e+1)},get_byte:function(t,e){var a=e/16|0;return e&=15,a*=32,t.charCodeAt(e+16+a)-65<<4|t.charCodeAt(e+a)-65},set_byte:function(t,e,a){var n=e/16|0;return e&=15,n*=32,t=r.setCharAt(t,e+16+n,String.fromCharCode(65+(a>>4))),t=r.setCharAt(t,e+n,String.fromCharCode(65+(15&a)))},set_latency:function(t,e){return e&=65535,t=r.set_byte(t,40,e>>8),t=r.set_byte(t,41,255&e),t=r.set_byte(t,35,2)},wait_perf_data:function(){try{var t=window.performance.timing;if(0<t.loadEventEnd){var e=t.loadEventEnd-t.navigationStart;if(e<60001){var a=r.set_latency(r.f5_p,e);window.document.cookie="f5avr1415484755aaaaaaaaaaaaaaaa="+encodeURIComponent(a)+";path=/"}return}}catch(t){return}setTimeout(r.wait_perf_data,100)},go:function(){for(var t=window.document.cookie.split(/\s*;\s*/),e=0;e<t.length;++e){var a=t[e].split(/\s*=\s*/);if("f5_cspm"==a[0]&&"1234"==a[1]){var n=new Date;n.setTime(n.getTime()-1e3),window.document.cookie="f5_cspm=;expires="+n.toUTCString()+";path=/;",setTimeout(r.wait_perf_data,100)}}}};r.go()}()</script>`;
            const res = parserResultPage(contentMock);
            

            return res;
        }

        teste2().then((res) => {
            resolve(res);
        })
        .catch((err) => {
            reject(err);
        });
    });
}

const getResultPageWithQRCode = (url, page) => {
    return new Promise( (resolve, reject) => {
        const getResult = async () => {
            try {
                page.setDefaultTimeout(100000);

                const [response] = await Promise.all([
                    page.waitForResponse(response => response.url().includes('consultaQRCode.faces')),
                    page.goto(url)
                ]);

                const content = await response.buffer();
                const res = parserResultPage(content);
                return res;

            } catch (ex) {
                throw ex;
            }
        }

        getResult().then((res) => {
            resolve(res);
        })
        .catch((err) => {
            reject(err);
        });
    });
}

const parserResultPage = async (content) => {
    const $ = cherrio.load(content);

    const accessCode = $('span.chave').text().trim().split(' ').join('');

    // TODO: Melhorar verificação de nota não disponível
    // TODO: Tratar caso em que o site da Fazenda não está disponível
    if (!accessCode) {
        console.log(accessCode);
        return {
            "error" : "Invoice not found.",
            "statusCode" : 404
        }
    }

    const invoiceDatabase = await Invoice.findOne({ "accessCode" : accessCode});

    if (invoiceDatabase) {
        return {
            "error" : "Invoice already registered.",
            "statusCode" : 409
        }
    }

    const productsTable = $('table#tabResult');
    const productsWrapper = productsTable.find('tr');
    
    const productsArr = [];

    productsWrapper.map((i, prod) => {
        let $prod = $(prod);
        
        let name = $prod.find('span.txtTit').text().trim();

        let codeOriginal = $prod.find('span.RCod').text().trim();
        let amountOriginal = $prod.find('span.Rqtd').text().trim();
        let priceOriginal = $prod.find('span.RvlUnit').text().trim();

        let code = codeOriginal != null ? NUMBER_PATTERN.exec(codeOriginal)[0] : '';
        let amount = amountOriginal != null ? NUMBER_PATTERN.exec(amountOriginal)[0].replace(',', '.') : '';
        let price = priceOriginal != null ? NUMBER_PATTERN.exec(priceOriginal)[0].replace(',', '.') : '';

        product = {
            name,
            code,
            amount,
            price,
        };

        productsArr.push(product);
    });

    let purchaseDate = new Date();

    const infoDiv = $('#infos');

    if (infoDiv) {
        const infoWrapper = infoDiv.find('div');

        if (infoWrapper) {
            const infoInvoiceWrapper = $(infoWrapper[0]).find('li');

            if (infoInvoiceWrapper) {
                const purchaseDateWrapper = $(infoInvoiceWrapper[0])

                if (purchaseDateWrapper) {
                    const purchaseDateTextWrapper = purchaseDateWrapper.text();

                    const INITIAL_TEXT = 'Emissão: ';
                    const FINAL_TEXT = ' - Via Consumidor';

                    const INITIAL_INDEX = purchaseDateTextWrapper.indexOf(INITIAL_TEXT) + INITIAL_TEXT.length;
                    const FINAL_INDEX = purchaseDateTextWrapper.indexOf(FINAL_TEXT);

                    const purchaseDateText = purchaseDateTextWrapper.substring(INITIAL_INDEX, FINAL_INDEX);

                    if (purchaseDateText.length > 0) {
                        const purchaseDateUnformatted = purchaseDateText.trim();
                        purchaseDate = moment(purchaseDateUnformatted, DATE_FORMAT).format();
                    }
                }
            }
        }
    }

    const marketInfo = $('div#conteudo > div.txtCenter');
    const marketName = marketInfo.find('div#u20').text();
    const marketTextWrapper = marketInfo.find('div.text');

    let marketCNPJ = '';

    let marketAddressStreet = '';
    let marketAddressNumber = '';
    let marketAddressLine2 = '';
    let marketAddressNeighbourhood = '';
    let marketAddressMunicipality = '';
    let marketAddressState = '';

    if (marketTextWrapper.length > 0) {
        const marketCnpjWrapper = $(marketTextWrapper[0]).text().trim().split('\n').join('').split('\t').join('');


        if (marketCnpjWrapper.includes("CNPJ")) {
            marketCNPJ = marketCnpjWrapper.substring(5).trim();
        }

        const marketAddressWrapper = $(marketTextWrapper[1]).text().trim().split('\n').join('').split('\t').join('');

        if (marketAddressWrapper.length > 0) {

            const marketAddressList = marketAddressWrapper.split(',');
            marketAddressStreet = marketAddressList[0].trim();
            marketAddressNumber = marketAddressList[1].trim();
            marketAddressLine2 = marketAddressList[2].trim();
            marketAddressNeighbourhood = marketAddressList[3].trim();
            marketAddressMunicipality = marketAddressList[4].trim();
            marketAddressState = marketAddressList[5].trim();
        }
    }

    const market = {
        name: marketName,
        cnpj: marketCNPJ,
        address: {
            street: marketAddressStreet,
            number: marketAddressNumber,
            addressLine2: marketAddressLine2,
            neighbourhood: marketAddressNeighbourhood,
            municipality: marketAddressMunicipality,
            state: marketAddressState,
        },
    };

    const invoice = await Invoice.create({
        accessCode,
        products: productsArr,
        market: market,
        purchaseDate,
    });

    const invoiceId = invoice._id;


    productsArr.map( async (prod) => {
        await Product.create({
            invoiceId,
            name: prod.name,
            code: prod.code,
            price: prod.price,
            amount: prod.amount,
            marketName: marketName,
            purchaseDate,
        });
    });

    return invoice;
}

module.exports = {
    requestAccess: (accessCode, page) => requestAccess(accessCode, page),
    getResultPage: (accessCode, captchaCode, page) => getResultPage(accessCode, captchaCode, page),
    getResultPageWithQRCode: (url, page) => getResultPageWithQRCode(url, page),
    teste: (page) => teste(page)
}