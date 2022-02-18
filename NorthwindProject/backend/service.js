const express=require('express');
const cors=require('cors');

const app = express();//sırası önemli use'dan önce bu satır yazılmalı
app.use(cors()); //middleware 


const cate = require('./categories.js');
const categoryArr=cate.categories;

const emp = require('./employees.js');
const employeeArr=emp.employees;

const ord = require('./orders.js');
const orderArr=ord.orders;

const pro = require('./products.js');
const productArr=pro.products;

const supp = require('./suppliers.js');
const supplierArr=supp.suppliers;

app.get('/orders', (request, response) => {
    response.setHeader('Content-Type', 'application/json');
    response.send(orderArr);
});
app.get('/employees', (request, response) => {
    response.setHeader('Content-Type', 'application/json');
    response.send(employeeArr);
});
app.get('/products', (request, response) => {
    response.setHeader('Content-Type', 'application/json');
    response.send(productArr);
});

app.listen(3000,() => {
    console.log('listening on');
});