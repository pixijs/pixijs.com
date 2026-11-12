export interface Item {
  name: string;
  /** The package the example is for; names are unique within a package */
  pkg: '2d' | '3d';
  dependencies: Record<string, string>;
  /** The H1 of the example's README; without one, the title comes from the name */
  title?: string;
  description: string;
  files: {
    name: string;
    location: string;
    /** Shared code the example imports, which gets no tab in the editor */
    hidden?: boolean;
  }[];
  hidden?: boolean;
}
