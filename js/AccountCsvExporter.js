/*-------------------------------------------------------------------------
Class: AccountCsvExporter
Description: 
Exports an account book to a CSV file
-------------------------------------------------------------------------*/

const Util = require('./Util');
const Transaction = require('./Transaction');
const AccountRulesParser = require('./AccountRulesParser');
const transactionsMap = require('./TransactionsMap');

module.exports = class AccountCsvExporter {

    /**
     *Creates an instance of AccountCsvExporter.
     */
    constructor() {
        
    }

    /**
     * @description
     * @param {string} fileName
     * @param {transactionsMap} transactions
     */
    async ExportCsv(fileName, transactions) {
        const createCsvWriter = require('csv-writer').createObjectCsvWriter;
        console.debug("Exporting CSV file: " + fileName);

        //TODO Implement accountInfo Object to output correct column names
        const csvWriter = createCsvWriter({
            path: fileName,
            header: [{
                id: 'date',
                title: 'Date'
            },
            {
                id: 'Description',
                title: 'Description'
            },
            {
                id: 'Category',
                title: 'Categorie'
            },
            {
                id: 'Amount',
                title: 'Montant'
            },
            {
                id: 'Balance',
                title: 'Solde'
            }
            ]
        });
        
        await csvWriter.writeRecords(transactions.GetArray());
        console.log('The CSV file ' + fileName + ' was written successfully');
    }


  
}