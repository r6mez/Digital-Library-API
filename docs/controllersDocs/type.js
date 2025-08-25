/**
 * @swagger
 * tags:
 *   name: Types
 *   description: Book types management
 */


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
