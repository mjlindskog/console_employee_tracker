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
    inquirer.prompt([
        {
            name: 'firstName',
            type: 'input',
            message: "What is their first name?",
        },
        {
            name: 'lastName',
            type: 'input',
            message: "What is their last name?",
        }
    ]).then((answer) => {
        const nameAnswers = [answer.firstName, answer.lastName]
        let roleQuery = `SELECT roles.id, roles.title FROM roles`;
        connection.query(roleQuery, (err, option) => {
            if (err) return console.log(err); 
            const allRoles = option.map(({ id, title }) => ({ name: title, value: id }));
            inquirer.prompt([
                {
                    name: 'role',
                    type: 'list',
                    message: "What is the employee's role?",
                    choices: allRoles
                }
            ]).then((roleChoice) => {
                let role = roleChoice.role;
                nameAnswers.push(role);
                let managerQuery =  `SELECT * FROM employee`;
                connection.query(managerQuery, (err, option) => {
                    if (err) return console.log(err);
                    const allManagers = option.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));
                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'manager',
                            message: "Who is the employee's manager?",
                            choices: allManagers
                        }
                    ]).then((managerChoice) => {
                        let manager = managerChoice.manager;
                        nameAnswers.push(manager);
                        let query =   `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                        VALUES (?, ?, ?, ?)`;
                        connection.query(query, nameAnswers, (err) => {
                            if (err) return console.log(err);
                            console.log("---------------------------------------", "\nView all Employees to see new addition.", "\n---------------------------------------")
                            questionPrompt();
                        });
                    });
                });
            });
         });
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

