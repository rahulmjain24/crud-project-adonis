import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class VerifyToken {
  public async handle({auth, response}: HttpContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    try {
      await auth.use('api').authenticate()
      if(auth.use('api').isAuthenticated) {
        await next()
      } else {
        response.status(200).json({error: 'You need to be signed in to use this API'})
      }
    } catch(e) {
      console.log(e)
      response.status(403).json({error: e})
    }
  }
}
