import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Profile from 'App/Models/Profile'

export default class DeletesController {
    public async deleteUser({ request, auth, response }: HttpContextContract) {
        try {
            const number = request.body().mobile_number
            const user  = auth.use('api').user!
    
            const profile = await Profile.findByOrFail('user_id', user.id)
            if(profile.mobileNumber === number) {
                user.delete()
                return {
                    message: 'Your profile has been '
                }
            } else {
                response.status(403)
                return {
                    error: 'Please enter valid number'
                }
            }
        } catch(e) {
            console.log(e)
            return {
                error: e
            }
        }
    }
}
