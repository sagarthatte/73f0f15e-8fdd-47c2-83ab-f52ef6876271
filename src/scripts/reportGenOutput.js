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

	generateProgressReport (thisStudent, studentReponses, assessments) {
		/* Requires following data
		* Total completed attempts for assessment
		* Date of each completion, total questions, total score
		* difference of score between oldest and newest assessment attempt
		*/
		// Fetch all completed assessments for selected student
		let completedAssessments = studentReponses.filter(
			response => 
				response.student.id == thisStudent.id 
				&& typeof response.completed !== 'undefined'
		);

		// Fetch completion attempts for each assessment type (id)
		let completedAttempts = [];
		completedAssessments.forEach( (thisAssessment) => {
			let idx = completedAttempts.findIndex(type => type.assessmentId === thisAssessment.assessmentId);

			// If entry exists for assessment type, increment, else create new
			if (idx !== -1) {
				++completedAttempts[idx].totalAttempts;
			} else {
				completedAttempts.push({
					'assessmentId': thisAssessment.assessmentId,
					'assessmentName': assessments.find(assessment => assessment.id = thisAssessment.assessmentId).name,
					'totalAttempts': 1,
					'oldestTotal': null,
					'newestTotal': null,
					'totalQuestions': thisAssessment.responses.length,
					'attemptSpecificData': []
				});
				idx = completedAttempts.findIndex(type => type.assessmentId === thisAssessment.assessmentId);
			}
			// Need respective score and completion date for each attempt of each type.
			completedAttempts[idx].attemptSpecificData.push({
				'completionDate': moment(thisAssessment.completed, 'DD/MM/YYYY HH:mm:ss').format('Do MMMM YYYY, hh:mm A'),
				'totalScore': thisAssessment.results.rawScore
			});
		});

		// Logic to fetch oldest and newest score for each type of assessment
		completedAttempts.forEach( (attempt) => {
			// Get assessments by oldest first
			const thisAttemptSorted = attempt.attemptSpecificData.sort( function(x, y) {
				return x.completionDate.localeCompare(y.completionDate);
			});
			console.log(thisAttemptSorted[0].totalScore);
			console.log(thisAttemptSorted[thisAttemptSorted.length - 1].totalScore);
			attempt.oldestTotal = thisAttemptSorted[0].totalScore;
			attempt.newestTotal = thisAttemptSorted[thisAttemptSorted.length - 1].totalScore;
		})

		// Generate report data
		let reportText = '\n';

		completedAttempts.forEach((attempt) => {
			reportText += thisStudent.firstName + ' ' + thisStudent.lastName + ' has completed ' + attempt.assessmentName + ' assessment '
				+ attempt.totalAttempts + ' times in total. Dates and raw scores given below: \n'
			;
			
			attempt.attemptSpecificData.forEach( (thisAttempt) => {
				reportText += 'Date: ' + thisAttempt.completionDate + ', Raw Score: ' + thisAttempt.totalScore + ' out of ' + attempt.totalQuestions + '\n';
			});
			reportText += '\n';
			let scoreDifference = attempt.newestTotal - attempt.oldestTotal;
			reportText += thisStudent.firstName + ' ' + thisStudent.lastName + ' got ' + scoreDifference;
			if (scoreDifference > 0) {
				reportText += ' more';
			} else {
				reportText += ' less';
			}
			reportText += ' correct in recent completed assessment than the oldest.';
		});
		
		return reportText;

	}

	generateFeedbackReport (thisStudent, questions, studentResponses, assessments) {
		/* Requires following data
		* Most recent assessment
		* count of total questions, correct answers
		* details for wrong answers: answer chosen, right answer, hint
		*/

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

		let assessmentCompletionDateTime = moment(thisStudentMRAC.completed, 'YYYY-MM-DD HH:mm:ss').format('Do MMMM YYYY, hh:mm A');

		let assessmentTotalQuestions = thisStudentMRAC.responses.length;

		let assessmentTotalScore = thisStudentMRAC.results.rawScore;

		// Gather details for questions with incorrect answers
		let questionsWithIncorrectResponse = [];
		thisStudentMRAC.responses.forEach( (qResponse) => {
			// Add incorrect response to array
			let matchingQuestion = questions.find(question => question.id === qResponse.questionId);
			if (qResponse.response !== matchingQuestion.config.key) {
				questionsWithIncorrectResponse.push({
					'question': matchingQuestion.stem,
					'type': matchingQuestion.type,
					'studentResponse': matchingQuestion.config.options.find(option => option.id === qResponse.response),
					'correctAnswer': matchingQuestion.config.options.find(option => option.id === matchingQuestion.config.key),
					'hint': matchingQuestion.config.hint
				});
			}
		});

		// Create report text
		let reportText = '\n';
		reportText += thisStudent.firstName + ' ' + thisStudent.lastName 
			+ ' recently completed "' + assessmentName + '" assessment on ' + assessmentCompletionDateTime + '\n'
		;
		
		reportText += 'He/She got ' + assessmentTotalScore+ ' questions right out of ' + assessmentTotalQuestions;

		if (questionsWithIncorrectResponse.length > 0) {
			reportText += 'Feedback for wrong answers given below: \n\n';
			questionsWithIncorrectResponse.forEach((thisQuestion) => {
				reportText += 'Question: ' + thisQuestion.question + '\n';
				reportText += 'Question Type: ' + thisQuestion.type + '\n';
				reportText += 'Your answer: ' + thisQuestion.studentResponse.label + ' with value ' + thisQuestion.studentResponse.value + '\n';
				reportText += 'Correct Answer: ' + thisQuestion.correctAnswer.label + ' with value ' + thisQuestion.correctAnswer.value + '\n';
				reportText += 'Hint: ' + thisQuestion.hint + '\n';
			})

		} else {
			reportText += 'No wrong answers found \n';
		}

		return reportText;
	}
}

export default ReportGenOutput;