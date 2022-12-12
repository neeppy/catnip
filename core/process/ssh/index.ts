import tunnel from 'tunnel-ssh';
import { Connection } from 'common/models/Connection';

export const SSH_DEFAULT_PORT = 22;

export function connectViaSSH(ssh: Connection) {
    return new Promise((resolve, reject) => {
        tunnel({
            username: ssh.username,
            password: ssh.password,
            host: ssh.hostname,
            dstPort: ssh.port ?? SSH_DEFAULT_PORT,
        }, (err, tnl) => {
            if (!err) {
                console.log('Tunnel ready.');
            }
        });
    });
}
