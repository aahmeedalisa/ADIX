import React from 'react';
import { View } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useStore } from '../context/StoreContext';
import { ModalSheet } from '../components/common/ModalSheet';
import { Page, Icon, Txt, Button, Note, s, C } from '../components/common/UI';

export const CouponsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { showToast } = useStore();

  const couponList = [
    {
      code: 'ADIX10',
      percent: '10%',
      title: 'خصم الترحيب في أديكس',
      desc: 'خصم 10% على طلبك في متجر ADIX.',
      terms: 'صالح لجميع الخدمات والمنتجات الرقمية • غير مشروط بحد أدنى',
    },
    {
      code: 'SAVE5',
      percent: '5%',
      title: 'توفير الطلبات الكبيرة',
      desc: 'خصم 5% على أي طلب بقيمة 10 دولار أو أكثر.',
      terms: 'الحد الأدنى للطلب 10$ • يمكن استخدامه عدة مرات',
    },
    {
      code: 'GOOGLE20',
      percent: '20%',
      title: 'عرض تسجيل الدخول بحساب Google',
      desc: 'خصم 20% مخصص لمستخدمي تسجيل الدخول السريع عبر Google.',
      terms: 'يطبق عند تسجيل الدخول عبر Google • لمرة واحدة لكل مستخدم',
    },
  ];

  const handleCopy = async (code: string) => {
    await Clipboard.setStringAsync(code);
    showToast(`تم نسخ الكود ${code} بنجاح. أضفه في صفحة إنشاء الطلب.`);
  };

  return (
    <ModalSheet title="الكوبونات والعروض" subtitle="قليل من التوفير، وكثير من المتعة" navigation={navigation}>
      <Page style={{ padding: 24 }}>
        {couponList.map(item => (
          <View key={item.code} style={[s.panel, { marginBottom: 18, padding: 22 }]}>
            <View style={[s.row, { justifyContent: 'space-between', marginBottom: 10 }]}>
              <Icon name="ticket-outline" size={26} color="#CCC" />
              <Txt bold style={{ fontSize: 36, lineHeight: 46 }}>{item.percent}</Txt>
            </View>

            <Txt bold style={{ fontSize: 18 }}>{item.title}</Txt>
            <Txt style={{ color: C.muted, fontSize: 13, marginTop: 4 }}>{item.desc}</Txt>

            <View style={{ borderTopWidth: 1, borderTopColor: '#333', borderStyle: 'dashed', marginVertical: 18 }} />

            <View style={[s.row, { justifyContent: 'space-between' }]}>
              <Txt bold style={{ fontSize: 20, letterSpacing: 2 }}>{item.code}</Txt>
              <Button
                label="نسخ الكود"
                icon="copy-outline"
                secondary
                onPress={() => handleCopy(item.code)}
              />
            </View>

            <Txt style={{ color: '#777', fontSize: 10, marginTop: 14 }}>{item.terms}</Txt>
          </View>
        ))}

        <Note>
          يتم تطبيق الخصم مباشرة عند إدخال الكود في خانة كود الخصم في صفحة إنشاء الطلب.
        </Note>
      </Page>
    </ModalSheet>
  );
};
