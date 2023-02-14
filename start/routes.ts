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

Route.get('/users', 'UsersController.getAllUsers')
Route.post('/register', 'UsersController.createUser')
Route.post('/login', 'UsersController.login')
Route.post('/logout', 'UsersController.logout')
.middleware('auth')

Route.group(() => {
  Route.get('/profile', 'ProfilesController.getUserProfile')
  Route.post('/profile', 'ProfilesController.createProfile')
  Route.put('/profile', 'ProfilesController.updateProfile')
  Route.delete('/profile', 'UsersController.deleteUser')
})
.prefix('/user')
.middleware('auth')


Route.get('/', async () => {
  return (
    `
    <p>
      post /login -> AuthController
      post /register -> AuthController
      post /logout -> AuthController
      get /user/profile -> ProfileController
      post /user/profile -> ProfileController
      put /user/profile -> ProfileController
      delete /user/profile -> ProfileController
    </p>
    `
  )
})
