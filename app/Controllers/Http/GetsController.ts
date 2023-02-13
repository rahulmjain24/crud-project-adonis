import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Profile from 'App/Models/Profile'
import User from 'App/Models/User'

export default class PostsController {
  public async getAllUsers() {
    return User.all()
  }

  public async getUserProfile({ auth }: HttpContextContract) {
    try {
      const user = auth.use('api').user!
      const profile = await Profile.findByOrFail('userId', user.id)
      return {
        first_name: profile.firstName || "",
        last_name: profile.lastName || "",
        email: user.email,
        gender: profile.gender || "",
        dob: profile.dob || ""
      }
    } catch(e) {
      return e
    }
  }
}
