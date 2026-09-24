import React, { useState, useEffect } from 'react';
import { View, Pressable, Linking } from 'react-native';
import { Image } from 'expo-image';
import { DeveloperSettings } from '../../types';
import { socialFields, safeDeveloperUrl } from '../../constants/developer';
import { C, Icon, Txt, s } from '../common/UI';

export const DeveloperCard: React.FC<{
  settings: DeveloperSettings;
  compact?: boolean;
  testID?: string;
}> = ({ settings, compact = false, testID = 'developer-card' }) => {
  const [imgErr, setImgErr] = useState(false);

  useEffect(() => {
    setImgErr(false);
  }, [settings.avatar]);

  const validSocials = socialFields.flatMap(field => {
    const url = safeDeveloperUrl(settings[field.key as keyof DeveloperSettings] as string, field.key);
    return url ? [{ ...field, url }] : [];
  });

  const handleOpenLink = (url: string) => {
    Linking.openURL(url).catch(() => {});
  };

  return (
    <View testID={testID} style={[s.panel, { padding: compact ? 18 : 24, gap: 17 }]}>
      <View style={[s.row, { gap: 14, alignItems: 'flex-start' }]}>
        <View
          style={{
            width: compact ? 46 : 56,
            height: compact ? 46 : 56,
            borderRadius: 16,
            backgroundColor: '#1A1A1A',
            borderWidth: 1,
            borderColor: '#383838',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {settings.avatar && !imgErr ? (
            <Image
              source={{ uri: settings.avatar }}
              accessibilityLabel="صورة المطور"
              style={{ width: '100%', height: '100%' }}
              contentFit="cover"
              onError={() => setImgErr(true)}
            />
          ) : (
            <Icon name={settings.icon || 'code-slash-outline'} size={compact ? 24 : 28} color="#DDD" />
          )}
        </View>

        <View style={{ flex: 1, gap: 5 }}>
          <Txt style={{ color: C.muted, fontSize: 11 }}>حسابات المطور</Txt>
          {settings.showName && Boolean(settings.name) && (
            <Txt bold style={{ fontSize: compact ? 16 : 20, lineHeight: 28 }}>
              {settings.name}
            </Txt>
          )}
          {settings.showDescription && Boolean(settings.description) && (
            <Txt style={{ fontSize: 12, color: C.muted, lineHeight: 23 }}>
              {settings.description}
            </Txt>
          )}
        </View>
      </View>

      {validSocials.length > 0 && (
        <View style={[s.row, { flexWrap: 'wrap', gap: 9 }]}>
          {validSocials.map(item => {
            let labelText = item.label;
            try {
              const pathname = new URL(item.url).pathname.split('/').filter(Boolean).pop();
              if (item.key === 'website') {
                labelText = new URL(item.url).hostname;
              } else if (pathname) {
                labelText = pathname.startsWith('@') ? pathname : `@${pathname}`;
              }
            } catch {}

            return (
              <Pressable
                key={item.key}
                accessibilityRole="link"
                accessibilityLabel={`حساب المطور على ${item.label}`}
                onPress={() => handleOpenLink(item.url)}
                style={({ hovered, pressed }: any) => [
                  s.row,
                  {
                    flexGrow: compact ? 0 : 1,
                    flexShrink: 1,
                    minHeight: 46,
                    paddingHorizontal: 13,
                    paddingVertical: 9,
                    borderWidth: 1,
                    borderColor: hovered ? '#666' : C.border,
                    backgroundColor: hovered ? '#242424' : '#1A1A1A',
                    borderRadius: 9,
                    gap: 8,
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
              >
                {settings.showSocialIcons && (
                  <View>
                    <Icon name={item.icon} size={19} color="#DDD" />
                  </View>
                )}
                <View style={{ flex: 1, minWidth: 65 }}>
                  <Txt bold style={{ fontSize: 12 }}>
                    {item.label === 'Website' ? 'الموقع الإلكتروني' : item.label}
                  </Txt>
                  {!compact && (
                    <Txt numberOfLines={1} style={{ color: C.muted, fontSize: 10 }}>
                      {labelText}
                    </Txt>
                  )}
                </View>
                <Icon name="open-outline" size={14} color="#777" />
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
};
