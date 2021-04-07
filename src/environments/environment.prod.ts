export const environment = {
  production: true,
  api: {
    signUp: 'http://localhost:3000/auth/signup',
    signIn: 'http://localhost:3000/auth/signin',
    refreshAccessToken: 'http://localhost:3000/auth/refresh-access-token',
    audio: {
      files: 'http://localhost:3000/audio/files'
    }
  }
};
