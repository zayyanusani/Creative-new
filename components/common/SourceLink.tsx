
import React from 'react';
import { GroundingChunk, WebChunk, MapsChunk } from '../../types';

interface SourceLinkProps {
  source: GroundingChunk;
}

const SourceLink: React.FC<SourceLinkProps> = ({ source }) => {
  const isWebChunk = (s: GroundingChunk): s is WebChunk => 'web' in s;
  const isMapsChunk = (s: GroundingChunk): s is MapsChunk => 'maps' in s;

  if (isWebChunk(source)) {
    return (
      <li>
        <a href={source.web.uri} target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:underline">
          [Web] {source.web.title}
        </a>
      </li>
    );
  }

  if (isMapsChunk(source)) {
    return (
      <li>
        <a href={source.maps.uri} target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline">
          [Map] {source.maps.title}
        </a>
      </li>
    );
  }

  return null;
};

export default SourceLink;
