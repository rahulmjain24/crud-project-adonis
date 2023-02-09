import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import User from 'App/Models/User'

export default class PostsController {
  public async createUser({ request }: HttpContextContract) {
    try {
        const userData = request.body()
        console.log(userData)
        const user = new User()
        user.email = userData.email
        user.password = userData.password
        await user.save()
        return user
    } catch(e) {
        console.error(e)
        return {
            error: e
        }
    }
  }
}
