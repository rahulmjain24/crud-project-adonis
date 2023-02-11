import Hash from '@ioc:Adonis/Core/Hash'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'


export default class PatchesController {
    public async updateUser({auth, request, response}: HttpContextContract) {
        try {
            const newUserSchema = schema.create({
                email: schema.string.optional({}, [rules.email()]),
                password: schema.string.optional({}, [rules.minLength(8), rules.maxLength(16)])
              })
    
            const newPostData = await request.validate({schema : newUserSchema})
            const user = auth.use('api').user!
            if(newPostData.email) {
                user.email = newPostData.email
            }
            if(newPostData.password) {
                user.password = await Hash.make(newPostData.password) 
            }
            await user.save()
            return user
        } catch(e) {
            response.status(403)
            return {
                error: "Please Enter valid data"
            }
        }
    }
}
