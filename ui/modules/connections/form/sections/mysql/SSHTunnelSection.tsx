import { useFormContext, UseFormReturn } from 'react-hook-form';
import { Collapse, Input } from '$components';
import { SectionTitle } from '../../components/SectionTitle';

const getSSHFields = (name: string, register: UseFormReturn['register']) => (
    <>
        <Input
            {...register(`${name}.hostname`)}
            label="Hostname"
            placeholder="example.com"
            containerClassName="col-span-3"
        />
        <Input
            {...register(`${name}.port`)}
            label="Port"
            placeholder="22"
        />
        <Input
            {...register(`${name}.username`)}
            label="Username"
            containerClassName="col-span-2"
        />
        <Input
            {...register(`${name}.password`)}
            label="Password"
            type="password"
            containerClassName="col-span-2"
            selectOnFocus
        />
    </>
)

export function SSHTunnelSection() {
    const { register } = useFormContext();

    return (
        <div className="p-3">
            <SectionTitle>
                SSH Tunnel Configuration
            </SectionTitle>
            <div className="grid grid-cols-4 gap-5 p-6">
                {getSSHFields('sshTunnelConfiguration', register)}
            </div>
            <Collapse title="Jump Server Configuration">
                <SectionTitle>
                    Jump Server Configuration
                </SectionTitle>
                <div className="grid grid-cols-4 gap-5 p-6">
                    {getSSHFields('sshTunnelConfiguration.jumpConfiguration', register)}
                </div>
            </Collapse>
        </div>
    );
}
