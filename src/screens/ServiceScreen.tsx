import React, { useState } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { products, isSocial, money } from '../constants/catalog';
import { ModalSheet } from '../components/common/ModalSheet';
import { Page, Icon, Txt, Button, Note, s, C } from '../components/common/UI';

export const ServiceScreen: React.FC<{ route: any; navigation: any }> = ({ route, navigation }) => {
  const product = products.find(p => p.id === route.params?.id) || products[0];
  const [pack, setPack] = useState(1);
  const social = isSocial(product.category);

  return (
    <ModalSheet title="تفاصيل الخدمة" subtitle={product.name} navigation={navigation}>
      <Page style={{ padding: 25 }}>
        {/* Banner / Icon */}
        <View style={styles.banner}>
          {product.image ? (
            <Image source={product.image} style={StyleSheet.absoluteFill} contentFit="cover" />
          ) : (
            <Icon name={product.icon} size={70} color={product.color || 'white'} />
          )}
        </View>

        <View style={[s.row, { justifyContent: 'space-between' }]}>
          <View style={{ flex: 1 }}>
            <Txt bold style={{ fontSize: 24 }}>{product.name}</Txt>
            <Txt style={{ color: C.muted, marginTop: 4 }}>{product.subtitle}</Txt>
          </View>
          <View style={s.badge}>
            <Txt style={{ fontSize: 10 }}>متاح للطلب</Txt>
          </View>
        </View>

        <View style={s.line} />

        {/* Quantity Pack Selector */}
        <Txt bold style={{ marginBottom: 12 }}>اختر الباقة المناسبة</Txt>
        <View style={[s.row, { gap: 10 }]}>
          {[1, 5, 10].map(multiplier => (
            <Pressable
              key={multiplier}
              onPress={() => setPack(multiplier)}
              style={{
                flex: 1,
                padding: 14,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: pack === multiplier ? '#DDD' : '#333',
                backgroundColor: pack === multiplier ? '#2A2A2A' : '#171717',
                alignItems: 'center',
              }}
            >
              <Txt bold style={{ fontSize: 13, textAlign: 'center' }}>
                {multiplier === 1 ? product.unit : `${multiplier} × ${product.unit}`}
              </Txt>
              <Txt bold style={{ fontSize: 19, marginTop: 8 }}>
                {money(product.price * multiplier)}
              </Txt>
              {pack === multiplier && (
                <Icon name="checkmark-circle" size={15} style={{ marginTop: 5 }} color="#FFF" />
              )}
            </Pressable>
          ))}
        </View>

        {/* Trust Points */}
        <View style={{ marginTop: 20, gap: 10 }}>
          <View style={s.row}>
            <Icon name="flash-outline" size={17} color="#AAA" />
            <Txt style={{ fontSize: 12, color: '#AAA' }}>يبدأ التنفيذ فور اعتماد إثبات الدفع أو من رصيد المحفظة</Txt>
          </View>
          <View style={s.row}>
            <Icon name="lock-closed-outline" size={17} color="#AAA" />
            <Txt style={{ fontSize: 12, color: '#AAA' }}>لا نطلب كلمة مرور حسابك مطلقاً - المعرّف فقط</Txt>
          </View>
        </View>

        {/* Disclaimer Note */}
        <View style={{ marginVertical: 20 }}>
          <Note>
            {social
              ? 'يجب أن يكون حسابك عاماً وليس خاصاً. التفاعل يبدأ خلال دقائق من التأكيد.'
              : 'تأكد من كتابة معرّف اللاعب (Player ID) بدقة لضمان وصول الشحن لحسابك مباشرة.'}
          </Note>
        </View>

        <Button
          label={`متابعة الطلب • ${money(product.price * pack)}`}
          icon="arrow-back"
          onPress={() => navigation.navigate('Checkout', { id: product.id, pack })}
        />
      </Page>
    </ModalSheet>
  );
};

const styles = StyleSheet.create({
  banner: {
    height: 160,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#1E1E1E',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
});
