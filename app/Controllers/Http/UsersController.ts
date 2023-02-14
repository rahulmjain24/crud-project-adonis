import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import Hash from '@ioc:Adonis/Core/Hash'
import CreateUser from 'App/Validators/CreateUserValidator'


export default class UsersController {
    public async signUp({ request, response }: HttpContextContract) {
        try {
            const { email, password } = await request.validate(CreateUser)

            await User.create({
                email,
                password
            })

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
