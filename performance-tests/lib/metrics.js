const puppeteer = require('puppeteer');
const {URL} = require('url');
const fs = require('fs');

const request = require('request');
const util = require('util');

// https://stackoverflow.com/questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript
function formatBytes(a,b){if(0==a)return"0 Bytes";var c=1024,d=b||2,e=["Bytes","KB","MB","GB","TB","PB","EB","ZB","YB"],f=Math.floor(Math.log(a)/Math.log(c));return parseFloat((a/Math.pow(c,f)).toFixed(d))+" "+e[f]}

const generateMetricsReport = async (browser, url, reportName, reportColor) => {
    const page = await browser.newPage();
    await page.goto(url);
    await page.screenshot({path: `reports/${reportName}-screenshot.png`});

    const metrics = JSON.parse(await page.evaluate(() => JSON.stringify(window.performance)));
    const firstPaint = JSON.parse(await page.evaluate(() => JSON.stringify(window.performance.getEntriesByName('first-paint')[0].startTime)));
    const firstContentfulPaint = JSON.parse(await page.evaluate(() => JSON.stringify(window.performance.getEntriesByName('first-contentful-paint')[0].startTime)));

    const puppeteerMetrics = await page.metrics();

    const metricsReport = `<html>
    <style>body {background-color: ${reportColor}}</style>
    <body>
    <h1 style="text-transform: capitalize">${reportName} metrics report</h1>
    <h2>Performance Timings</h2>
    <table>
    <tbody>
        <tr>
            <td>DNS lookup</td>
            <td>${metrics.timing.domainLookupEnd - metrics.timing.domainLookupStart} ms</td>
        </tr>
        <tr>
            <td>TCP connection</td>
            <td>${metrics.timing.connectEnd - metrics.timing.connectStart} ms</td>
        </tr>
        <tr>
            <td>Request time</td>
            <td>${metrics.timing.responseStart - metrics.timing.requestStart} ms</td>
        </tr>
        <tr>
            <td>Response time </td>
            <td>${metrics.timing.responseEnd - metrics.timing.responseStart} ms</td>
        </tr>
        <tr>
            <td>First Paint</td>
            <td>${Math.round(firstPaint)} ms</td>
        </tr>
        <tr>
            <td>First Contentful Paint</td>
            <td>${Math.round(firstContentfulPaint)} ms</td>
        </tr>
        <tr>
            <td>DOM interactive</td>
            <td>${metrics.timing.domInteractive - metrics.timing.navigationStart} ms</td>
        </tr>
        <tr>
            <td>DOM load</td>
            <td>${metrics.timing.domComplete - metrics.timing.domLoading} ms</td>
        </tr>
        <tr>
            <td>Full load time</td>
            <td>${metrics.timing.loadEventEnd - metrics.timing.navigationStart} ms</td>
        </tr>
    </tbody>
    </table>
    <h2>Page metrics</h2>
    <table>
    <tbody>
        <tr>
            <td>Number of documents</td>
            <td>${puppeteerMetrics.Documents}</td>
        </tr>
        <tr>
            <td>DOM Nodes</td>
            <td>${puppeteerMetrics.Nodes}</td>
        </tr>
        <tr>
            <td>Number of event listeners</td>
            <td>${puppeteerMetrics.JSEventListeners}</td>
        </tr>
        <tr>
            <td>JavaScript execution duration</td>
            <td>${puppeteerMetrics.ScriptDuration}</td>
        </tr>
        <tr>
            <td>Browser Tasks duration</td>
            <td>${puppeteerMetrics.TaskDuration}</td>
        </tr>
        <tr>
            <td>Used JS Heap Size</td>
            <td>${formatBytes(puppeteerMetrics.JSHeapUsedSize)}</td>
        </tr>
        <tr>
            <td>Total JS Heap Size</td>
            <td>${formatBytes(puppeteerMetrics.JSHeapTotalSize)}</td>
        </tr>
    </table>
    </body>
    
    <h2>Screenshot</h2>
    <img src="${reportName}-screenshot.png" style="width:100%">
    
    </html>`;

    fs.writeFileSync(`reports/${reportName}-metrics-report.html`, metricsReport);
};

module.exports = {
    generateMetricsReport
};