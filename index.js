const inquirer = require("inquirer");
const mysql = require("mysql2");
const consoleTable = require("console.table");
const cFonts = require("cfonts");

require("dotenv").config();

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

const employeeManager = cFonts.say('Employee|Manager', {
    font: 'block',
    align: 'left',
    colors: ['blueBright'],
    background: 'transparent',
    letterSpacing: 1,
    lineHeight: 1,
    gradient: false,
    env: 'node'
});

connection.connect((err) => {
    if (err) {
        console.log("Failed to load:", err)
    }else {
        employeeManager;
        questionPrompt();
    }

});

const questionPrompt = () => {
    inquirer
    .prompt({
        name: 'mainMenu',
        type: 'list',
        message: 'What would you like to do?',
        choices: [
            'View All Employees',
            'View All Employees by Department',
            'View All Employees by Manager',
            'Add Employee',
            'Add Department',
            'Add Roles',
            'Remove Employee',
            'Remove Department',
            'Remove Roles',
            'Update Employee Role',
            'Update Employee Manager',
            'View Total Utilized Budget by Department',
            'Exit Employee Manager'
        ]
    })
    .then((answer) => {
        switch (answer.mainMenu) {
            case 'View All Employees':
                viewEmps();
                break;
            
            case 'View All Employees by Department':
                viewEmpsDept();
                break;

            case 'View All Employees by Manager':
                viewEmpsMan();
                break;
            
            case 'Add Employee':
                addEmps();
                break;

            case 'Add Department':
                addDept();
                break;

            case 'Add Roles':
                addRole();
                break;

            case 'Remove Employee':
                rmvEmps();
                break;

            case 'Remove Department':
                rmvDept();
                break;

            case 'Remove Roles':
                rmvRoles();
                break;

            case 'Update Employee Role':
                updateEmpRole();
                break;

            case 'Update Employee Manager':
                updateEmpMan();
                break;

            case 'View Total Utilized Budget by Department':
                viewBudget();
                break;
            
            case 'Exit Employee Manager':
                connection.end();
                break;
        }
    });
};

const viewEmps = () => {
    let sqlQuery = "SELECT employee.id AS 'ID', employee.first_name AS 'First Name', employee.last_name AS 'Last Name', roles.title AS 'Title', department.dept_name AS 'Department', roles.salary AS 'Salary' FROM employee LEFT JOIN roles ON employee.role_id = roles.id LEFT JOIN department ON roles.department_id = department.id"

    connection.query(sqlQuery, (err, res) => {
        if (err) return err;
        // console.log(res.length);
        console.table(res);
        questionPrompt();
    });
};

const viewEmpsDept = () => {
    let deptQuery = "SELECT * FROM department";

    let sqlQuery = "SELECT employee.id AS 'ID', employee.first_name AS 'First Name', employee.last_name AS 'Last Name', roles.title AS 'Title', department.dept_name AS 'Department', roles.salary as 'Salary' FROM employee LEFT JOIN roles ON employee.role_id = roles.id LEFT JOIN department ON roles.department_id = department.id WHERE ?;";

    connection.query(deptQuery, (err, options) => {
        if (err) return console.log(err);
        inquirer.prompt([
            {
                name: 'allDepartments',
                type: 'list',
                messasge: 'Select from the following Departments:',
                choices: function () {
                    let departmentOptions = options.map(choice => choice.dept_name)
                    return departmentOptions;
                }
            }
        ]).then((answer) => {
            let deptChoice;
            for(let i = 0; i < options.length; i++) {
                if(options[i].dept_name === answer.allDepartments) {
                    deptChoice = options[i]
                }
            }
            connection.query(sqlQuery, { dept_name: deptChoice.dept_name }, (err,res) => {
                if (err) return err;
                // console.log(res.length);
                console.table(res);
                questionPrompt();
            })
        })
    });
};

const viewEmpsMan = () => {
    
};

const addEmps = () => {
    let fullName = 'SELECT * FROM roles; SELECT CONCAT (employee.first_name," ",employee.last_name) AS full_name FROM employee'
    connection.query(addEQuery, (err, options) => {
        if (err) return console.log(err);
        inquirer.prompt([
            {
                name: 'firstName',
                type: 'input',
                messasge: "Enter the employee's first name",
            },
            {
                name: 'lastName',
                type: 'input',
                messasge: "Enter the employee's last name",
            },
            {
                name: 'allRoles',
                type: 'list',
                messasge: 'Select from the following Roles:',
                choices: function () {
                    let roleOptions = options[0].map(choice => choice.title)
                    return roleOptions;
                }
            },
            {
                name: 'allManagers',
                type: 'list',
                messasge: 'If applicable, select from the following Mangers:',
                choices: [function () {
                    let managerOptions = options[1].map(choice => choice.full_name)
                    return managerOptions;
                }, null]
            }
        ]).then((answer) => {
            connection.query(
                `INSERT INTO employees(first_name, last_name, role_id, manager_id) VALUES(?, ?, 
                    (SELECT id FROM roles WHERE title = ? ), 
                    (SELECT id FROM (SELECT id FROM employees WHERE CONCAT(first_name," ",last_name) = ? ) AS tmptable))`, [answer.firstName, answer.lastName, answer.allRoles, answer.allManagers]
            )
        })
    });
};

const addDept = () => {

};

const addRole = () => {

};

const rmvEmps = () => {

};

const rmvDept = () => {

};

const rmvRoles = () => {

};

const updateEmpRole = () => {

};

const updateEmpMan = () => {

};

const viewBudget = () => {
    let sqlQuery = "SELECT employee.id, employee.first_name, employee.last_name, roles.title, department.dept_name AS department, roles.salary FROM employee LEFT JOIN roles ON employee.role_id = roles.id LEFT JOIN department on roles.department_id = department.id"

    connection.query(sqlQuery, (err, res) => {
        if (err) return err;
        // console.log(res.length);
        console.table(res);
        questionPrompt();
    });
};

