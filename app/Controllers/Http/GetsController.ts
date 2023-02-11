import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class PostsController {
  public async getAllUsers() {
    return User.all()
  }

  public async getUser({ auth }: HttpContextContract) {
    return auth.use('api').user
  }

  public async logout({ auth }: HttpContextContract) {
    auth.use('api').logout()
    return {
      message: 'You have been logged out'
    }
  }
}
