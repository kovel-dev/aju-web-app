import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import { verifyPassword } from '../../../lib/middleware/auth'
import { faunaClient } from '../../../lib/config/fauna'
import { query as q } from 'faunadb'

export default NextAuth({
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  session: {
    jwt: true,
    maxAge: 7 * 24 * 60 * 60,
  },
  providers: [
    Providers.Credentials({
      async authorize(credentials) {
        /**
         * @NOTE: This is the NextJS Authentication process
         * This will check the credentials given if it's matches the database instance
         * If it doesn't matches or doesn't have the record in the database it will throw an error
         * If it passes the verification process then it will return the email address (you can add more except sensitive data)
         * which will be included in the process of nextJS on making the jwt token.
         *
         */
        let user = null
        await faunaClient
          .query(q.Get(q.Match(q.Index('users_by_email'), credentials.email)))
          .then((result) => {
            user = result
          })
          .catch((err) => {
            // Add error logging here
            console.log(err)
            throw new Error('Invalid credentials. Please try again.')
          })

        const isValid = await verifyPassword(
          credentials.password,
          user.data.password
        )

        if (!isValid) {
          // Add error logging here
          throw new Error('Invalid credentials. Please try again.')
        }

        //check if user is active or not
        if (user.data.status != 'active') {
          throw new Error('Invalid credentials. Please try again.')
        }

        //check if user is deleted
        if (user.data.is_deleted === true) {
          throw new Error('Invalid credentials. Please try again.')
        }

        //check if user is verified
        if (user.data.is_verified === false) {
          throw new Error('Invalid credentials. Please try again.')
        }

        if (['student', 'partner'].indexOf(user.data.role) == -1) {
          throw new Error('Invalid credentials. Please try again.')
        }

        let timezone = 'America/Los_Angeles'
        if (user.data.role == 'partner') {
          try {
            await faunaClient
              .query(
                q.Get(
                  q.Match(q.Index('organizations_by_owner_id'), user.ref.id)
                )
              )
              .then((retPartner) => {
                timezone = retPartner.data.timezone
              })
          } catch (error) {
            throw new Error('Invalid credentials. Please try again.')
          }
        } else if (user.data.timezone.length > 0) {
          timezone = user.data.timezone
        }

        return {
          refID: user['ref'].id,
          name: user.data.first_name,
          email: user.data.email,
          role: user.data.role,
          status: user.data.status,
          timezone: timezone,
        }
      },
    }),
  ],
  pages: {
    error: '/sign-in', // Error code passed in query string as ?error=
  },
  callbacks: {
    /**
     * @param  {object}  token     Decrypted JSON Web Token
     * @param  {object}  user      User object      (only available on sign in)
     * @param  {object}  account   Provider account (only available on sign in)
     * @param  {object}  profile   Provider profile (only available on sign in)
     * @param  {boolean} isNewUser True if new user (only available on sign in)
     * @return {object}            JSON Web Token that will be saved
     */
    async jwt(token, user) {
      // Add access_token to the token right after signin
      if (user) {
        token.userRefID = user.refID ? user.refID : ''
        token.userRole = user.role ? user.role : ''
        token.userStatus = user.status ? user.status : ''
        token.userTimezone = user.timezone ? user.timezone : ''
      }
      return token
    },

    /**
     * @param  {object} session      Session object
     * @param  {object} token        User object    (if using database sessions)
     *                               JSON Web Token (if not using database sessions)
     * @return {object}              Session that will be returned to the client
     */
    async session(session, token) {
      // Add property to session, like an access_token from a provider.
      if (
        token &&
        token.userRefID !== undefined &&
        ['student', 'partner'].indexOf(token.userRole) > -1
      ) {
        session.user.id = token.userRefID
        session.user.role = token.userRole
        session.user.status = token.userStatus
        session.user.timezone = token.userTimezone
        return session
      }
    },
  },
})
