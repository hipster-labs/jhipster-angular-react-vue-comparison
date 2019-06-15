const lighthouse = require('lighthouse');
const ReportGenerator = require('lighthouse/lighthouse-core/report/report-generator');
const lighthouseConfig = require('./lighthouse-config')
const chromeLauncher = require('chrome-launcher');
const puppeteer = require('puppeteer');
const {URL} = require('url');
const fs = require('fs');
const request = require('request');
const util = require('util');

const openHomePage = async (browser, url) => {
    const page = await browser.newPage();
    await page.goto(url);
    await page.screenshot({path: `reports/${reportName}-screenshot.png`});
}

const generateLightHouseReport = async (url, opts, reportName, reportColor) => {
    const {lhr} = await lighthouse(url, opts);
    console.log(`Lighthouse scores: ${Object.values(lhr.categories).map(c => c.score).join(', ')}`);
    const htmlReport = ReportGenerator.generateReport(lhr, 'html')

    const coloredBackgroundReport = htmlReport.replace('<style>', `<style>.lh-container {background-color: ${reportColor}}`);
    fs.writeFileSync(`reports/${reportName}.html`, coloredBackgroundReport);
    return lhr;
}

(async () => {
    const browser = await puppeteer.launch({headless: false, defaultViewport: null});
    const lighthouseOptions = { logLevel: 'info', output: 'json', port: new URL(browser.wsEndpoint()).port}

    url = 'http://localhost:8080';
    reportName = 'angular';
    reportColor = '#f9586a42';
    await openHomePage(browser, url);
    const angularReport = await generateLightHouseReport(url, lighthouseOptions, reportName, reportColor)

    url = 'http://localhost:8081';
    reportName = 'react';
    reportColor = '#60dbfb78';
    await openHomePage(browser, url);
    const reactReport = await generateLightHouseReport(url, lighthouseOptions, reportName, reportColor)
    
    url = 'http://localhost:8082';
    reportName = 'vuejs';
    reportColor = '#0cce6bab';
    await openHomePage(browser, url);
    const vuejsReport = await generateLightHouseReport(url, lighthouseOptions, reportName, reportColor)

    await browser.close();
})();
