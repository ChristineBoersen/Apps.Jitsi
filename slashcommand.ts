import { IHttp, IModify, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { App } from '@rocket.chat/apps-engine/definition/App';
import { ISlashCommand, SlashCommandContext } from '@rocket.chat/apps-engine/definition/slashcommands';

export class JitsiSlashCommand implements ISlashCommand {
    public command: string;
    public i18nParamsExample: string;
    public i18nDescription: string;
    public providesPreview: boolean;

    constructor(private readonly app: App) {
        this.command = 'jitsi';
        this.i18nParamsExample = 'params_example';
        this.i18nDescription = 'command_description';
        this.providesPreview = false;
    }

    // tslint:disable-next-line:max-line-length
    public async executor(context: SlashCommandContext, read: IRead, modify: IModify, http: IHttp, persis: IPersistence): Promise<void> {
        const server = await read.getEnvironmentReader().getSettings().getValueById('server');

        const [roomName] = context.getArguments();

        const url = server + (roomName ? roomName : context.getRoom().id + '-' + context.getSender().id);

        return await this.sendMessage(context, modify, `Join the video call: ${ url }\nLink generated by slashcommand \`/jitsi\``);
    }

    private async sendMessage(context: SlashCommandContext, modify: IModify, text: string): Promise<void> {
        const msg = modify.getCreator()
            .startMessage()
            .setText(text)
            // .setUsernameAlias('Jitsi')
            // .setEmojiAvatar(':calendar:')
            .setRoom(context.getRoom())
            .setSender(context.getSender());

        await modify.getCreator().finish(msg);
    }
}
