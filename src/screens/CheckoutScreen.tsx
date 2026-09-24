import React, { useState } from 'react';
import { View, Pressable } from 'react-native';
import { products, isSocial, money } from '../constants/catalog';
import { useStore } from '../context/StoreContext';
import { ModalSheet } from '../components/common/ModalSheet';
import { Page, Icon, Txt, Button, Field, s, C } from '../components/common/UI';

export const CheckoutScreen: React.FC<{ navigation: any; route: any }> = ({
  navigation,
  route,
}) => {
  const { state, addOrder, showToast } = useStore();
  const product = products.find(p => p.id === route.params?.id) || products[0];
  const pack = route.params?.pack || 1;

  const [targetAccount, setTargetAccount] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [method, setMethod] = useState<'sham' | 'wallet'>('sham');
  const [formError, setFormError] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const subtotal = product.price * pack;
  const finalTotal = +(subtotal * (1 - discountPercent)).toFixed(2);

  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (!code) return;

    if (code === 'ADIX10') {
      setDiscountPercent(0.1);
      showToast('تم تطبيق كود الخصم 10% بنجاح');
    } else if (code === 'SAVE5') {
      if (subtotal >= 10) {
        setDiscountPercent(0.05);
        showToast('تم تطبيق خصم 5% بنجاح');
      } else {
        showToast('الحد الأدنى لاستخدام SAVE5 هو 10$');
      }
    } else if (code === 'GOOGLE20') {
      setDiscountPercent(0.2);
      showToast('تم تطبيق خصم Google الخاص 20% بنجاح');
    } else {
      setDiscountPercent(0);
      showToast('كود الخصم غير صحيح أو منتهي الصلاحية');
    }
  };

  const handleProceed = () => {
    if (!targetAccount.trim()) {
      return setFormError('يرجى إدخال بيانات الخدمة المطلوبة');
    }

    if (isSocial(product.category) && !/^https?:\/\/.+\..+/i.test(targetAccount.trim()) && !targetAccount.startsWith('@')) {
      return setFormError('أدخل رابط الحساب أو اليوزر نيم @username');
    }

    if (product.category === 'games' && targetAccount.trim().length < 3) {
      return setFormError('أدخل معرّف لاعب صحيح (Player ID)');
    }

    if (!agreeTerms) {
      return setFormError('يرجى الموافقة على شروط تنفيذ الطلب');
    }

    if (method === 'wallet' && state.balance < finalTotal) {
      return setFormError('رصيد محفظتك غير كافٍ. اختر شام كاش أو أضف رصيدًا إلى محفظتك.');
    }

    setFormError('');

    const orderPayload = {
      product: product.name,
      productId: product.id,
      target: targetAccount.trim(),
      quantity: pack,
      amount: finalTotal,
      kind: 'order' as const,
      method,
    };

    if (method === 'wallet') {
      const created = addOrder({ ...orderPayload, transaction: 'WALLET-AUTO' }, true);
      navigation.replace('OrderDetail', { id: created.id, created: true });
    } else {
      navigation.navigate('Payment', { order: orderPayload });
    }
  };

  return (
    <ModalSheet title="إنشاء الطلب" subtitle="خطوة واحدة تفصلك عن خدمتك" navigation={navigation}>
      <Page style={{ padding: 25 }}>
        {/* Service summary card */}
        <View style={[s.panel, s.row, { marginBottom: 20 }]}>
          <Icon name={product.icon} size={30} color={product.color || '#DDD'} />
          <View style={{ flex: 1 }}>
            <Txt bold>{product.name}</Txt>
            <Txt style={{ color: C.muted, fontSize: 12 }}>
              {pack} × {product.unit}
            </Txt>
          </View>
          <Txt bold style={{ fontSize: 20 }}>{money(subtotal)}</Txt>
        </View>

        {/* Input Target */}
        <Field
          label={
            isSocial(product.category)
              ? 'رابط الحساب أو المنشور / اسم المستخدم'
              : product.category === 'games'
              ? 'معرّف اللاعب (Player ID)'
              : 'البريد الإلكتروني لاستلام الخدمة'
          }
          value={targetAccount}
          onChangeText={setTargetAccount}
          placeholder={
            isSocial(product.category)
              ? 'https://instagram.com/username أو @username'
              : product.category === 'games'
              ? 'مثال: 5192849182'
              : 'name@example.com'
          }
          keyboardType={product.category === 'games' ? 'number-pad' : 'default'}
          autoCapitalize="none"
        />

        {/* Coupon Code */}
        <Txt bold style={{ marginBottom: 8, fontSize: 13 }}>كود الخصم (اختياري)</Txt>
        <View style={[s.row, { alignItems: 'flex-start', marginBottom: 16 }]}>
          <View style={{ flex: 1 }}>
            <Field
              value={couponCode}
              onChangeText={setCouponCode}
              placeholder="مثال: ADIX10"
              autoCapitalize="characters"
            />
          </View>
          <Button
            label="تطبيق"
            secondary
            onPress={handleApplyCoupon}
            style={{ marginTop: 0, minHeight: 49 }}
          />
        </View>

        {/* Payment Method Selector */}
        <Txt bold style={{ marginBottom: 12 }}>طريقة الدفع</Txt>
        {[
          {
            id: 'sham',
            title: 'شام كاش (تحويل مباشر)',
            sub: 'تحويل يدوي وإرفاق إشعار التحويل',
            icon: 'swap-horizontal-outline',
          },
          {
            id: 'wallet',
            title: 'محفظة ADIX الإلكترونية',
            sub: `الرصيد المتاح: ${money(state.balance)}`,
            icon: 'wallet-outline',
          },
        ].map(item => (
          <Pressable
            key={item.id}
            onPress={() => setMethod(item.id as any)}
            style={[
              s.panel,
              s.row,
              {
                padding: 15,
                marginBottom: 10,
                borderColor: method === item.id ? '#FFF' : '#303030',
              },
            ]}
          >
            <Icon name={item.icon} size={23} />
            <View style={{ flex: 1 }}>
              <Txt bold style={{ fontSize: 14 }}>{item.title}</Txt>
              <Txt style={{ fontSize: 11, color: C.muted }}>{item.sub}</Txt>
            </View>
            <Icon
              name={method === item.id ? 'radio-button-on' : 'radio-button-off'}
              size={20}
              color={method === item.id ? '#FFF' : '#777'}
            />
          </Pressable>
        ))}

        {/* Price Breakdown */}
        <View style={[s.panel, { marginTop: 12 }]}>
          <View style={[s.row, { justifyContent: 'space-between' }]}>
            <Txt style={{ color: C.muted }}>قيمة الخدمة</Txt>
            <Txt>{money(subtotal)}</Txt>
          </View>
          {discountPercent > 0 && (
            <View style={[s.row, { justifyContent: 'space-between', marginTop: 8 }]}>
              <Txt style={{ color: '#899a8d' }}>الخصم ({discountPercent * 100}%)</Txt>
              <Txt style={{ color: '#899a8d' }}>−{money(subtotal * discountPercent)}</Txt>
            </View>
          )}
          <View style={s.line} />
          <View style={[s.row, { justifyContent: 'space-between' }]}>
            <Txt bold>الإجمالي النهائي</Txt>
            <Txt bold style={{ fontSize: 24 }}>{money(finalTotal)}</Txt>
          </View>
        </View>

        {/* Agreement Checkbox */}
        <Pressable
          onPress={() => setAgreeTerms(!agreeTerms)}
          style={[s.row, { marginVertical: 18, alignItems: 'flex-start' }]}
        >
          <Icon name={agreeTerms ? 'checkbox' : 'square-outline'} size={21} color="#FFF" />
          <Txt style={{ flex: 1, fontSize: 12, color: C.muted, lineHeight: 19 }}>
            أوافق على شروط وسياسة الخدمة، وأؤكد صحة الحساب والبيانات المدخلة.
          </Txt>
        </Pressable>

        {formError ? (
          <Txt style={{ color: '#e74c3c', marginBottom: 15, fontSize: 12 }}>{formError}</Txt>
        ) : null}

        <Button label="تأكيد ومتابعة الدفع" icon="arrow-back" onPress={handleProceed} />
      </Page>
    </ModalSheet>
  );
};
