/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         money:
 *           type: number
 *         admin:
 *           type: boolean
 *         isEmailVerified:
 *           type: boolean
 *         emailVerificationToken:
 *           type: string
 *         emailVerificationTokenExpires:
 *           type: string
 *           format: date-time
 *         passwordResetToken:
 *           type: string
 *         passwordResetTokenExpires:
 *           type: string
 *           format: date-time
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *         password:
 *           type: string
 *     AuthResponse:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         token:
 *           type: string
 */