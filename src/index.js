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
import reportGenOutput from './scripts/reportGenOutput.js';
import reportGenInput from './scripts/reportGenInput.js';


// Read json files, and json parse data
const students = JSON.parse(fs.readFileSync('./src/data/students.json'));
const questions = JSON.parse(fs.readFileSync('./src/data/questions.json'));
const studentResponses = JSON.parse(fs.readFileSync('./src/data/student-responses.json'));
const assessments = JSON.parse(fs.readFileSync('./src/data/assessments.json'));

// Start CLI sequence
console.log('Enter the following: \n');

// Declare defaults
let inputStudent = null;
let requestedReportType = null;
let selectedStudent = null;
let reportOutput = '';
let fetchInput = new reportGenInput();
let fetchReportOutput = new reportGenOutput();
// Main method to fetch input and generate output report
const generator  = async() => {
	try {
		inputStudent = await fetchInput.requestStudentById(students);
		selectedStudent = new Student(inputStudent);
	
		try {
			requestedReportType = await fetchInput.requestReportType();
			if (requestedReportType === 'Diagnostic') {
				reportOutput = fetchReportOutput.generateDiagnosticReport(selectedStudent, questions, studentResponses, assessments);
			} else if (requestedReportType === 'Progress') {
				reportOutput = fetchReportOutput.generateProgressReport(selectedStudent, questions, studentResponses, assessments);
			} else if (requestedReportType === 'Feedback') {
				reportOutput = fetchReportOutput.generateFeedbackReport(selectedStudent, questions, studentResponses, assessments);
			}

			console.log(reportOutput);
		} catch (err) {
			console.error(err);
		}
	} catch (err) {
		console.error(err);
	}
}

generator();