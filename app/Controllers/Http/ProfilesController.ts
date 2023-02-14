import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Profile from 'App/Models/Profile'
import CreateProfile from 'App/Validators/CreateProfileValidator'
import UpdateProfile from 'App/Validators/UpdateProfileValidator'

export default class ProfilesController {
    public async getUserProfile({ auth }: HttpContextContract) {
        try {
            const user = auth.use('api').user!
            await user.load('profile')

            if (user.profile) {
                return {
                    first_name: user.profile.firstName,
                    last_name: user.profile.lastName,
                    email: user.email,
                    gender: user.profile.gender,
                    dob: user.profile.dob
                }
            }

            return {
                error: 'Profile not found'
            }
        } catch (e) {
            console.log(e)
            return {
                error: 'Profile not found'
            }
        }
    }

    public async createProfile({ request, auth, response }: HttpContextContract) {
        try {
            const userId = auth.use('api').user!.id
            const { first_name, last_name, mobile_number, gender, dob } = await request.validate(CreateProfile)

            await Profile.create({
                userId: userId,
                firstName: first_name,
                lastName: last_name,
                mobileNumber: mobile_number,
                gender: gender,
                dob: dob
            })

            return {
                message: 'The profile has been created successfully'
            }
        } catch (e) {
            response.status(403)
            return e.messages || { error: 'something went wrong' }
        }
    }

    public async updateProfile({ auth, request, response }: HttpContextContract) {
        try {
            const user = auth.use('api').user!
            const newProfileData = await request.validate(UpdateProfile)
            const profile = await Profile.findByOrFail('user_id', user.id)

            profile.merge({
                firstName: newProfileData.first_name,
                lastName: newProfileData.last_name,
                mobileNumber: newProfileData.mobile_number,
                gender: newProfileData.gender,
                dob: newProfileData.dob
            })

            await profile.save()

            return {
                message: 'The profile has been updated successfully'
            }
        } catch (e) {
            response.status(403)
            return e
        }
    }

    public async deleteProfile({ request, auth, response }: HttpContextContract) {
        try {
            const { mobile_number } = request.all();
            const user = auth.use('api').user!

            await Profile.query().where('user_id', user.id).where('mobile_number', mobile_number).firstOrFail()

            await user.delete()

            return {
                message: 'Your profile has been Deleted'
            }
        } catch (e) {
            console.log(e)
            response.status(403)
            return {
                error: 'Profile not found!!'
            }
        }
    }
}
