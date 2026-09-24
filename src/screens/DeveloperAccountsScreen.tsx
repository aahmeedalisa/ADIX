import React, { useEffect } from 'react';
import { useDeveloper } from '../context/DeveloperContext';
import { developerVisible } from '../constants/developer';
import { ModalSheet } from '../components/common/ModalSheet';
import { DeveloperCard } from '../components/developer/DeveloperCard';
import { Page } from '../components/common/UI';

export const DeveloperAccountsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { settings, ready } = useDeveloper();
  const isVisible = ready && developerVisible(settings, 'menu');

  useEffect(() => {
    if (ready && !isVisible) {
      navigation.goBack();
    }
  }, [ready, isVisible, navigation]);

  if (!isVisible) return null;

  return (
    <ModalSheet
      title="حسابات المطور"
      subtitle="خلف التجربة، اهتمام بكل التفاصيل"
      navigation={navigation}
    >
      <Page style={{ padding: 24 }}>
        <DeveloperCard settings={settings} />
      </Page>
    </ModalSheet>
  );
};
