import React, { useState } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useStore } from '../context/StoreContext';
import { ModalSheet } from '../components/common/ModalSheet';
import { money } from '../constants/catalog';
import { Page, Icon, Txt, Button, Field, Note, s, C } from '../components/common/UI';

export const PaymentScreen: React.FC<{ route: any; navigation: any }> = ({ route, navigation }) => {
  const { state, showToast } = useStore();
  const isDeposit = Boolean(route.params?.deposit);
  const [depositAmount, setDepositAmount] = useState('10');
  const [errorMsg, setErrorMsg] = useState('');

  const targetAmount = isDeposit ? Number(depositAmount) : route.params?.order?.amount || 0;
  const shamName = state.settings.shamName || 'ADIX • حساب موثق';
  const shamNumber = state.settings.shamNumber || 'ADIX-DEMO-0001';

  const handleCopyAccount = async () => {
    await Clipboard.setStringAsync(shamNumber);
    showToast('تم نسخ رقم الحساب إلى الحافظة');
  };

  const handleContinue = () => {
    if (isDeposit && (!Number.isFinite(targetAmount) || targetAmount < 1 || targetAmount > 10000)) {
      return setErrorMsg('أدخل مبلغًا صحيحًا بين 1 و 10,000 دولار');
    }
    setErrorMsg('');
    navigation.navigate('Proof', {
      order: isDeposit
        ? {
            product: 'إضافة رصيد للمحفظة',
            target: 'ADIX Wallet',
            quantity: 1,
            amount: targetAmount,
            kind: 'deposit',
            method: 'sham',
          }
        : route.params?.order,
    });
  };

  return (
    <ModalSheet
      title={isDeposit ? 'إيداع رصيد بالمحفظة' : 'الدفع عبر شام كاش'}
      subtitle="تحويل يدوي مباشر • مراجعة سريعة"
      navigation={navigation}
    >
      <Page style={{ padding: 25 }}>
        {/* Header Badge */}
        <View style={{ alignItems: 'center', padding: 18, gap: 8 }}>
          <View style={styles.iconCircle}>
            <Icon name="swap-horizontal" size={32} color="#FFF" />
          </View>
          <Txt bold style={{ fontSize: 22 }}>Sham Cash • شام كاش</Txt>
          <Txt style={{ color: C.muted, fontSize: 12 }}>
            قم بالتحويل للحساب أدناه ثم أرفق إشعار التحويل
          </Txt>
        </View>

        {isDeposit && (
          <Field
            label="المبلغ المراد شحنه (USD)"
            keyboardType="decimal-pad"
            value={depositAmount}
            onChangeText={setDepositAmount}
            placeholder="10.00"
          />
        )}

        {/* Payment Account Details Panel */}
        <View style={[s.panel, { marginBottom: 20, gap: 16 }]}>
          <View style={[s.row, { justifyContent: 'space-between' }]}>
            <Txt style={{ color: C.muted }}>المبلغ المطلوب تحويله</Txt>
            <Txt bold style={{ fontSize: 26 }}>{money(targetAmount)}</Txt>
          </View>

          <View style={{ height: 1, backgroundColor: '#282828' }} />

          <View>
            <Txt style={{ fontSize: 11, color: C.muted }}>اسم المستفيد</Txt>
            <Txt bold style={{ marginTop: 4 }}>{shamName}</Txt>
          </View>

          <View style={[s.row, { justifyContent: 'space-between' }]}>
            <View>
              <Txt style={{ fontSize: 11, color: C.muted }}>رقم حساب شام كاش</Txt>
              <Txt bold style={{ marginTop: 4, letterSpacing: 1 }}>{shamNumber}</Txt>
            </View>
            <Pressable onPress={handleCopyAccount} style={s.iconBtn}>
              <Icon name="copy-outline" size={18} />
            </Pressable>
          </View>
        </View>

        {/* Steps */}
        <View style={{ gap: 12, marginVertical: 18 }}>
          {[
            'حوّل المبلغ المحدد إلى حساب شام كاش الموضح أعلاه',
            'التقط صورة لإشعار التحويل أو احتفظ برقم العملية',
            'اضغط على متابعة لرفع إشعار الدفع وتأكيد طلبك',
          ].map((text, idx) => (
            <View key={idx} style={s.row}>
              <View style={styles.stepNum}>
                <Txt style={{ fontSize: 11 }}>{idx + 1}</Txt>
              </View>
              <Txt style={{ fontSize: 12, color: '#BBB', flex: 1 }}>{text}</Txt>
            </View>
          ))}
        </View>

        {errorMsg ? (
          <Txt style={{ color: '#d99', marginBottom: 14, fontSize: 12 }}>{errorMsg}</Txt>
        ) : null}

        <Button label="متابعة إلى إرفاق الإثبات" icon="arrow-back" onPress={handleContinue} />
      </Page>
    </ModalSheet>
  );
};

const styles = StyleSheet.create({
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#222',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNum: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#262626',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
