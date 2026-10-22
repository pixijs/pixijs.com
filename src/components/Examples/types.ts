export interface Item {
  name: string;
  /** The package the example is for; names are unique within a package */
  pkg: '2d' | '3d';
  dependencies: Record<string, string>;
  description: string;
  files: {
    name: string;
    location: string;
  }[];
  hidden?: boolean;
}
