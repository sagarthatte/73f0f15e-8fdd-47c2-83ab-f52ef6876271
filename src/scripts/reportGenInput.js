// /src/scripts/reportInput.js

import reportQuestions from 'inquirer';

const studentIdQuestion = [
    {
        type: 'input',
        name: 'studentId',
        message: 'Enter Student ID: '
    }
];

const reportTypeQuestion = [
    {
        type: 'list',
        name: 'reportType',
        message: 'Select Report Type: ',
        choices: [
            'Diagnostic',
            'Progress',
            'Feedback'
        ],
        'default': 'Diagnostic'
    }
];
class ReportGenInput {
    constructor() {
        // Not needed at this stage, may need to expand at some point in future
    }   
    
    requestStudentById (students) {
        return new Promise((resolve, reject) => {
            reportQuestions.prompt(studentIdQuestion).then(response => {
                let selectedStudent = students.find(student => student.id === response.studentId);
                if (selectedStudent === 'undefined') {
                    reject('Student ID "' + response.studentId + '" does not exist');
                } else {
                    resolve(selectedStudent);
                }
            });
        });
    }
    
    requestReportType () {
        return new Promise((resolve,reject) => {
            reportQuestions.prompt(reportTypeQuestion).then(response => {
                let selectedReportType = response.reportType;
    
                if (!['Diagnostic', 'Feedback', 'Progress'].includes(selectedReportType)) {
                    reject('Report Type not found. Please contact developer');
                } else {
                    resolve(selectedReportType);
                }
            });
        });
    }
}

export default ReportGenInput;