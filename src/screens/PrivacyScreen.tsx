import React from 'react';
import { View } from 'react-native';
import { ModalSheet } from '../components/common/ModalSheet';
import { Page, Txt, s, C } from '../components/common/UI';

export const PrivacyScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const sections = [
    {
      title: '1. البيانات التي نجمعها',
      content:
        'نجمع فقط البيانات الضرورية لتنفيذ الخدمات، مثل: الاسم، البريد الإلكتروني، معرّف اللاعب أو رابط الحساب العام، وسجل العمليات والطلبات.',
    },
    {
      title: '2. كلمات المرور والحسابات',
      content:
        'نحن لا نطلب ولا نحفظ كلمات مرور حساباتك في الألعاب أو شبكات التواصل الاجتماعي. كما أن تسجيل الدخول عبر Google OAuth 2.0 يتم بصورة مشفرة عبر Backend ولا يتيح لنا الوصول لكلمة مرور حساب Google الخاص بك.',
    },
    {
      title: '3. حماية وتشفير البيانات',
      content:
        'نطبق أعلى معايير التشفير (HTTPS و TLS و Hashing) لحماية بياناتك ومحفظتك من أي وصول غير مصرح به.',
    },
    {
      title: '4. عدم مشاركة البيانات مع أطراف ثالثة',
      content:
        'لا نقوم ببيع أو مشاركة بياناتك الشخصية مع أي شركات إعلانية أو جهات خارجية غير معنية بتنفيذ طلبك.',
    },
  ];

  return (
    <ModalSheet title="سياسة الخصوصية" subtitle="كيف نحمي بياناتك في ADIX" navigation={navigation}>
      <Page style={{ padding: 24 }}>
        <Txt style={{ color: C.muted, fontSize: 13, lineHeight: 22, marginBottom: 18 }}>
          خصوصيتك وأمان حساباتك الرقمية هي أولويتنا القصوى في متجر ADIX.
        </Txt>

        {sections.map(sec => (
          <View key={sec.title} style={[s.panel, { marginBottom: 14 }]}>
            <Txt bold style={{ fontSize: 15, marginBottom: 8 }}>{sec.title}</Txt>
            <Txt style={{ color: '#BBB', fontSize: 12, lineHeight: 21 }}>{sec.content}</Txt>
          </View>
        ))}
      </Page>
    </ModalSheet>
  );
};
