// src/index.js

const commander = require('commander');
const reportGenerator = require('./src/scripts/reportGenerator');

commander
    .arguments('<studentId>')
    .option('-r, --report <reportType>', 'Report Type (1: Diagnostic, 2: Progress, 3: Feedback)')
    .action((studentId, options) => {
        const reportType = options.report;
        // Call and generate the request report based on parameters
        reportGenerator.generateReport(studentId, reportType);
    })
    .parse(process.argv)
;