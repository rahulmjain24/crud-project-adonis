import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Profile from 'App/Models/Profile'
import User from 'App/Models/User'
import Hash from '@ioc:Adonis/Core/Hash'
import CreateUser from 'App/Validators/CreateUserValidator'


export default class UsersController {
    public async getAllUsers() {
        return User.all()
    }

    public async deleteUser({ request, auth, response }: HttpContextContract) {
        try {
            const { mobile_number } = request.all();
            const user = auth.use('api').user!

            const profile = await Profile.query().where('user_id', user.id).where('mobile_number', mobile_number).firstOrFail()
            if(profile) {
                await user.delete()
                return {
                    message: 'Your profile has been Deleted'
                }
            }
        } catch (e) {
            console.log(e)
            response.status(403)
            return {
                error: 'Please enter valid number'
            }
        }
    }

    public async createUser({ request, response }: HttpContextContract) {
        try {
            const newPostData = await request.validate(CreateUser)
            const user = new User()
            user.email = newPostData.email
            user.password = newPostData.password
            await user.save()
            return {
                message: 'The account has been created successfully!!'
            }
        } catch (e) {
            response.status(403)
            return e.messages || e.detail && { error: 'This email already exists' }
        }
    }

    public async login({ request, auth, response }: HttpContextContract) {
        try {
            const { email, password } = request.all();
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

    public async logout({ auth }: HttpContextContract) {
        auth.use('api').logout()
        return {
            message: 'You have been logged out'
        }
    }
}
