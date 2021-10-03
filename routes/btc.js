const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const chainController = require('../controllers/chainController');
const accountController = require('../controllers/accountController');
const walletController = require('../controllers/walletController');
const globalVariableController = require('../controllers/globalVariableController');


/**
 * @swagger
 * tags:
 *   name: BTC
 *   description: Bitcoin managing API
 */

/**
 * @swagger
 * /btc/isAddress/{address}:
 *   get:
 *     summary: Validate the address
 *     tags: [BTC]
 *     description: Validate the address
 *     parameters:
 *       - in: path
 *         name: address
 *         schema:
 *           type: string
 *         required: true
 *         description: Bitcoin address
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/isAddress/:address', chainController.IsAddress);
/**
 * @swagger
 * /btc/tx/{txHash}:
 *   get:
 *     summary: Get transaction by transaction hash
 *     tags: [BTC]
 *     description: Get transaction by transaction hash
 *     parameters:
 *       - in: path
 *         name: txHash
 *         schema:
 *           type: string
 *         required: true
 *         description: Transaction hash
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/tx/:txHash', chainController.GetTransaction);

// IMPORTANT !!!
// /chain, /provider will be merged later

/**
 * @swagger
 * /btc/chain:
 *   get:
 *     summary: Get current Network Type
 *     tags: [BTC]
 *     description: Get current Network Type
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/chain', chainController.GetChain);
/**
 * @swagger
 * /btc/provider:
 *   get:
 *     summary: Get current Provider
 *     tags: [BTC]
 *     description: Get current Provider
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/provider', chainController.GetProvider);
/**
 * @swagger
 * /btc/accounts:
 *   post:
 *     summary: Add new account
 *     tags: [BTC]
 *     description: Add new account
 *     requestBody:
 *      description: The account to create by wallet name
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - wallet
 *            properties:
 *              wallet:
 *                type: string
 *     responses:
 *        200:
 *          description: Created
 */
router.post('/accounts', accountController.Add);
/**
 * @swagger
 * /btc/send:
 *   post:
 *     summary: To send bitcoin to an address
 *     tags: [BTC]
 *     description: Send bitcoin
 *     requestBody:
 *      description: To send bitcoin to an address
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - wallet
 *              - amount
 *              - address
 *            properties:
 *              wallet:
 *                type: string
 *              amount:
 *                type: number
 *              address:
 *                type: string
 *     responses:
 *      200:
 *       description: OK
 */
router.post('/send', chainController.SendTo);
/**
 * @swagger
 * /btc/balance/{address}:
 *   get:
 *     summary: Get the balance of bitcoin at an address 
 *     tags: [BTC]
 *     description: Get the balance of bitcoin at an address 
 *     parameters:
 *       - in: path
 *         name: address
 *         schema:
 *           type: string
 *         required: true
 *         description: The address
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/balance/:address', chainController.GetBalance);
/**
 * @swagger
 * /btc/subscribe:
 *   get:
 *     summary: Subscribe the new transaction notification
 *     tags: [BTC]
 *     description: Subscribe the new transaction notification
 *     responses:
 *       200:
 *         description: Success
 */
router.get("/subscribe", transactionController.SubscribePendingTransactions);
/**
 * @swagger
 * /btc/unsubscribe:
 *   get:
 *     summary: Unsubscribe the new transaction notification
 *     tags: [BTC]
 *     description: Unsubscribe the new transaction notification
 *     responses:
 *       200:
 *         description: Success
 */
router.get("/unsubscribe", transactionController.UnsubscribePendingTransactions);
/**
 * @swagger
 * /btc/wallets/name/{wallet}:
 *   patch:
 *     summary: Update the wallet by wallet name
 *     tags: [BTC]
 *     description: Update the wallet by wallet name
 *     parameters:
 *       - in: path
 *         name: wallet
 *         schema:
 *           type: string
 *         required: true
 *         description: The wallet name
 *     requestBody:
 *      description: The wallet to update
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              notifyUrl:
 *                type: string
 *     responses:
 *        200:
 *          description: Updated
 */
router.patch('/wallets/name/:wallet', walletController.UpdateByName);
/**
 * @swagger
 * /btc/wallets/name/{name}:
 *   get:
 *     summary: Get the wallet by wallet name
 *     tags: [BTC]
 *     description: Get the wallet by wallet name
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: The wallet name
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/wallets/name/:name', walletController.GetByName);
/**
 * @swagger
 * /btc/globalVariables:
 *   get:
 *     summary: Get all system variables
 *     tags: [BTC]
 *     description: Get all system variables
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/globalVariables', globalVariableController.List);
/**
 * @swagger
 * /btc/globalVariables:
 *   patch:
 *     summary: Update the system variables
 *     tags: [BTC]
 *     description: Update the system variables
 *     requestBody:
 *      description: Update the system variables
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              confirmationCount:
 *                type: number
 *              autoMoving:
 *                type: boolean
 *     responses:
 *        200:
 *          description: Updated
 */
router.patch('/globalVariables', globalVariableController.Update);
//test
router.post('/move', chainController.MoveTo);
router.get('/test', chainController.Test);



module.exports = router;