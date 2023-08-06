import * as core from '@actions/core';
import { context } from '@actions/github';
import { GitHub } from '@actions/github/lib/utils';
import { wait } from './wait';

type GitHubContext = {
  github: InstanceType<typeof GitHub>;
  context: typeof context;
};

export const main = async ({ github, context }: GitHubContext): Promise<void> => {
  try {
    console.log('github ggg', github);
    console.log('context ggg', context);
    const msString: string = core.getInput('milliseconds') || '1';
    github.log.debug(`Waiting ${msString} milliseconds ...`); // debug is only output if you set the secret `ACTIONS_STEP_DEBUG` to true

    const ms: number = parseInt(msString, 10);

    if (isNaN(ms)) {
      throw new Error('milliseconds not a number');
    }

    github.log.debug(new Date().toTimeString());
    await wait(ms);
    github.log.debug(new Date().toTimeString());

    core.setOutput('timesssssssssssss', new Date().toTimeString());
  } catch (e: unknown) {
    if (e instanceof Error) core.setFailed(e.message);
  }
};
