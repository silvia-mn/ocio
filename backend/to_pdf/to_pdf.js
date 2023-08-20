import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';
import utils from 'util';
import puppeteer from 'puppeteer';
import hb from 'handlebars';

const readFile = utils.promisify(fs.readFile);

async function getTemplateHtml() {
    try {
        const invoicePath = path.resolve("to_pdf/template.html");
        const templateFile = await readFile(invoicePath, 'utf8');
        return templateFile;
    } catch (err) {
        console.log(err);
        return Promise.reject("Could not load html template");
    }
}

export async function generatePdf(payment_id,eventName,ticketType,totalAmount,numTics) {
    let data={logo_url:`data:image/png;base64,${fs.readFileSync('to_pdf/logo_negro.png').toString('base64')}`};
    data.eventName=eventName;
    data.ticketType=ticketType;
    data.totalAmount=totalAmount;
    data.numTics=numTics;

    const url = await QRCode.toDataURL(payment_id);
    console.log('QRCode generated');
    data.qr_url = url;
    const res = await getTemplateHtml();
    const template = hb.compile(res,{strict:true});
    // we have compile our code with handlebars
    const html = template(data);
    const browser = await puppeteer.launch();
    const page = await browser.newPage()
    // We set the page content as the generated html by handlebars
    await page.setContent(html,{ waitUntil: 'networkidle0' });
    // We use pdf function to generate the pdf in the same folder as this file.
    await page.pdf({ path: payment_id+'.pdf', format: 'A4' });
    await browser.close();
    console.log("PDF Generated")
    fs.unlink(payment_id+'.pdf',(err)=>{
        if(!!err)
            console.log(err);
    });
    const ret = `data:application/pdf;base64,${fs.readFileSync(payment_id+'.pdf').toString('base64')}`;
    return ret;
}