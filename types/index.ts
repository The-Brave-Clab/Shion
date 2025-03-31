export type ArchiveItem = {
  id: string;
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  attributes?: Record<string, any>;
  relationships?: Record<string, null | RelationshipData>;
};

export type RelationshipData = {
  data: ArchiveItem | ArchiveItem[] | null;
};
