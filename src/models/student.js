// src/models/student.js

class Student {
    constructor (data) {
        this.id = data.id;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.yearLevel = data.yearLevel;
        this.responses = null;
    }

    getId() {
        return this.id;
    }

    getName() {
        return this.firstName + ' ' + this.lastName;
    }

    getYearLevel() {
        return this.yearLevel;
    }

    setAssessmentResponses (responseSet) {
        this.responses = responseSet;
    }
}

export default Student;