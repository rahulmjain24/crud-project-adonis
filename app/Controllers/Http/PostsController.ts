import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Hash from '@ioc:Adonis/Core/Hash'

import User from 'App/Models/User'

export default class PostsController {
  public async createUser({ request }: HttpContextContract) {
    try {
        const newUserSchema = schema.create({
          email: schema.string({}, [rules.email()]),
          password: schema.string({}, [rules.minLength(8), rules.maxLength(16)])
        })
        const newPostData = await request.validate({schema : newUserSchema})
        // console.log('newPostData',newPostData)
        const user = new User()
        user.email = newPostData.email
        user.password = newPostData.password
        await user.save()
        return user
    } catch(e) {
        console.error(e)
        return {
            error: e
        }
    }
  }

  public async login({ request, auth, response }: HttpContextContract) {
    const email = request.input('email')
    const password = request.input('password')
    
    try {
      const user = await User.query().where('email', email).firstOrFail()
      if (!(await Hash.verify(user.password, password))) {
        return response.unauthorized('Invalid credentials')
      }
      const token = await auth.use('api').generate(user)
      return token
    } catch(e) {
      console.log(e)
      return {
        error: e
      }
    }
  }
}
