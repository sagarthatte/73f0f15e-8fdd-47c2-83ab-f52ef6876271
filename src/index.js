// src/index.js

/*
	ACER Coding Challenge Base File
	e report based on parameters:
	Input: studentId and reportType
	Output: Assessment report based on parameters
*/

// Imports
import cliQuestions from 'inquirer';
import fs from 'fs';
import Student from './models/student.js';
import ReportGenerator from './models/reportGenerator.js';

// Questions for CLI prompt
const reportGenQuestions = [
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

// Read json files, and json parse data
const students = JSON.parse(fs.readFileSync('./src/data/students.json'));

const questions = JSON.parse(fs.readFileSync('./src/data/questions.json'));

const studentReponses = JSON.parse(fs.readFileSync('./src/data/student-responses.json'));

const assessments = JSON.parse(fs.readFileSync('./src/data/assessments.json'));

// Start CLI sequence
console.log('Enter the following: \n');
let selectedStudent = null;
cliQuestions.prompt(reportGenQuestions).then(answers => {

	selectedStudent = students.find(student => student.id === answers.studentId);
	if (selectedStudent === null || selectedStudent === undefined) {
		console.log('Student with ID "' + answers.studentId + '" does not exist. Try again \n');
		// TODO: Find a way to seamlessly re-run npm script
    } else {
        let requestedStudent = new Student(selectedStudent);

		// Read student responses file and add all responses for the selected student to an array
		let selectedResponses = [];
		let responses = JSON.parse(fs.readFileSync('./src/data/student-responses.json'));
		responses.forEach(response => {
			if (response.student.id === answers.studentId) {
				selectedResponses.push(response);
			}
		});
		requestedStudent.setAssessmentResponses(responses);
		if (selectedResponses.length === 0) {
			console.log('No assessment records found for ' + requestedStudent.getName() + '\n' + 'No report can be generated');
		} else {
			requestedStudent.setAssessmentResponses(selectedResponses);
			let reportGen = new ReportGenerator();

			switch (answers.reportType) {
				case 'Diagnostic':
				default:
					reportGen.generateDiagnosticReport();
					break;
				 case 'Progress':
					reportGen.generateProgressReport();
					break;
				case 'Feedback':
					reportGen.generateFeedbackReport();
					break;
			}
		}
    }

});
