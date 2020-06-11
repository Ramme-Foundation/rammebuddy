import strava from 'strava-v3';

export class StravaApi {
  constructor() {
    strava.config({
      access_token: process.env.STRAVA_ACCESS_TOKEN!,
      client_id: process.env.STRAVA_CLIENT_ID!,
      client_secret: process.env.STRAVA_CLIENT_SECRET!,
      redirect_uri: process.env.STRAVA_REDIRECT_URL!,
    });
  }

  oauthUrl(userId: string) {
    return strava.oauth.getRequestAccessURL({
      state: userId,
      scope: 'activity:read_all',
    });
  }

  async verifyOauth(code: string) {
    return await strava.oauth.getToken(code);
  }

  createAppSubscription() {
    console.log('SEND TO', process.env.STRAVA_PUSH_REDIRECT_URL!);
    return strava.pushSubscriptions.create({
      verify_token: 'STRAVA',
      callback_url: process.env.STRAVA_PUSH_REDIRECT_URL!,
    });
  }
}
