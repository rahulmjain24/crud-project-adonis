import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class PostsController {
  public async getAllUsers(ctx: HttpContextContract) {
    const users = User.all()
    return users
  }
}
