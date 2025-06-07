export interface Item
{
    name: string;
    dependencies: Record<string, string>;
    files: {
        name: string;
        location: string;
    }[];
}
