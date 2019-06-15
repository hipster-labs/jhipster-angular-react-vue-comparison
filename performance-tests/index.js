const lighthouse = require('lighthouse');
const ReportGenerator = require('lighthouse/lighthouse-core/report/report-generator');
const lighthouseConfig = require('./lighthouse-config')
const chromeLauncher = require('chrome-launcher');
const puppeteer = require('puppeteer');
const {URL} = require('url');
const fs = require('fs');



(async () => {
    const generateLightHouseReport = async (url, reportName, reportColor) => {
        const browser = await puppeteer.launch({headless: false, defaultViewport: null});
        const page = await browser.newPage();
        await page.goto(url);
        await page.screenshot({path: `reports/${reportName}-screenshot.png`});
      
        const port = new URL(browser.wsEndpoint()).port;
        const lightHouseOpts = { port: port, output: 'json', logLevel: 'info' };
        const {lhr} = await lighthouse(url, lightHouseOpts);
        console.log(`Lighthouse scores: ${Object.values(lhr.categories).map(c => c.score).join(', ')}`);
        const htmlReport = ReportGenerator.generateReport(lhr, 'html')

        const coloredBackgroundReport = htmlReport.replace('<style>', `<style>.lh-container {background-color: ${reportColor}}`);
        fs.writeFileSync(`reports/${reportName}.html`, coloredBackgroundReport);
        await browser.close();
        return lhr;
    }

    const angularReport = generateLightHouseReport('http://localhost:8080', 'angular', '#f9596a')
    const reactReport = generateLightHouseReport('http://localhost:8081', 'react', '#61dbfb')
    const vuejsReport = generateLightHouseReport('http://localhost:8082', 'vuejs', '#40b984')

})();
