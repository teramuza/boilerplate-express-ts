import express, { Router } from 'express';
import ExampleController from './Example.controller';

const exampleRouter: Router = express.Router();

// Example routes
exampleRouter.get('/', ExampleController.getAll.bind(ExampleController));
exampleRouter.get('/:id', ExampleController.getById.bind(ExampleController));
exampleRouter.post('/', ExampleController.create.bind(ExampleController));
exampleRouter.put('/:id', ExampleController.update.bind(ExampleController));
exampleRouter.delete('/:id', ExampleController.delete.bind(ExampleController));

export default exampleRouter;
