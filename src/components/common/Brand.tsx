import React from 'react';
import { View, StyleSheet, TextStyle } from 'react-native';
import { Txt, s } from './UI';

export const Brand: React.FC<{ small?: boolean; subtitle?: boolean }> = ({ small = false, subtitle = false }) => {
  return (
    <View style={[s.row, { gap: 8, alignItems: 'center' }]}>
      <View
        style={{
          width: small ? 28 : 34,
          height: small ? 30 : 36,
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        <View
          style={{
            width: small ? 11 : 13,
            height: small ? 25 : 30,
            backgroundColor: '#FFFFFF',
            transform: [{ skewX: '-26deg' }],
            position: 'absolute',
            left: 5,
            borderRadius: 2,
          }}
        />
        <View
          style={{
            width: small ? 10 : 12,
            height: small ? 17 : 21,
            backgroundColor: '#FFFFFF',
            transform: [{ skewX: '26deg' }],
            position: 'absolute',
            right: 1,
            top: small ? 8 : 9,
            borderRadius: 2,
          }}
        />
        <View
          style={{
            width: 12,
            height: 5,
            backgroundColor: '#0A0A0A',
            position: 'absolute',
            bottom: 5,
            right: 8,
          }}
        />
      </View>
      <View>
        <Txt
          bold
          style={{
            fontSize: small ? 27 : 36,
            lineHeight: small ? 36 : 46,
            fontStyle: 'italic',
            letterSpacing: -2,
            color: '#FFFFFF',
          }}
        >
          ADIX
        </Txt>
        {subtitle && (
          <Txt style={{ fontSize: 9, color: '#707070', letterSpacing: 0.5, marginTop: -3 }}>
            عالمك الرقمي، بلا حدود
          </Txt>
        )}
      </View>
    </View>
  );
};
