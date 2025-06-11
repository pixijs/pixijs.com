export interface Item
{
    name: string;
    dependencies: Record<string, string>;
    description: string;
    files: {
        name: string;
        location: string;
    }[];
}
