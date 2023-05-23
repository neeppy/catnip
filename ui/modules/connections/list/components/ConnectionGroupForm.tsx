import { Form, String$, Submit$ } from '$components/form';
import { Typography } from '$components';

export function ConnectionGroupForm() {
    async function saveGroup(data: any) {
        console.log(data);
    }

    return (
        <div className="p-4 w-[32rem] bg-surface-400 rounded-md">
            <Form initialValues={null} config={{ submit: { label: 'Create Group' } }}>
                <Typography as="h1" intent="h1" className="mb-8">
                    Create New Group
                </Typography>
                <String$ name="name" label="Group Name" placeholder="Insert Group Name" />
                <div className="flex justify-end mt-8">
                    <Submit$ action={saveGroup} />
                </div>
            </Form>
        </div>
    );
}
