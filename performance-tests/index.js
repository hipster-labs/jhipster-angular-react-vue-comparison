const lighthouse = require('lighthouse');
const ReportGenerator = require('lighthouse/lighthouse-core/report/report-generator');
const lighthouseConfig = require('./lighthouse-config')
const chromeLauncher = require('chrome-launcher');
const puppeteer = require('puppeteer');
const {URL} = require('url');
const fs = require('fs');
const request = require('request');
const util = require('util');

const generateMetricsReport = async (browser, url, reportName, reportColor) => {
    const page = await browser.newPage();
    await page.goto(url);
    await page.screenshot({path: `reports/${reportName}-screenshot.png`});

    const rawMetrics = await page.evaluate(() => JSON.stringify(window.performance.timing));
    const metrics = JSON.parse(rawMetrics);

    const metricsReport = `<html>
    <style>body {background-color: ${reportColor}}</style>
    <body>
    <h1>${reportName} metrics report</h1>
    <table>
    <tbody>
        <tr>
            <td>DNS lookup</td>
            <td>${metrics.domainLookupEnd - metrics.domainLookupStart} ms</td>
        </tr>
        <tr>
            <td>TCP connection</td>
            <td>${metrics.connectEnd - metrics.connectStart} ms</td>
        </tr>
        <tr>
            <td>Request time</td>
            <td>${metrics.responseStart - metrics.requestStart} ms</td>
        </tr>
        <tr>
            <td>Response time </td>
            <td>${metrics.responseEnd - metrics.responseStart} ms</td>
        </tr>
        <tr>
            <td>DOM load</td>
            <td>${metrics.domComplete - metrics.domLoading} ms</td>
        </tr>
        <tr>
            <td>DOM interactive</td>
            <td>${metrics.domInteractive - metrics.navigationStart} ms</td>
        </tr>
        <tr>
            <td>Document load</td>
            <td>${metrics.loadEventEnd - metrics.loadEventStart} ms</td>
        </tr>
        <tr>
            <td>Full load time</td>
            <td>${metrics.loadEventEnd - metrics.navigationStart} ms</td>
        </tr>
    </tbody>
    </table>
    </body></html>`

    fs.writeFileSync(`reports/${reportName}-metrics-report.html`, metricsReport);
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
    const reports = [
        {
            url: 'http://localhost:8080',
            name: 'angular',
            backgroundColor: '#f9586a42',   
        },
        {
            url:  'http://localhost:8081',
            name:  'react',
            backgroundColor:  '#60dbfb78',
        },
        {
            url:  'http://localhost:8082',
            name:  'vuejs',
            backgroundColor:  '#0cce6bab',
        }
    ]

    const browser = await puppeteer.launch({headless: false, defaultViewport: null});
    const lighthouseOptions = { logLevel: 'info', output: 'json', port: new URL(browser.wsEndpoint()).port}

    for (report of reports) {
        await generateMetricsReport(browser, report.url, report.name, report.backgroundColor);
        await generateLightHouseReport(report.url, lighthouseOptions, report.name, report.backgroundColor)
    }

    await browser.close();
})();
