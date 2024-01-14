import moment from 'moment';

class ReportGenOutput {

	constructor() {
		// Not needed in this case, since very low amount of generic report data
	}

	generateDiagnosticReport (thisStudent, questions, studentResponses, assessments) {
		/* Requires following data
		* Most recent assessment
		* Total Questions, correct answers
		* Total Questions, correct answers by strand(s)   
		*/

		// Process (calculate)
		// https://www.w3schools.com/jsref/jsref_localecompare.asp
		// Get only assessment completions for this student
		// Find student responses sorted by recently completed
		let completedAssessments = [];

		studentResponses.forEach(response => {
			if (response.hasOwnProperty('completed') && response.student.id === thisStudent.id) {
				completedAssessments.push(response);
			}
		});
		// Sort completed assessments by most recent first
		const sortedAssessments = completedAssessments.sort( function(x, y) {
			return y.completed.localeCompare(x.completed);
		});

		// MRA => Most Recent Assessment Completed
		let thisStudentMRAC = sortedAssessments[0];
		// Get assessment name
		let thisAssessment = assessments.find(assessment => assessment.id === thisStudentMRAC.assessmentId);
		let assessmentName = thisAssessment.name;

		// Convert date time to correct format for display
		let assessmentCompletionDateTime = moment(thisStudentMRAC.completed, 'YYYY-MM-DD HH:mm:ss').format('Do MMMM YYYY, hh:mm A');

		let assessmentTotalQuestions = thisStudentMRAC.responses.length;

		let assessmentTotalScore = thisStudentMRAC.results.rawScore;

		// calculate strandwise score
		let assessmentStrands = [];
		thisStudentMRAC.responses.forEach(qResponse => {
			// For each response, find matching question by 'questionId' value
			let matchingQuestion = questions.find(question => question.id === qResponse.questionId);
			// Find question strand by index, and if new create new array member, else increment existing strand array member values.
			let strandIndex = assessmentStrands.findIndex(strand =>  strand.name === matchingQuestion.strand);
			if (strandIndex === -1) {
				assessmentStrands.push(
					{
						'name': matchingQuestion.strand, 
						'strandQuestions': 1, 
						'correctAnswers': qResponse.response === matchingQuestion.config.key ? 1 : 0
					}
				);
			} else {
				++assessmentStrands[strandIndex].strandQuestions;
				if (qResponse.response === matchingQuestion.config.key) {
					++assessmentStrands[strandIndex].correctAnswers;
				} 
			}
		});
		// Generate report text
		let reportText = '\n';
		reportText += thisStudent.firstName + ' ' + thisStudent.lastName 
			+ ' recently completed "' + assessmentName 
			+ '" on ' + assessmentCompletionDateTime + '\n'
		;

		reportText += 'He/She got ' + assessmentTotalScore + ' questions right out of ' + assessmentTotalQuestions
			+ '. Details by strand given below: \n \n'
		;

		assessmentStrands.forEach(strand => {
			reportText += strand.name + ': ' + strand.correctAnswers + ' out of ' + strand.strandQuestions + ' correct \n';
		});

		return reportText;

	}

	generateProgressReport () {
	}

	generateFeedbackReport () {
		console.log('test report 2');
	}
}

export default ReportGenOutput;