import { createEventAdapter } from '@slack/events-api';
import { WebClient } from '@slack/web-api';
import SlackEventAdapter from '@slack/events-api/dist/adapter';
import { logger } from '../../utils/logger';
import { getRepository } from 'typeorm';
import { SlackUser } from '../../entity/SlackUser';
import { StravaUser } from '../../entity/StravaUser';
import { User } from '../../entity/User';
import { StravaApi } from '../strava/StravaApi';

interface SlackMessage {
  // eslint-disable-next-line camelcase
  client_msg_id: string;
  type: 'message' | string;
  text: string;
  user: string;
  // eslint-disable-next-line camelcase
  bot_id?: string;
  ts: string;
  team: string;
  blocks: any[];
  channel: string;
  // eslint-disable-next-line camelcase
  event_ts: string;
  // eslint-disable-next-line camelcase
  channel_type: 'im' | string;
}

/**
 * Class that handles user interactions directly to ramme bot
 */
export class SlackBot {
  slackEvents: SlackEventAdapter & NodeJS.EventEmitter;
  webClient: WebClient;
  constructor() {
    const secret = process.env.SLACK_SIGNING_SECRET;
    const token = process.env.SLACK_TOKEN;
    if (!secret) {
      throw Error('no SLACK_SIGNING_SECRET specified');
    }
    if (!token) {
      throw Error('no SLACK_TOKEN specified');
    }
    this.slackEvents = createEventAdapter(secret) as any;
    this.webClient = new WebClient(token);
    this.registerListeners();
  }

  public requestListener() {
    return this.slackEvents.expressMiddleware();
  }

  private async getSlackUserWithUser(userId: string, teamId: string) {
    const slackRepo = getRepository(SlackUser);
    return await slackRepo.findOne(
      {
        slackId: userId,
        teamId: teamId,
      },
      { relations: ['user'] },
    );
  }

  public async sendStravaInfo(
    userId: string,
    teamId: string,
    responseChannel: string,
  ) {
    // Check for a slack user!
    // 1. Create one if no one is found
    const userRepo = getRepository(User);
    const slackRepo = getRepository(SlackUser);
    let slackUser = await this.getSlackUserWithUser(userId, teamId);
    if (!slackUser) {
      logger.info(
        `[SlackBot][sendStravaInfo]: Could not find user: ${userId} in team: ${teamId}, creating one`,
      );
      let user = userRepo.create({
        stravaId: '',
      });
      user = await userRepo.save(user);
      slackUser = slackRepo.create({
        slackId: userId,
        teamId: teamId,
        username: '',
        user: user,
      });
      await slackRepo.save(slackUser);
    }
    slackUser = await this.getSlackUserWithUser(userId, teamId);
    if (!slackUser) {
      logger.info(
        `[SlackBot][sendStravaInfo]: Created a user but failed to query it afterwards`,
      );
      return;
    }
    logger.info(`[SlackBot][sendStravaInfo]: Found user: ${slackUser.id}`);

    const stravaRepo = getRepository(StravaUser);

    const stravaUser = await stravaRepo.findOne({ user: slackUser.user });
    if (!stravaUser) {
      logger.info(
        `[SlackBot][sendStravaInfo]: No strava user found for: ${slackUser.user.id}`,
      );
      const stravaUrl = await new StravaApi().oauthUrl(slackUser.user.id);
      await this.webClient.chat.postMessage({
        mrkdwn: true,
        channel: responseChannel,
        text: `It looks like you would like to connect this slack user to a *Strava* account. Please follow the link below to continue!\n *<${stravaUrl}|Link Account>*`,
      });
    } else {
      console.log('SEND ALREADY SETYUP');
    }
    // 2. Lets check for a strava user
    // 2.b => If we found then return You are already connected text
    // 3 If none is found return OauthURL!
  }

  private registerListeners() {
    console.log('REG', this.slackEvents.on);
    this.slackEvents.on('message', (event: SlackMessage) => {
      logger.info(`GOT MESSAGE ${JSON.stringify(event)}`);
      // Ignore bot messages
      if (event.bot_id) {
        return;
      }
      if (event.text.includes('strava')) {
        this.sendStravaInfo(event.user, event.team, event.channel);
      }
    });
  }
}
