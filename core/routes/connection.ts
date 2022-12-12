import { Connection } from 'common/models/Connection';

export default [
    {
        channel: 'create-ssh-tunnel',
        async handle(data: Connection) {
            console.log(data);
        }
    }
];
