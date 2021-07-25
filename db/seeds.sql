INSERT INTO department (dept_name)
VALUES ("Sales"), ("Engineering"), ("Finance"), ("Legal")

INSERT INTO roles (title, salary, department_name)
VALUES ("Salesperson", 40000, 1), ("Sales Lead", 50000, 1), ("Account Manager", 60000, 1), ("Software Engineer", 70000, 2), ("Lead Engineer", 75000, 2), ("Accountant", 65000, 3), ("Legal Team Lead", 85000, 4), ("Lawyer", 80000, 4)

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("John", "Doe", 1, 3), ("James", "Ryan", 2, 3), ("Mike", "Rowe", 3, null), ("Jane", "Doe", 4, 5), ("Tim", "Burton", 5, null), ("Pand", "Frea", 6, null), ("Dale", "Dobek", 7, null), ("Brennan", "Huff", 8, 7), ("Jack", "Russell", 1, 3), ("Jean", "Jacket", 4, 5), ("Adrian", "Monk", 6, null)