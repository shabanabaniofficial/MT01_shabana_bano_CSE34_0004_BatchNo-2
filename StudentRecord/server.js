const express = require("express");

const app = express();

app.use(express.json());

const PORT = 3000;

let students = [
  {
    id: 201,
    rollNumber: "CSE2401",
    name: "Aarav Sharma",
    branch: "CSE",
    semester: 3,
    email: "aarav@example.com",
  },
  {
    id: 202,
    rollNumber: "ECE2402",
    name: "Diya Verma",
    branch: "ECE",
    semester: 3,
    email: "diya@example.com",
  },
  {
    id: 203,
    rollNumber: "CSE2403",
    name: "Kabir Singh",
    branch: "CSE",
    semester: 3,
    email: "kabir@example.com",
  },
];

app.get("/api/students", (req, res) => {
  res.status(200).json(students);
});

app.post("/api/students", (req, res) => {
  const { rollNumber, name, branch, semester, email } = req.body;

  if (!rollNumber || !name || !branch || !semester || !email) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  const existingStudent = students.find(
    (student) => student.rollNumber === rollNumber,
  );

  if (existingStudent) {
    return res.status(400).json({
      message: "Roll number already exists",
    });
  }

  const newStudent = {
    id:
      students.length > 0
        ? Math.max(...students.map((student) => student.id)) + 1
        : 1,
    rollNumber,
    name,
    branch,
    semester,
    email,
  };

  students.push(newStudent);

  res.status(201).json(newStudent);
});

app.get("/api/students/filter", (req, res) => {
  const branch = req.query.branch;

  if (!branch) {
    return res.status(400).json({
      message: "Branch query parameter is required",
    });
  }

  const filteredStudents = students.filter(
    (student) => student.branch.toLowerCase() === branch.toLowerCase(),
  );

  res.status(200).json(filteredStudents);
});

app.get("/api/students/:id", (req, res) => {
  const id = Number(req.params.id);

  const student = students.find((student) => student.id === id);

  if (!student) {
    return res.status(404).json({
      message: "Student not found",
    });
  }

  res.status(200).json(student);
});

app.put("/api/students/:id", (req, res) => {
  const id = Number(req.params.id);

  const studentIndex = students.findIndex((student) => student.id === id);

  if (studentIndex === -1) {
    return res.status(404).json({
      message: "Student not found",
    });
  }

  const { rollNumber, name, branch, semester, email } = req.body;

  if (!rollNumber || !name || !branch || !semester || !email) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  const duplicateRollNumber = students.find(
    (student) => student.rollNumber === rollNumber && student.id !== id,
  );

  if (duplicateRollNumber) {
    return res.status(400).json({
      message: "Roll number already exists",
    });
  }

  students[studentIndex] = {
    id,
    rollNumber,
    name,
    branch,
    semester,
    email,
  };

  res.status(200).json(students[studentIndex]);
});

app.delete("/api/students/:id", (req, res) => {
  const id = Number(req.params.id);

  const studentIndex = students.findIndex((student) => student.id === id);

  if (studentIndex === -1) {
    return res.status(404).json({
      message: "Student not found",
    });
  }

  students.splice(studentIndex, 1);

  res.status(200).json({
    message: "Student deleted successfully",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
