// Testing inquirer plugin

import reportGenCLI from 'inquirer';
import readLine from 'readline';

const readline = readLine.createInterface({
	input: process.stdin,
	output: process.stdout
  });

const questions = [
	{
		type: 'input',
		name: 'studentId',
		message: 'Enter Student ID: '
	},
	{
		type: 'list',
		name: 'reportType',
		choices: ['Diagnostic', 'Progress', 'Feedback'],
		default: 'Diagnostic',
		message: 'Report to generate: '
	}
];

console.log('Enter the following: \n');
readline.question('Who are you?', name => {
	console.log(`Hey there ${name}!`);
	readline.close();
  });
