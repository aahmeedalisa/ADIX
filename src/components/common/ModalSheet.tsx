import React from 'react';
import { View, Pressable, KeyboardAvoidingView, useWindowDimensions, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { C, Txt, IconButton, s } from './UI';

export const ModalSheet: React.FC<{
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  navigation: any;
  wide?: boolean;
}> = ({ title, subtitle, children, navigation, wide = false }) => {
  const { width, height } = useWindowDimensions();
  const isMobile = width < 700;

  return (
    <SafeAreaView style={styles.backdrop}>
      <Pressable
        style={StyleSheet.absoluteFill}
        onPress={() => navigation.goBack()}
        accessibilityLabel="إغلاق النافذة"
      />
      <KeyboardAvoidingView
        behavior="height"
        style={[
          styles.container,
          {
            width: isMobile ? '100%' : wide ? 880 : 600,
            maxWidth: '96%',
            height: isMobile ? '98%' : Math.min(0.9 * height, 920),
          },
        ]}
      >
        <View style={[s.row, styles.header]}>
          <View style={{ flex: 1 }}>
            <Txt bold style={{ fontSize: 21 }}>{title}</Txt>
            {subtitle ? <Txt style={{ color: C.muted, fontSize: 11, marginTop: 4 }}>{subtitle}</Txt> : null}
          </View>
          <IconButton icon="close" onPress={() => navigation.goBack()} label="إغلاق" />
        </View>
        <View style={{ flex: 1 }}>{children}</View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.82)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    backgroundColor: C.bg,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#363636',
    overflow: 'hidden',
  },
  header: {
    padding: 21,
    paddingHorizontal: 25,
    borderBottomWidth: 1,
    borderBottomColor: '#282828',
    justifyContent: 'space-between',
  },
});
