import { param } from 'express-validator';

/** Validates that :id in the URL is a MongoDB ObjectId. */
export const idParamRules = [param('id').isMongoId().withMessage('Invalid id')];
