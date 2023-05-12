import { useFormContext } from 'react-hook-form';
import { SQLiteConnection } from 'common/models/Connection';
import { Button, Input } from '$components';
import { SectionTitle } from '../../components/SectionTitle';

export const ConnectionDetailsSection = () => {
    const { register, setValue } = useFormContext<SQLiteConnection>();

    return (
        <div className="p-3">
            <SectionTitle className="">
                Connection Details
            </SectionTitle>
            <div className="grid grid-cols-4 gap-5 p-6 items-end">
                <Input label="SQLite File Path" className="col-span-3" {...register('path')} />
                <Button size="md" scheme="transparent" onClick={browseFileSystem}>
                    Browse...
                </Button>
            </div>
        </div>
    );

    async function browseFileSystem() {
        const path = await interop.control.fileSystemSearch();

        path && setValue('path', path);
    }
};
