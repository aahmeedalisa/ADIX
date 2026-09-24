import React from 'react';
import { View } from 'react-native';
import { useDeveloper } from '../../context/DeveloperContext';
import { developerVisible } from '../../constants/developer';
import { HomePosition } from '../../types';
import { DeveloperCard } from './DeveloperCard';

export const DeveloperSection: React.FC<{
  place: 'home' | 'about' | 'footer';
  position?: HomePosition;
}> = ({ place, position }) => {
  const { settings, ready } = useDeveloper();

  if (!ready || !developerVisible(settings, place, position)) {
    return null;
  }

  return (
    <View
      style={{
        marginTop: place === 'home' && position === 'top' ? 0 : 25,
        marginBottom: place === 'home' && position === 'top' ? 24 : 0,
      }}
      testID={`developer-${place}${position ? `-${position}` : ''}`}
    >
      <DeveloperCard settings={settings} compact={place === 'footer'} />
    </View>
  );
};
