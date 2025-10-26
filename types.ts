
export interface WebChunk {
  web: {
    uri: string;
    title: string;
  };
}

export interface MapsChunk {
  maps: {
    uri: string;
    title: string;
    placeAnswerSources?: {
        reviewSnippets?: {
            uri: string;
            title: string;
            text: string;
        }[];
    };
  };
}

export type GroundingChunk = WebChunk | MapsChunk;
