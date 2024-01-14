// /src/scripts/reportInput.js

import reportQuestions from 'inquirer';
import { error } from 'shelljs';

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

requestStudentById = (students) => {
    return new Promise((resolve, reject) => {
        reportQuestions.prompt(studentIdQuestion).then(response => {
            selectedStudent = students.find(student => student.id === response.studentId);
            if (selectedStudent === 'undefined') {
                reject('Student ID "' + response.studentId + '" does not exist');
            } else {
                resolve(selectedStudent);
            }
        });
    });
}

requestReportType = () => {
    return new Promise((resolve,reject) => {
        reportQuestions.prompt(reportTypeQuestion).then(response => {
            selectedReportType = response.reportType;

            if (!['Diagnostic', 'Feedback', 'Progress'].includes(selectedReportType)) {
                reject('Report Type not found. Please contact developer');
            } else {
                resolve(selectedReportType);
            }
        });
    });
}