import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { useStore } from '../context/StoreContext';
import { statusLabels, money } from '../constants/catalog';
import { ModalSheet } from '../components/common/ModalSheet';
import { Page, Icon, Txt, Button, Note, s, C } from '../components/common/UI';

export const OrderDetailScreen: React.FC<{ route: any; navigation: any }> = ({
  route,
  navigation,
}) => {
  const { state } = useStore();
  const order = state.orders.find(o => o.id === route.params?.id);

  if (!order) {
    return (
      <ModalSheet title="تفاصيل الطلب" navigation={navigation}>
        <Page style={{ padding: 25 }}>
          <Txt>الطلب غير موجود أو قد تم حذفه.</Txt>
        </Page>
      </ModalSheet>
    );
  }

  const stepIndex =
    order.status === 'review'
      ? 0
      : order.status === 'processing'
      ? 2
      : order.status === 'completed'
      ? 3
      : -1;

  const timelineSteps = [
    'تم استلام الطلب',
    'التحقق من الدفع',
    'جاري تنفيذ الخدمة',
    'اكتمل الطلب بنجاح',
  ];

  return (
    <ModalSheet title="تفاصيل الطلب" subtitle={order.id} navigation={navigation}>
      <Page style={{ padding: 25 }}>
        {route.params?.created && (
          <View style={{ alignItems: 'center', gap: 10, marginBottom: 22 }}>
            <Icon name="checkmark-circle-outline" size={48} color="#899a8d" />
            <Txt bold style={{ fontSize: 22 }}>تم استلام طلبك بنجاح!</Txt>
            <Txt style={{ color: C.muted, fontSize: 12 }}>سنقوم بإشعارك لحظياً بأي تحديث.</Txt>
          </View>
        )}

        {/* Order Info Card */}
        <View style={[s.panel, { gap: 14 }]}>
          <View style={[s.row, { justifyContent: 'space-between' }]}>
            <Txt bold style={{ fontSize: 18 }}>{order.product}</Txt>
            <View style={s.badge}>
              <Txt style={{ fontSize: 11 }}>{statusLabels[order.status] || order.status}</Txt>
            </View>
          </View>

          {[
            ['رقم الطلب', order.id],
            ['التاريخ', new Date(order.date).toLocaleDateString('ar-EG')],
            ['الحساب / المعرّف', order.target],
            ['طريقة الدفع', order.method === 'wallet' ? 'محفظة ADIX' : 'شام كاش'],
            ['رقم العملية', order.transaction || 'تلقائي'],
            ['المبلغ الإجمالي', money(order.amount)],
          ].map(([label, val]) => (
            <View key={label} style={[s.row, { justifyContent: 'space-between' }]}>
              <Txt style={{ color: C.muted, fontSize: 12 }}>{label}</Txt>
              <Txt style={{ fontSize: 13, maxWidth: '65%' }}>{val}</Txt>
            </View>
          ))}
        </View>

        {/* Tracking Timeline */}
        <Txt bold style={{ marginVertical: 20 }}>تتبّع حالة الطلب</Txt>
        {order.status === 'rejected' ? (
          <Note icon="close-circle-outline">
            تم رفض هذا الطلب أثناء المراجعة. إذا تم الدفع عبر المحفظة، تم رد المبلغ إلى رصيدك فوراً.
          </Note>
        ) : (
          timelineSteps.map((step, idx) => (
            <View key={step} style={[s.row, { alignItems: 'flex-start', gap: 14 }]}>
              <View style={{ alignItems: 'center' }}>
                <View
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 14,
                    backgroundColor: idx <= stepIndex ? '#FFF' : '#222',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 1,
                    borderColor: idx <= stepIndex ? '#FFF' : '#444',
                  }}
                >
                  <Icon
                    name={idx <= stepIndex ? 'checkmark' : 'ellipse-outline'}
                    size={15}
                    color={idx <= stepIndex ? '#111' : '#666'}
                  />
                </View>
                {idx < 3 && (
                  <View
                    style={{
                      height: 24,
                      width: 2,
                      backgroundColor: idx < stepIndex ? '#888' : '#333',
                    }}
                  />
                )}
              </View>
              <View style={{ paddingTop: 3 }}>
                <Txt bold style={{ color: idx <= stepIndex ? '#EEE' : '#666', fontSize: 13 }}>
                  {step}
                </Txt>
                {idx === stepIndex && (
                  <Txt style={{ fontSize: 10, color: '#999' }}>الحالة الحالية</Txt>
                )}
              </View>
            </View>
          ))
        )}

        {/* Proof Image Preview */}
        {Boolean(order.proof) && (
          <View style={{ marginTop: 20 }}>
            <Txt bold style={{ marginBottom: 10, fontSize: 13 }}>إثبات التحويل المرفق</Txt>
            <Image
              source={{ uri: order.proof }}
              contentFit="contain"
              style={{ height: 160, backgroundColor: '#171717', borderRadius: 10 }}
            />
          </View>
        )}

        <View style={{ gap: 10, marginTop: 24 }}>
          <Button
            secondary
            label="تواصل مع الدعم الفني بخصوص الطلب"
            icon="headset-outline"
            onPress={() => navigation.navigate('Support', { orderId: order.id })}
          />
          <Button
            label="العودة إلى طلباتي"
            onPress={() => {
              navigation.popToTop();
              navigation.navigate('Main', { screen: 'Orders' });
            }}
          />
        </View>
      </Page>
    </ModalSheet>
  );
};
