import NextAuth from 'next-auth'
import SpotifyProvider from 'next-auth/providers/spotify'
import spotifyApi, { LOGIN_URL } from '../../../lib/spotify'

// refresh access method
async function refreshAccessToken(token) {
  try {
    spotifyApi.setAccessToken(token.accessToken)
    spotifyApi.setRefreshToken(token.refreshAccessToken)
    // provide new access token
    const { body: refreshedToken } = await spotifyApi.refreshAccessToken()
    console.log('REFRESHED TOKEN IS ', refreshedToken)

    // return value when TOKEN is refresh
    return {
      ...token,
      accessToken: refreshAccessToken.access_token,
      accessTokenExpires: Date.now + refreshedToken.expires_in * 1000, //= 1 hour as 3600 returns from spotify  API

      //replace if new one came back else fall back to old refresh token
      refreshedToken: refreshedToken.refresh_token ?? token.refreshToken,
    }
    //if any error occurs during the refresh return the error
  } catch (error) {
    console.error(error)
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    }
  }
}

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    SpotifyProvider({
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
      authorization: LOGIN_URL,
    }),
    // ...add more providers here
  ],

  // encrypt the JWT token that we get passed back from spotify
  secret: process.env.JWT_SECRET,

  // creation login page and map it to the /login page
  pages: {
    signIn: '/login',
  },

  // 3 initial scenarios
  // 1:first login(get your first Token )
  // 2:coming back to the page (check if  your Token still available)if yes  used if not =>
  // 3 :refresh your Token

  callbacks: {
    //scenario 1 initial sign in
    async jwt({ token, account, user }) {
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          username: account.providerAccountId,
          // handling expired times in Milliseconds hence * 1000
          accessTokenExpires: account.expires_at * 1000,
        }
      }

      //scenario 2  Return previous token if the access token has not expired yet
      if (Date.now() < token.accessTokenExpires) {
        console.log('EXISTING ACCESS TOKEN IS VALID')
        return token
      }

      // scenario 3 Access token has expired,so we need to refresh it
      console.log(' ACCESS TOKEN HAS EXPIRED, REFRESHING...')
      return refreshAccessToken(token)
    },
    //what the client can see in their session
    async session({ session, token }) {
      session.user.accessToken = token.accessToken
      session.user.refreshToken = token.refreshToken
      session.user.username = token.username
      return session
    },
  },
})
