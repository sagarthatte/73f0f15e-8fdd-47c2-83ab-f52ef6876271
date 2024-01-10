// Testing inquirer plugin

import reportGenCLI from 'inquirer';

const questions = [
	{
		type: 'input',
		name: 'studentId',
		message: 'Enter Student ID: '
	},
	{
		type: 'input',
		name: 'reportType',
		message: 'Choose Report Type [1 => Diagnostic, 2 => Feedback, 3 => Progress]: '
	}
];

reportGenCLI.prompt(questions).then(answers => {
	console.log('Hi, your responses are: ' + answers.studentId + ' ' + answers.reportType);
});