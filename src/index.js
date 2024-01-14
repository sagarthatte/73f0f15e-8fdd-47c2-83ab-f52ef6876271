// src/index.js

/*
	ACER Coding Challenge Base File
	e report based on parameters:
	Input: studentId and reportType
	Output: Assessment report based on parameters
*/

// Imports
import fs from 'fs';
import Student from './models/student.js';
import reportGenOuput from './models/reportGenOutput.js';
import reportInput from './scripts/reportGenInput.js';


// Read json files, and json parse data
const students = JSON.parse(fs.readFileSync('./src/data/students.json'));
const questions = JSON.parse(fs.readFileSync('./src/data/questions.json'));
const studentReponses = JSON.parse(fs.readFileSync('./src/data/student-responses.json'));
const assessments = JSON.parse(fs.readFileSync('./src/data/assessments.json'));

// Start CLI sequence
console.log('Enter the following: \n');

// Declare defaults
let inputStudent = null;
let requestedReportType = null;
let selectedStudent = null;
// Main method to fetch input and generate output report
const index  = async() => {
	try {
		inputStudent = await reportInput.requestedStudentById(students);
		selectedStudent = new Student(inputStudent);
		try {
			requestedReportType = await reportInput.requestReportType();

			if (requestedReportType === 'Diagnostic') {
				reportGenOuput.generateDiagnosticReport();
			} else if (requestedReportType === 'Progress') {
				reportGenOutput.generateProgressReport();
			} else if (requestedReportType === 'Feedback') {
				reportGenOutput.generateFeedbackReport();
			}
		}
	}
}