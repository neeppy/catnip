import { Number$, String$ } from '$components/form';
import { SectionTitle } from '../../components/SectionTitle';

export const ConnectionDetailsSection = () => (
    <div className="p-3 pl-0">
        <SectionTitle className="">
            Connection Details
        </SectionTitle>
        <div className="grid grid-cols-4 gap-x-5 gap-y-8 px-4 pt-8">
            <String$ name="hostname" className="col-span-3" />
            <Number$ name="port" />
        </div>
        <SectionTitle className="mt-5">
            Database Parameters
        </SectionTitle>
        <div className="grid grid-cols-4 gap-x-5 gap-y-8 px-4 pt-8">
            <String$ name="databaseName" className="col-span-4" />
            <String$ name="username" className="col-span-2" />
            <String$ name="password" className="col-span-2" />
        </div>
    </div>
);
