import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Profile from 'App/Models/Profile'


export default class PatchesController {
    public async updateProfile({ auth, request, response }: HttpContextContract) {
        try {
            const newProfileSchema = schema.create({
                email: schema.string.optional({}, [rules.email()]),
                password: schema.string.optional({}, [rules.minLength(8), rules.maxLength(16)]),
                first_name: schema.string.optional({}, [rules.minLength(3), rules.maxLength(30)]),
                last_name: schema.string.optional({}, [rules.minLength(3), rules.maxLength(30)]),
                mobile_number: schema.string.optional({}, [rules.mobile(), rules.minLength(10), rules.maxLength(10)]),
                gender: schema.enum.optional(['MALE', 'FEMALE']),
                dob: schema.date.optional({
                    format: 'dd-MM-yyyy'
                })
            })
            const user = auth.use('api').user!

            const newProfileData = await request.validate({schema: newProfileSchema})
            const profile = await Profile.findByOrFail('user_id', user.id)

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
            if(newProfileData.email) {
                user.email = newProfileData.email
            }
            if(newProfileData.password) {
                user.password = newProfileData.password
            }
            await user.save()
            await profile.save()
            return {
                message: 'The profile has been updated successfully'
            }
        } catch (e) {
            response.status(403)
            return e
        }
    }
}
