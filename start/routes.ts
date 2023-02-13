/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/users', 'GetsController.getAllUsers')
Route.post('/register', 'PostsController.createUser')
Route.post('/login', 'PostsController.login')

Route.group(() => {
  Route.get('/user', 'GetsController.getUser')
  Route.get('/logout', 'GetsController.logout')
  Route.patch('/user', 'PatchesController.updateUser')

  Route.get('/user/profile', 'GetsController.getUserProfile')
  Route.post('/user/profile', 'PostsController.createProfile')
  Route.patch('/user/profile', 'PatchesController.updateProfile')

  Route.delete('/user/profile', 'DeletesController.deleteUser')
})
.middleware('auth')


Route.get('/', async () => {
  return { hello: 'world' }
})
