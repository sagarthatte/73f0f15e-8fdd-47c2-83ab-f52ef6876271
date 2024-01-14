import testStudent from './student.js';

let newStudent = new testStudent(
    {
        "id": "student16",
        "firstName": "Sagar",
        "lastName": "Thatte",
        "yearLevel": 12
    }
);


test('Check studentId', () => {
    expect(newStudent.getId()).toBe("student16");
});

test('Check Student full name', () => {
    expect(newStudent.getName()).toBe("Sagar Thatte");
});

test('Check student year level', () => {
    expect(newStudent.getYearLevel()).toBe(12);
});

