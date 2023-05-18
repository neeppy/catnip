import { Collapse } from '$components';
import { Number$, String$ } from '$components/form';
import { SectionTitle } from '../../components/SectionTitle';

const getSSHFields = (name: string) => (
    <>
        <String$ name={`${name}.hostname`} className="col-span-3" />
        <Number$ name={`${name}.port`} />
        <String$ name={`${name}.username`} className="col-span-2" />
        <String$ name={`${name}.password`} className="col-span-2" />
    </>
)

export const SSHTunnelSection = () => (
    <div className="p-3 pl-0">
        <SectionTitle>
            SSH Tunnel Configuration
        </SectionTitle>
        <div className="grid grid-cols-4 gap-x-5 gap-y-8 px-4 pt-8">
            {getSSHFields('sshTunnelConfiguration')}
        </div>
        <Collapse title="Jump Server Configuration" className="mx-4 mt-8">
            <SectionTitle>
                Jump Server Configuration
            </SectionTitle>
            <div className="grid grid-cols-4 gap-x-5 gap-y-8 px-4 pt-8">
                {getSSHFields('sshTunnelConfiguration.jumpConfiguration')}
            </div>
        </Collapse>
    </div>
);
