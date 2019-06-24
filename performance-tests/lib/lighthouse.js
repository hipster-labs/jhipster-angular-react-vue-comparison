const lighthouse = require('lighthouse');
const ReportGenerator = require('lighthouse/lighthouse-core/report/report-generator');
const lighthouseConfig = require('../lighthouse-config');
const fs = require('fs');

const generateLightHouseReport = async (url, opts, reportName, reportColor) => {
    const {lhr} = await lighthouse(url, opts);
    console.log(`Lighthouse scores: ${Object.values(lhr.categories).map(c => c.score).join(', ')}`);
    const htmlReport = ReportGenerator.generateReport(lhr, 'html');

    const coloredBackgroundReport = htmlReport.replace('<style>', `<style>.lh-container {background-color: ${reportColor}}`);
    fs.writeFileSync(`reports/${reportName}.html`, coloredBackgroundReport);
    return lhr;
};

module.exports = {
    generateLightHouseReport
};