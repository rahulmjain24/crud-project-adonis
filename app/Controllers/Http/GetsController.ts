import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class PostsController {
  public async getAllUsers() {
    const users = User.all()
    return users
  }

  public async getUser({ auth }: HttpContextContract) {
    try {
      await auth.use('api').authenticate()
      if(auth.use('api').isAuthenticated) {
       return auth.use('api').user
      } else {
        return {error: 'You are not signed in'}
      }
    } catch(e) {
      console.log(e)
      return {
        error: e
      }
    }
  }
}
