import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Hash from '@ioc:Adonis/Core/Hash'

import User from 'App/Models/User'
import Profile from 'App/Models/Profile'

export default class PostsController {
  public async createUser({ request, response }: HttpContextContract) {
    try {
      const newUserSchema = schema.create({
        email: schema.string({}, [rules.email()]),
        password: schema.string({}, [rules.minLength(8), rules.maxLength(16), rules.alphaNum()])
      })
      const newPostData = await request.validate({ schema: newUserSchema })
      const user = new User()
      user.email = newPostData.email
      user.password = newPostData.password
      await user.save()
      return {
        message: 'The account has been created successfully!!'
      }
    } catch (e) {
      response.status(403)
      return e.messages || e.detail && {error: 'This email already exists'}
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
    } catch (e) {
      console.log(e)
      response.status(403)
      return {
        error: "Please enter valid email and password!!"
      }
    }
  }

  public async createProfile({ request, auth, response }: HttpContextContract) {
    try {
      const userId = auth.use('api').user!.id
      const newProfileSchema = schema.create({
        first_name: schema.string({}, [rules.minLength(3), rules.maxLength(30)]),
        last_name: schema.string({}, [rules.minLength(3), rules.maxLength(30)]),
        mobile_number: schema.string({}, [rules.mobile(), rules.minLength(10), rules.maxLength(10)]),
        gender: schema.enum(['MALE', 'FEMALE']),
        dob:schema.date({
          format: 'dd-MM-yyyy'
        })
      })
      const profileData = await request.validate({schema: newProfileSchema})
      const userProfile = new Profile()
      userProfile.userId = userId
      userProfile.firstName = profileData.first_name
      userProfile.lastName = profileData.last_name
      userProfile.mobileNumber = profileData.mobile_number
      userProfile.gender = profileData.gender
      userProfile.dob = profileData.dob
      await userProfile.save()
      return {
        message: 'The profile has been created successfully'
      }
    } catch(e) {
      response.status(403)
      return e.messages || {error: 'something went wrong'}
    }
  }
  
  public async logout({ auth }: HttpContextContract) {
    auth.use('api').logout()
    return {
      message: 'You have been logged out'
    }
  }
 }
