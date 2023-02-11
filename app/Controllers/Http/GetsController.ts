import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Profile from 'App/Models/Profile'
import User from 'App/Models/User'

export default class PostsController {
  public async getAllUsers() {
    return User.all()
  }

  public async getUser({ auth }: HttpContextContract) {
    return auth.use('api').user
  }

  public async getUserProfile({ auth }: HttpContextContract) {
    try {
      const profile = Profile.findByOrFail('userId', auth.use('api').user!.id)
      return profile
    } catch(e) {
      return {
        error: e
      }
    }
  }

  public async logout({ auth }: HttpContextContract) {
    auth.use('api').logout()
    return {
      message: 'You have been logged out'
    }
  }
}
