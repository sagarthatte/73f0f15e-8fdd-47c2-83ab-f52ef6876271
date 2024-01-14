// Testing inquirer plugin

import reportGenCLI from 'inquirer';


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

console.log('test1');
reportGenCLI.prompt(studentIdQuestion).then(answers => {
	console.log(answers.studentId);
});

console.log('test2')
reportGenCLI.prompt(reportTypeQuestion).then(answers => {
	console.log(answers.reportType);
});
console.log('test3');
