import { registerCommand } from '../globals';
import { toggleOverview } from '../tabs';

export function registerLayoutCommands() {
    registerCommand({
        key: 'overview',
        name: 'Overview',
        handler: toggleOverview,
    });
}
