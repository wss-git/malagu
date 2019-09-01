import { container } from '@malagu/core/lib/common/dynamic-container';
import { Dispatcher, Context } from '@malagu/core/lib/node';
import { EventContext, Callback } from './context';
import { ContainerProvider } from '@malagu/core/lib/common/container-provider';
import { Application } from '@malagu/core/lib/common/application-protocol';

export async function init(context: any, callback: any) {
    try {
        const c = await container;
        await c.get<Application>(Application).start();
        callback(undefined, '');
    } catch (err) {
        callback(err);
    }
}

export function handler(event: string, context: any, callback: Callback) {
    container.then(c => {
        ContainerProvider.set(c);
        const dispatcher = c.get<Dispatcher<EventContext>>(Dispatcher);
        const eventContext = new EventContext(event, context, callback);
        Context.run(() => dispatcher.dispatch(eventContext));
    });
}