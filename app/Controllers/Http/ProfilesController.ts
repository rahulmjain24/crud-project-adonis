import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Profile from 'App/Models/Profile'
import CreateProfile from 'App/Validators/CreateProfileValidator'
import UpdateProfile from 'App/Validators/UpdateProfileValidator'

export default class ProfilesController {
    public async getUserProfile({ auth }: HttpContextContract) {
        try {
            const user = auth.use('api').user!
            await user.load('profile')
            return {
                first_name: user.profile.firstName,
                last_name: user.profile.lastName,
                email: user.email,
                gender: user.profile.gender,
                dob: user.profile.dob
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
            const profileData = await request.validate(CreateProfile)
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

            if (newProfileData.first_name) {
                profile.firstName = newProfileData.first_name
            }
            if (newProfileData.last_name) {
                profile.lastName = newProfileData.last_name
            }
            if (newProfileData.mobile_number) {
                profile.mobileNumber = newProfileData.mobile_number
            }
            if (newProfileData.gender) {
                profile.gender = newProfileData.gender
            }
            if (newProfileData.dob) {
                profile.dob = newProfileData.dob
            }
            if (newProfileData.email) {
                user.email = newProfileData.email
            }
            if (newProfileData.password) {
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
