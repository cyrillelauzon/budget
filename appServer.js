/*-------------------------------------------------------------------------
File: appServer.js
Description: 
Main entry point for app and express requests handling
-------------------------------------------------------------------------*/
var bodyParser = require('body-parser');
const express = require('express');
var cors = require('cors');
const app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
// parse application/json;
app.use(bodyParser.json())
const AccountsBook = require('./src/AccountsBook');
const { response } = require('express');
let bankAccount = new AccountsBook;


InitApp();
/**
 * @description 
 */
async function InitApp() {
    console.debug(" ");
    console.debug("*******************************************");
    console.debug("*******Bank transaction server running*****");
    console.debug("*******************************************");
    console.debug(" ");
    console.debug("=====Express: Initializing server=====");

    console.debug(" ");

    //TEMP //TODO (will change to import csv file from post request)
    // await bankAccount.ImportCSV("f://2020-11-25-095220.csv", "Compte chèque de Cyrille");
    //await bankAccount.ImportCSV("./import_csv/epargne.csv", "Compte chèque de Cyrille");
    //await bankAccount.ImportCSV("./import_csv/credit.csv", "Mastercard de Cyrille");
    //   bankAccount.SelectTransactions();

    console.debug("=====Express: End init=====");
    console.debug(" ");

    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    /**
     * @description Listening on port 5000 after Init is done
     */
    app.listen(5000, () => {
        console.log("listening on port 5000");
    })

}

/**
 * @description Get Request for getting array of transactions
 */
app.get('/transactions/:description/:year/:month', async (req, res) => {
    console.debug("=====Express: new Get transactions request=====");
    const { description, year, month } = req.params;
    
    console.debug(`Request Content: description=${description} year=${year} month=${month}`);
    let transactions = await bankAccount.SelectTransactions(description, year, month);

    res.set("Access-Control-Allow-Origin", "*");
    if (transactions !== undefined) res.send(transactions.GetArray());
    else res.send("");
    console.debug("=====En Request=====");
    console.debug(" ");

});

/**
 * @description Put Request for updating transactions
 */
app.put('/transactions/', async (req, res) => {
    console.debug("=====Express: new Put update request=====");
    res.set("Access-Control-Allow-Origin", "*");

    try {
        await bankAccount.UpdateTransaction(req.body);
        res.send('OK');

    } catch (error) {
        res.status(400).send("Error updating transaction");
    }

    console.debug("=====En Put Request=====");
    console.debug(" ");

});


/**
 * @description post request for new transactions
 */
app.post('/categories', async (req, res) => {
    console.debug("=====Express: new Post Category request=====");
    res.set("Access-Control-Allow-Origin", "*");

    try {
        const idNewCategory = await bankAccount.AddCategory(req.body);
        res.send(String(idNewCategory));

    } catch (error) {
        res.status(400).send("Error adding category");
    }

    console.debug("=====End POST Request=====");
    console.debug(" ");    

});


/**
 * @description post request for new transactions
 */
app.get('/categories/:name', async (req, res) => {
    console.debug("=====Express: new GET Category request=====");
    res.set("Access-Control-Allow-Origin", "*");
    const { name } = req.params;

    try {
        const categories = await bankAccount.SelectCategories(name);
        res.send(categories);

    } catch (error) {
        res.status(400).send("Error selecting category");
    }

    console.debug("=====End GET Request=====");
    console.debug(" ");    
});