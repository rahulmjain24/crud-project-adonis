import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Profile from 'App/Models/Profile'


export default class PatchesController {
    public async updateUser({ auth, request, response }: HttpContextContract) {
        try {
            const newUserSchema = schema.create({
                email: schema.string.optional({}, [rules.email()]),
                password: schema.string.optional({}, [rules.minLength(8), rules.maxLength(16)])
            })

            const newPostData = await request.validate({ schema: newUserSchema })
            const user = auth.use('api').user!
            if (newPostData.email) {
                user.email = newPostData.email
            }
            if (newPostData.password) {
                console.log('newPostData',newPostData)
                user.password = newPostData.password
            }
            await user.save()            
            return user
        } catch (e) {
            response.status(403)
            return {
                error: "Please Enter valid data"
            }
        }
    }

    public async updateProfile({ auth, request, response }: HttpContextContract) {
        try {
            const newProfileSchema = schema.create({
                first_name: schema.string.optional({}, [rules.minLength(3), rules.maxLength(30)]),
                last_name: schema.string.optional({}, [rules.minLength(3), rules.maxLength(30)]),
                mobile_number: schema.string.optional({}, [rules.mobile(), rules.minLength(10), rules.maxLength(10)]),
                gender: schema.enum.optional(['MALE', 'FEMALE']),
                dob: schema.date.optional({
                    format: 'dd-MM-yyyy'
                })
            })
            const id = auth.use('api').user!.id

            const newProfileData = await request.validate({schema: newProfileSchema})
            const profile = await Profile.findByOrFail('user_id', id)

            if(newProfileData.first_name) {
                profile.firstName = newProfileData.first_name
            }
            if(newProfileData.last_name) {
                profile.lastName = newProfileData.last_name
            }
            if(newProfileData.mobile_number) {
                profile.mobileNumber = newProfileData.mobile_number
            }
            if(newProfileData.gender) {
                profile.gender = newProfileData.gender
            }
            if(newProfileData.dob) {
                profile.dob = newProfileData.dob
            }
            await profile.save()
            return profile;
        } catch (e) {
            response.status(403)
            return {
                error: "Please Enter valid data"
            }
        }
    }
}
