const express = require('express');
const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Types
 *   description: Book types management
 *
 * components:
 *   schemas:
 *     Type:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           description: Auto-generated ID
 *         name:
 *           type: string
 *       example:
 *         id: "64d0c1f5e6f4a5a1c2b3d4e5"
 *         name: "Paperback"
 */
const validate = require('../validators/validate');
const { nameSchema } = require('../validators/typeCategoryValidator');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');
const { getTypes, getTypeById, createType, updateType, deleteType } = require('../controllers/typeController');

/**
 * @swagger
 * /types:
 *   get:
 *     tags: [Types]
 *     summary: Get all types
 *     responses:
 *       200:
 *         description: List of types
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Type'
 */
router.get('/', getTypes);
/**
 * @swagger
 * /types/{id}:
 *   get:
 *     tags: [Types]
 *     summary: Get a type by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Type ID
 *     responses:
 *       200:
 *         description: Type data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Type'
 *       404:
 *         description: Type not found
 */
router.get('/:id', getTypeById);

/**
 * @swagger
 * /types:
 *   post:
 *     tags: [Types]
 *     summary: Create a new type
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Type'
 *     responses:
 *       201:
 *         description: Type created
 */
router.post('/', protect, admin, validate(nameSchema), createType);
/**
 * @swagger
 * /types/{id}:
 *   put:
 *     tags: [Types]
 *     summary: Update a type
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Type'
 *     responses:
 *       200:
 *         description: Type updated
 */
router.put('/:id', protect, admin, validate(nameSchema), updateType);
/**
 * @swagger
 * /types/{id}:
 *   delete:
 *     tags: [Types]
 *     summary: Delete a type
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Type removed
 */
router.delete('/:id', protect, admin, deleteType);

module.exports = router;
