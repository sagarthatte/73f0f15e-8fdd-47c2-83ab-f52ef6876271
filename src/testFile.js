// Testing inquirer plugin

import reportGenCLI from 'inquirer';
import moment from 'moment';

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
		choices: ['Diagnostic', 'Progress', 'Feedback'],
		default: 'Diagnostic',
		message: 'Report to generate: '
	}
];

// console.log('test1');
// reportGenCLI.prompt(studentIdQuestion).then(answers => {
// 	console.log(answers.studentId);
// });

// console.log('test2')
// reportGenCLI.prompt(reportTypeQuestion).then(answers => {
// 	console.log(answers.reportType);
// });
// console.log('test3');

let sampleDate = "16/12/2019 10:46:00";
sampleDate = moment(sampleDate, 'YYYY-MM-DD HH:mm:ss');
console.log(sampleDate);

let formattedDate = moment(sampleDate).format('Do MMMM YYYY, hh:mm A');
console.log(formattedDate);