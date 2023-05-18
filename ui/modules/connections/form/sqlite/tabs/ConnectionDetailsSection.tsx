import { File$ } from '$components/form';
import { SectionTitle } from '../../components/SectionTitle';

export const ConnectionDetailsSection = () => (
    <div className="">
        <SectionTitle className="">
            Connection Details
        </SectionTitle>
        <File$ name="path" />
    </div>
);
