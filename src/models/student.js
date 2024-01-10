// src/models/student.js

class Student {
    constructor (data) {
        this.id = data.id;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.yearLevel = data.yearLevel;
    }
}