import { useFormContext } from "react-hook-form";

interface ConstantProps {
    name: string;
    value: string | number;
}

export function Constant$({ name, value }: ConstantProps) {
    const form = useFormContext();

    return (
        <input type="hidden" {...form.register(name)} value={value} />
    );
}
