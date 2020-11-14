/*-------------------------------------------------------------------------
Class: TransactionsMap
Description: 
Utility class that encapsulates operations for manipulating a list of transactions
-------------------------------------------------------------------------*/
const Util = require('./Util');
const Transaction = require('./Transaction');
const AccountMySqlDB = require('./AccountMySqlDB');

module.exports = class TransactionsMap {


    #transactionsMap
    
    /**
     * @constructor
     * @description
     */
    constructor() {
        this.#transactionsMap = new Map();
    }
    
    GetLength() { return this.#transactionsMap.size; }

    /**
     * @description
     * @param {Transaction} transaction
     * @param {AccountMySqlDB} [mySqlObj=undefined]
     * @returns
     */
    Add(transaction, mySqlObj = undefined){

        //Empty transactions are not added
        if (transaction === undefined) return;
        if (transaction.IsEmpty() === true) return;

        let counter = 0;
        let newTransaction = transaction.Clone();

        //check for duplicates and update counter:
        let strID = newTransaction.GetID();
        while (this.#transactionsMap.has(strID)) {
            counter += 1;
            newTransaction.SetID(counter);
            strID = newTransaction.GetID();
        }
        
        this.#transactionsMap.set(newTransaction.GetID(), newTransaction);
        console.log("transaction added");
        if(mySqlObj !== undefined)mySqlObj.AddTransaction(transaction);
    }

    /**
     * @description
     */
    BuildFromArray(entries){

        let transactionsMap = new Map();
        for (const entry of entries) {
            try {

                let newTransaction = new Transaction(entry.date, "",
                    entry.description, entry.category,
                    undefined, undefined, "", "", entry.balance, entry.amount, 0);
                
                this.Add(newTransaction);

            }
            catch (err) {
                console.debug("Error adding new entry to transactionsMap " + err);
            }

        }
        return transactionsMap;
    }

    

    /**
     * @description Extract private member data from transaction liste
     * Return an array of transaction data. 
     * @returns {Array}
     */
    GetArray() {

        let transactions = new Array();
        
        for (const [key, value] of this.#transactionsMap.entries()) {
            let newEntry = { 
                date: value.GetDateString(),
                Description: value.GetDescription(),
                Category: value.GetCategory(),
                Amount: value.GetAmount(),
                Balance: value.GetBalance()                
            };            
            
            transactions.push(newEntry);
          }
                
        return transactions;
    }



}