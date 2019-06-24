const {generateMetricsReport}  = require('./lib/metrics');
const {generateLightHouseReport} = require('./lib/lighthouse');

const puppeteer = require('puppeteer');
const {URL} = require('url');

(async () => {
    const reports = [
        {
            url: 'http://localhost:8080/customer',
            name: 'angular',
            backgroundColor: '#f9586a42',   
        },
        {
            url:  'http://localhost:8081/customer',
            name:  'react',
            backgroundColor:  '#60dbfb78',
        },
        {
            url:  'http://localhost:8082/customer',
            name:  'vuejs',
            backgroundColor:  '#0cce6bab',
        },
    ];

    const browser = await puppeteer.launch({headless: false, defaultViewport: null});

    const lighthouseOptions = { logLevel: 'info', output: 'json', port: new URL(browser.wsEndpoint()).port}

    for (report of reports) {
        await generateMetricsReport(browser, report.url, report.name, report.backgroundColor);
        await generateLightHouseReport(report.url, lighthouseOptions, report.name, report.backgroundColor)
    }

   await browser.close();
})();
